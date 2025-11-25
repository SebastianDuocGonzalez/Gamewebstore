import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Container, Alert, Spinner, Badge } from 'react-bootstrap';
import { getAuthHeader } from '../../services/auth.service';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Importante: Asegúrate de tener este endpoint en tu UserController de SpringBoot

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users', { headers: getAuthHeader() });
      setUsers(response.data);
    } catch (err) {
      // Si falla, mostramos un mensaje amigable (probable falta de endpoint en backend)
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError('Error: No se encontró el endpoint /api/v1/users en el backend.');
      } else {
        setError('Error al cargar usuarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este usuario?')) {
      try {
        await api.delete(`/users/${id}`, { headers: getAuthHeader() });
        fetchUsers();
        alert('Usuario eliminado');
      } catch (err) {
        alert('Error al eliminar usuario. Puede que tenga órdenes asociadas.');
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Gestión de Usuarios</h2>

      {error && <Alert variant="warning"><i className="bi bi-exclamation-triangle me-2"></i>{error}</Alert>}

      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <Table striped bordered hover variant="dark" className="mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.rol === 'ADMIN' ? 'danger' : 'primary'}>
                        {user.rol}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.rol === 'ADMIN'} // Evitar borrar admins por seguridad básica
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No se encontraron usuarios o no hay conexión.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default AdminUsers;