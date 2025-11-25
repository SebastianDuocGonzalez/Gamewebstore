import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service'; // Importamos la función nueva

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (formData.password.length < 4) {
      return setError('La contraseña debe tener al menos 4 caracteres.');
    }

    setLoading(true);

    try {
      // 2. Llamada al servicio de registro
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      // 3. Éxito: Redirigir al login
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (err) {
      console.error(err);
      // Manejo de errores del backend (ej: Email duplicado)
      if (err.response && err.response.status === 409) {
        setError('El correo electrónico ya está registrado.');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="bg-dark text-white border-secondary shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary-custom">Crear Cuenta</h2>
                  <p className="text-muted">Únete a la comunidad GameZone Pro</p>
                </div>

                {error && <Alert variant="danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      placeholder="Tu nombre"
                      className="bg-secondary text-white border-0"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      className="bg-secondary text-white border-0"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="********"
                      className="bg-secondary text-white border-0"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="********"
                      className="bg-secondary text-white border-0"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={loading} className="btn-lg btn-custom">
                      {loading ? <Spinner animation="border" size="sm" /> : 'Registrarse'}
                    </Button>
                  </div>
                </Form>

                <div className="mt-4 text-center">
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link to="/login" className="text-primary text-decoration-none fw-bold">
                    Inicia Sesión aquí
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;