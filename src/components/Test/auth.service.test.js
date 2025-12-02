import * as AuthService from '../../services/auth.service';
import api from '../../services/api';

describe('Auth Service', () => {
  
  // Limpiar mocks y localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear();
    spyOn(api, 'get'); // Espiamos el método get de axios
    spyOn(api, 'post'); // Espiamos el método post de axios
  });

  it('debería realizar el login correctamente y guardar el token', async () => {
    // 1. Preparamos los datos simulados
    const mockEmail = 'test@duocuc.cl';
    const mockPass = '123456';
    const mockUserResponse = { 
      data: { nombre: 'Test User', email: mockEmail, rol: 'ADMIN' } 
    };

    // 2. Configuramos el comportamiento del mock de la API
    // Cuando se llame a api.get, devolvemos la respuesta simulada
    api.get.and.returnValue(Promise.resolve(mockUserResponse));

    // 3. Ejecutamos la función a probar
    const result = await AuthService.login(mockEmail, mockPass);

    // 4. Verificaciones (Expects)
    expect(api.get).toHaveBeenCalled(); // Se llamó a la API
    expect(localStorage.getItem('user')).toBeTruthy(); // Se guardó el usuario
    expect(localStorage.getItem('auth_token')).toContain('Basic'); // Se guardó el token
    expect(result.nombre).toBe('Test User');
  });

  it('debería hacer logout y limpiar localStorage', () => {
    // Pre-condición: Poner basura en el storage
    localStorage.setItem('user', 'algo');
    localStorage.setItem('auth_token', 'token');

    // Acción
    AuthService.logout();

    // Verificación
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('debería obtener el usuario actual si existe en storage', () => {
    const mockUser = { nombre: 'Juan' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const user = AuthService.getCurrentUser();

    expect(user).toEqual(mockUser);
  });
});