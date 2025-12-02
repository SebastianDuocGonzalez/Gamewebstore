import { getDashboardStats } from '../../services/admin.service';

describe('Admin Service', () => {
  // Eliminamos los beforeEach/afterEach con jasmine.clock() para simplificar

  it('debería retornar estadísticas correctamente (espera real)', async () => {
    // Llamamos al servicio
    const stats = await getDashboardStats();

    // Verificamos los datos
    expect(stats).not.toBeNull();
    expect(stats.totalProductos).toBe(12); // Valor esperado según tu mock
    expect(stats.totalVentas).toBe(1500000);
  });
});