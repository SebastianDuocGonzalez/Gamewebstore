import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, clearError, error } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      // Intentamos loguearnos usando la función del contexto
      const result = await login(email, password);
      
      if (result.success) {
        // Redirección inteligente basada en el rol
        if (result.rol === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/'); // O al perfil/catálogo
        }
      }
    } catch (err) {
      console.error(err);
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
                  <h2 className="fw-bold">Bienvenido de nuevo</h2>
                  <p className="text-muted">Ingresa a tu cuenta GameZone Pro</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="bg-dark text-white border-secondary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      className="bg-dark text-white border-secondary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={loading} className="btn-lg">
                      {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </Button>
                  </div>
                </Form>

                <div className="mt-4 text-center">
                  <span className="text-muted">¿No tienes cuenta? </span>
                  <Link to="/register" className="text-primary text-decoration-none">
                    Regístrate aquí
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

export default Login;