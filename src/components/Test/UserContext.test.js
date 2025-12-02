import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { UserProvider, useUser } from '../../contexts/UserContext'; 
import api from '../../services/api'; // Importamos API en lugar del servicio auth

const UserTestComp = () => {
  const { user, login, isAuthenticated, hasRole } = useUser();
  
  const handleLogin = async () => {
    await login('test@test.com', '123456');
  };

  return (
    <div>
      <div id="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'GUEST'}</div>
      <div id="user-name">{user ? user.nombre : ''}</div>
      <button id="login-btn" onClick={handleLogin}>Login</button>
      <div id="is-admin">{hasRole('ADMIN') ? 'YES' : 'NO'}</div>
    </div>
  );
};

describe('UserContext', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    // Espiamos api.get porque auth.service llama a api.get('/auth/me')
    spyOn(api, 'get'); 
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(container);
    container = null;
    root = null;
  });

  it('debería actualizar el estado cuando el login es exitoso', async () => {
    // 1. Configurar Mock de la API
    // UserContext llama a login -> Auth.login -> api.get('/auth/me')
    const mockResponse = { data: { nombre: 'Sebastián', email: 'test@test.com', rol: 'ADMIN' } };
    api.get.and.returnValue(Promise.resolve(mockResponse));

    // 2. Renderizar
    await act(async () => {
      root.render(
        <UserProvider>
          <UserTestComp />
        </UserProvider>
      );
    });

    const loginBtn = container.querySelector('#login-btn');
    
    // 3. Ejecutar Login
    await act(async () => {
      loginBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const statusDiv = container.querySelector('#auth-status');
    const nameDiv = container.querySelector('#user-name');
    const roleDiv = container.querySelector('#is-admin');
    
    expect(statusDiv.textContent).toBe('LOGGED_IN');
    expect(nameDiv.textContent).toBe('Sebastián');
    expect(roleDiv.textContent).toBe('YES');
  });
});