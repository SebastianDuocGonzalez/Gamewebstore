import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Badge, Button, Dropdown } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';

const AppNavbar = () => {
  const { user, logout, hasRole } = useUser();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    setExpanded(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'text-primary-custom fw-bold' : 'text-white';

  return (
    <Navbar 
      expanded={expanded} 
      onToggle={() => setExpanded(!expanded)}
      className="navbar-custom" 
      variant="dark" 
      expand="lg"
    >
      <Container>
        {/* Logo estilo Gamer */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <i className="bi bi-controller fs-3 text-white"></i>
          <span className="fs-4 fw-bold text-white">GameZone <span className="text-primary-custom">Pro</span></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className={isActive('/')} onClick={() => setExpanded(false)}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/catalog" className={isActive('/catalog')} onClick={() => setExpanded(false)}>Catálogo</Nav.Link>
            <Nav.Link as={Link} to="/news" className={isActive('/news')} onClick={() => setExpanded(false)}>Noticias</Nav.Link>
            <Nav.Link as={Link} to="/events" className={isActive('/events')} onClick={() => setExpanded(false)}>Eventos</Nav.Link>
            
            {/* Botón Carrito */}
            <Nav.Link as={Link} to="/cart" className="position-relative" onClick={() => setExpanded(false)}>
              <i className="bi bi-cart3 fs-5 text-white"></i>
              {itemCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>

            {/* Menú de Usuario / Login */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" className="d-flex align-items-center gap-2 btn-sm border-0">
                  <div className="bg-primary-custom rounded-circle d-flex justify-content-center align-items-center" style={{width: 30, height: 30}}>
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span className="d-none d-lg-inline">{user.nombre}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark shadow">
                  <Dropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>Mi Perfil</Dropdown.Item>
                  
                  {/* Vistas protegidas por ROL */}
                  {(hasRole('ADMIN') || hasRole('TRABAJADOR')) && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Header className="text-primary-custom">Gestión</Dropdown.Header>
                      <Dropdown.Item as={Link} to="/admin" onClick={() => setExpanded(false)}>Dashboard</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/products" onClick={() => setExpanded(false)}>Productos</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/orders" onClick={() => setExpanded(false)}>Órdenes</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/users" onClick={() => setExpanded(false)}>Usuarios</Dropdown.Item>
                    </>
                  )}
                  
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                as={Link} 
                to="/login" // Redirigimos al Home que tiene el login o a una pagina login
                variant="outline-light" 
                className="ms-2 px-4 rounded-pill"
                onClick={() => setExpanded(false)}
              >
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;