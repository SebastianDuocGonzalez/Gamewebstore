import api from './api';

// Ahora obtenemos estadísticas REALES del backend
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/dashboard');
        return response.data; 
    } catch (error) {
        console.error("Error al obtener stats:", error);
        // Fallback en caso de error para que no rompa la UI
        return {            
          totalProductos: 0,
          totalUsuarios: 0,
          totalOrdenes: 0,
          totalVentas: 0
        };
    }
};