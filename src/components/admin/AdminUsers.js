import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // El interceptor ya maneja el token
import { Table, Button, Container, Alert, Spinner, Form, Badge } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useUser(); // Para no auto-editarse

  // Importante: Asegúrate de tener este endpoint en tu UserController de SpringBoot

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Llamada al nuevo endpoint del backend
      await api.put(`/users/${userId}/rol`, { rol: newRole });
      
      // Actualizamos la interfaz localmente para que se sienta rápido
      setUsers(users.map(u => 
        u.id === userId ? { ...u, rol: newRole } : u
      ));
      
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
        alert('Usuario eliminado');
      } catch (err) {
        alert('Error al eliminar usuario. Puede que tenga órdenes asociadas.');
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Gestión de Usuarios y Roles</h2>

      {error && <Alert variant="warning">{error}</Alert>}

      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <Table striped bordered hover variant="dark" className="mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th style={{width: '200px'}}>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    {/* Si es el mismo admin logueado, mostramos Badge fijo para evitar accidentes */}
                    {currentUser && currentUser.email === u.email ? (
                        <Badge bg="danger">ADMIN (Tú)</Badge>
                    ) : (
                        <Form.Select 
                            size="sm"
                            value={u.rol}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={
                                u.rol === 'ADMIN' ? 'bg-danger text-white border-danger' :
                                u.rol === 'TRABAJADOR' ? 'bg-warning text-dark border-warning' :
                                'bg-secondary text-white border-secondary'
                            }
                        >
                            <option value="CLIENTE">Cliente</option>
                            <option value="TRABAJADOR">Trabajador</option>
                            <option value="ADMIN">Admin</option>
                        </Form.Select>
                    )}
                  </td>
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(u.id)}
                      disabled={currentUser && currentUser.email === u.email}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
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