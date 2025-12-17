import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Container, Alert, Spinner, Form, Badge } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';


const AdminUsers = () => {
  const { user: currentUser } = useUser(); // Para no auto-editarse
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
        if (err.response && err.response.status === 403) {
        setError('Acceso denegado: No tienes permisos de Administrador.');
      } else {
        setError('Error al cargar usuarios. Revisa la conexión con el Backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const originalUsers = [...users];
    try {
      // Actualizamos la interfaz localmente para que se sienta rápido
      setUsers(users.map(u => 
        u.id === userId ? { ...u, rol: newRole } : u
      ));
      await api.put(`/users/${userId}/rol`, { rol: newRole });
      fetchUsers(); // Recargar lista para asegurar consistencia
      alert('Rol actualizado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al cambiar el rol. Verifica permisos.');
      fetchUsers(); // Revertimos cambios si falló
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
        alert('Usuario eliminado correctamente');
      } catch (err) {
        alert('Error al eliminar usuario. Puede que tenga órdenes asociadas.');
      }
    }
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <Spinner animation="border" variant="primary" />
      <p className="text-white mt-2">Cargando usuarios...</p>
    </div>
  );

  const isAdmin = currentUser?.rol === 'ADMIN';

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Gestión de Usuarios y Roles</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && users.length === 0 && !error && (
        <Alert variant="info">No hay usuarios registrados.</Alert>
      )}

      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <Table striped bordered hover variant="dark" className="mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th style={{width: '200px'}}>Rol</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    {isAdmin && currentUser && currentUser.email === u.email ? (
                      <Badge bg={u.rol === 'ADMIN' ? 'danger' : u.rol === 'TRABAJADOR' ? 'warning' : 'info'}>
                      {u.rol}
                    </Badge>
                    ) : (
                        <Form.Select 
                            size="sm"
                            value={u.rol} // Asegúrate que coincida con "ADMIN", "TRABAJADOR", etc.
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={
                                u.rol === 'ADMIN' ? 'bg-danger text-white border-danger' :
                                u.rol === 'TRABAJADOR' ? 'bg-warning text-dark border-warning' :
                                'bg-secondary text-white border-secondary'
                            }>
                            <option value="CLIENTE">CLIENTE</option>
                            <option value="TRABAJADOR">TRABAJADOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </Form.Select>
                    )}
                  </td>
                  <td>
                    {isAdmin && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(u.id)}
                      disabled={currentUser && currentUser.email === u.email}
                      title="Eliminar usuario">
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default AdminUsers;