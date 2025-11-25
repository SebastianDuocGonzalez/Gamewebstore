// Servicio temporal para datos de admin
// Cuando tu Spring Boot tenga endpoints de estadísticas, cambiarás esto por llamadas axios.

export const getDashboardStats = async () => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalProductos: 12,      // Puedes cambiar esto a axios.get('/api/v1/productos/count')
          totalUsuarios: 5,
          totalOrdenes: 3,
          totalVentas: 1500000,
          ordenesPendientes: 1,
          ordenesCompletadas: 2,
          productosDestacados: 4,
          categorias: 3
        });
      }, 500);
    });
};