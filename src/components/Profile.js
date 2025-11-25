import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Table } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para el formulario (inicializado con datos del usuario)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '' // Solo si quieres permitir cambio de pass
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e) => {
    e.preventDefault();
    // AQUÍ IRÍA LA LLAMADA AL BACKEND PARA ACTUALIZAR
    // await axios.put(...)
    alert('Funcionalidad de actualización en desarrollo');
    setIsEditing(false);
  };

  if (!user) return <div className="text-center py-5 text-white">Cargando perfil...</div>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* Columna Izquierda: Tarjeta de Usuario */}
        <Col lg={4} className="mb-4">
          <Card className="bg-dark text-white border-secondary text-center p-4 shadow">
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-primary-custom rounded-circle d-flex align-items-center justify-content-center fw-bold display-4 text-dark" 
                   style={{width: '100px', height: '100px'}}>
                {user.nombre.charAt(0).toUpperCase()}
              </div>
            </div>
            <h3 className="mb-1">{user.nombre}</h3>
            <p className="text-muted mb-3">{user.email}</p>
            <div className="mb-4">
              <Badge bg={user.rol === 'ADMIN' ? 'danger' : 'info'} className="px-3 py-2">
                {user.rol}
              </Badge>
            </div>
            
            <div className="d-grid gap-2">
              <Button variant="outline-light" onClick={() => setIsEditing(!isEditing)}>
                <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil'} me-2`}></i>
                {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </Button>
            </div>
          </Card>
        </Col>

        {/* Columna Derecha: Detalles o Formulario */}
        <Col lg={8}>
          <Card className="bg-dark text-white border-secondary shadow h-100">
            <Card.Header className="bg-transparent border-secondary">
              <h5 className="mb-0">
                {isEditing ? 'Editar Información' : 'Mis Datos'}
              </h5>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="bg-secondary text-white border-0"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email (No editable)</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="bg-secondary text-white-50 border-0"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Nueva Contraseña (Opcional)</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Dejar en blanco para mantener la actual"
                      className="bg-secondary text-white border-0"
                    />
                  </Form.Group>
                  <Button variant="success" type="submit">
                    Guardar Cambios
                  </Button>
                </Form>
              ) : (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Nombre de Usuario</small>
                      <span className="fs-5">{user.nombre}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Correo Electrónico</small>
                      <span className="fs-5">{user.email}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Fecha de Registro</small>
                      <span className="fs-5">01/01/2025</span> {/* Dato simulado */}
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Estado de Cuenta</small>
                      <span className="text-success fw-bold"><i className="bi bi-check-circle me-1"></i> Activa</span>
                    </div>
                  </div>

                  <h5 className="border-top border-secondary pt-4 mb-3">Historial de Pedidos Recientes</h5>
                  <div className="table-responsive">
                    <Table variant="dark" hover size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th># Orden</th>
                          <th>Fecha</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-3">
                            No tienes pedidos recientes.
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;