import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import AdminUsers from '../admin/AdminUsers'; // Verifica que la ruta sea correcta
import api from '../../services/api';

describe('AdminUsers Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    // Espía inicial para evitar llamadas reales al renderizar
    spyOn(api, 'get').and.returnValue(Promise.resolve({ data: [] }));
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(container);
    container = null;
    root = null;
  });

  it('debería renderizar la lista de usuarios obtenida de la API', async () => {
    // 1. Datos simulados
    const mockUsers = [
      { id: 1, nombre: 'Admin Master', email: 'admin@duoc.cl', rol: 'ADMIN' },
      { id: 2, nombre: 'Cliente Test', email: 'cliente@test.com', rol: 'CLIENTE' }
    ];

    // 2. Configurar el espía
    api.get.and.returnValue(Promise.resolve({ data: mockUsers }));

    // 3. Renderizar y esperar a useEffect
    await act(async () => {
      root.render(<AdminUsers />);
    });

    // 4. Verificaciones
    const rows = container.querySelectorAll('tbody tr');
    // Nota: Puede haber una fila extra si el componente muestra "Cargando" o "No hay datos" momentáneamente,
    // pero con el await act, deberíamos tener los datos finales.
    expect(rows.length).toBe(2); 
    
    if (rows.length > 0) {
        expect(rows[0].textContent).toContain('Admin Master');
    }
  });
});