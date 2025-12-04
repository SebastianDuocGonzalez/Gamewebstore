import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/admin.service'; // <--- CAMBIO IMPORTANTE
import { useUser } from '../../contexts/UserContext';
import { Link } from 'react-router-dom'; // Usamos Link en lugar de <a> para no recargar la página

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, hasRole } = useUser(); 

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError('Error al cargar estadísticas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Validación de seguridad simple en Frontend
 if (!hasRole('ADMIN') && !hasRole('TRABAJADOR')) {
    return (
      <div className="container py-5 mt-5">
        <div className="alert alert-danger text-center">
          <h4>Acceso Restringido</h4>
          <p>No tienes permisos para estar aquí.</p>
          <Link to="/" className="btn btn-outline-danger">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-5 mt-5 text-white">Cargando panel...</div>;


  return (
    <div className="admin-dashboard">
      <div className="container py-5">
        <h1 className="text-white mb-4">Panel de Gestión</h1>
        <p className="text-muted mb-5">
          Bienvenido, {user?.nombre} 
          <span className="badge bg-secondary ms-2">{user?.rol}</span>
        </p>

        {/* Tarjetas de Estadísticas (Solo visibles para ciertos roles si quisieras filtrar) */}
        {stats && (
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card bg-dark text-white border-primary h-100">
                <div className="card-body text-center">
                  <h3 className="text-primary">{stats.totalProductos || 0}</h3>
                  <p>Productos</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
               <div className="card bg-dark text-white border-success h-100">
                <div className="card-body text-center">
                  <h3 className="text-success">{stats.totalUsuarios || 0}</h3>
                  <p>Usuarios</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
               <div className="card bg-dark text-white border-warning h-100">
                <div className="card-body text-center">
                  <h3 className="text-warning">{stats.totalOrdenes || 0}</h3>
                  <p>Órdenes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
               <div className="card bg-dark text-white border-info h-100">
                <div className="card-body text-center">
                  <h3 className="text-info">${stats.totalVentas?.toLocaleString() || 0}</h3>
                  <p>Ventas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones Rápidas - FILTRADAS POR ROL */}
        <div className="card bg-dark border-secondary">
            <div className="card-header border-secondary text-white">Acciones Rápidas</div>
            <div className="card-body">
                <div className="row g-3">
                    {/* Solo ADMIN puede gestionar productos y usuarios */}
                    {hasRole('ADMIN') && (
                      <>
                        <div className="col-md-4">
                            <Link to="/admin/products" className="btn btn-primary w-100">
                              <i className="bi bi-box-seam me-2"></i>Gestionar Productos
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/admin/users" className="btn btn-success w-100">
                              <i className="bi bi-people me-2"></i>Gestionar Usuarios
                            </Link>
                        </div>
                      </>
                    )}
                    
                    {/* ADMIN y TRABAJADOR pueden ver órdenes */}
                    <div className="col-md-4">
                        <Link to="/admin/orders" className="btn btn-warning w-100">
                          <i className="bi bi-receipt me-2"></i>Ver Órdenes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;