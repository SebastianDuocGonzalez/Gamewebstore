import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import OrderService from '../services/order.service'; 

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useUser(); // *** CAMBIO: Verificar auth
  const navigate = useNavigate();

  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
        setMensaje({ type: 'warning', text: 'Debes iniciar sesión para comprar.' });
        // Opcional: navigate('/login');
        return;}
    try {
        setProcesando(true);
        await OrderService.createOrder(items);
        setMensaje({ type: 'success', text: '¡Compra exitosa! Revisa tu perfil.' });
        clearCart();
        setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
        console.error(error);
        setMensaje({ type: 'danger', text: 'Error al procesar la compra. Inténtalo nuevamente.' });
    } finally {
        setProcesando(false);
    }
  };
  
  // Si el carrito está vacío
  if (items.length === 0 && !mensaje) {
    return (
      <Container className="py-5 text-center" style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div className="mb-4"><i className="bi bi-cart-x display-1 text-muted"></i></div>
        <h2 className="text-white mb-3">Tu carrito está vacío</h2>
        <Button as={Link} to="/catalog" variant="primary" size="lg" className="px-5">Explorar Catálogo</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-white text-center mb-5" style={{fontFamily: 'Orbitron, sans-serif'}}>Carrito de Compras</h2>
      
      {mensaje && <Alert variant={mensaje.type}>{mensaje.text}</Alert>}

      <Row className="g-4">
        <Col lg={8}>
          <Card className="bg-dark border-secondary mb-3 text-white shadow-sm">
            <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Productos ({itemCount})</h5>
              <Button variant="outline-danger" size="sm" onClick={clearCart}><i className="bi bi-trash me-2"></i> Vaciar</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {items.map((item) => (
                <div key={item.id} className="p-3 border-bottom border-secondary d-flex align-items-center gap-3">
                  <div style={{width: '80px', height: '80px', flexShrink: 0}}>
                    <img src={item.imagen || '/assets/default.jpg'} alt={item.nombre} className="w-100 h-100 object-fit-cover rounded border border-secondary"/>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-white">{item.nombre}</h6>
                    <small className="text-muted d-block">{item.tipo}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</Button>
                    <span className="mx-2">{item.cantidad}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</Button>
                  </div>
                  <div className="text-end" style={{minWidth: '90px'}}>
                    <div className="text-success fw-bold">${(item.precio * item.cantidad).toLocaleString()}</div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}><i className="bi bi-trash"></i></Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="bg-dark border-secondary text-white shadow-sm sticky-top" style={{top: '100px'}}>
            <Card.Body>
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-4 fw-bold text-success">${total.toLocaleString()}</span>
              </div>
              <div className="d-grid gap-2">
                <Button 
                    variant="info" 
                    className="text-dark fw-bold py-2" 
                    style={{backgroundColor: '#00d4ff', border: 'none'}}
                    onClick={handleCheckout}
                    disabled={procesando}
                >
                  {procesando ? <Spinner size="sm" animation="border"/> : <><i className="bi bi-credit-card me-2"></i> PAGAR</>}
                </Button>
                <Button as={Link} to="/catalog" variant="outline-light">Continuar Comprando</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;