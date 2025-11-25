import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <Container className="py-5 text-center" style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div className="mb-4">
            <i className="bi bi-cart-x display-1 text-muted"></i>
        </div>
        <h2 className="text-white mb-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Parece que aún no has agregado juegos a tu colección.</p>
        <div>
            <Button as={Link} to="/catalog" variant="custom" size="lg" className="px-5">
            Explorar Catálogo
            </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-white text-center mb-5" style={{fontFamily: 'Orbitron, sans-serif'}}>
        Carrito de Compras
      </h2>

      <Row className="g-4">
        {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
        <Col lg={8}>
          <Card className="bg-dark border-secondary mb-3 text-white shadow-sm">
            <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Productos en tu carrito ({itemCount})</h5>
              <Button variant="outline-danger" size="sm" onClick={clearCart}>
                <i className="bi bi-trash me-2"></i> Vaciar Carrito
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {items.map((item) => (
                <div key={item.id} className="p-3 border-bottom border-secondary d-flex align-items-center gap-3">
                  {/* Imagen */}
                  <div style={{width: '80px', height: '80px', flexShrink: 0}}>
                    <img 
                      src={item.imagen} 
                      alt={item.nombre} 
                      className="w-100 h-100 object-fit-cover rounded border border-secondary"
                    />
                  </div>
                  
                  {/* Info Producto */}
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-white">{item.nombre}</h6>
                    <small className="text-muted d-block">{item.tipo}</small>
                  </div>

                  {/* Controles Cantidad */}
                  <div className="d-flex align-items-center">
                    <div className="input-group input-group-sm" style={{width: '100px'}}>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      >-</Button>
                      <Form.Control 
                        className="text-center bg-dark text-white border-secondary p-0" 
                        value={item.cantidad} 
                        readOnly 
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      >+</Button>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="text-end" style={{minWidth: '90px'}}>
                    <div className="text-success fw-bold">${(item.precio * item.cantidad).toLocaleString()}</div>
                  </div>

                  {/* Eliminar */}
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: RESUMEN */}
        <Col lg={4}>
          <Card className="bg-dark border-secondary text-white shadow-sm sticky-top" style={{top: '100px'}}>
            <Card.Header className="bg-transparent border-secondary py-3">
              <h5 className="mb-0">Resumen de Compra</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Envío:</span>
                <span className="text-success">Gratis</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-4 fw-bold text-success">${total.toLocaleString()}</span>
              </div>

              <div className="d-grid gap-2">
                <Button variant="info" className="text-dark fw-bold py-2" style={{backgroundColor: '#00d4ff', border: 'none'}}>
                  <i className="bi bi-credit-card me-2"></i> PROCEDER AL PAGO
                </Button>
                <Button as={Link} to="/catalog" variant="outline-light" className="py-2">
                  <i className="bi bi-arrow-left me-2"></i> Continuar Comprando
                </Button>
              </div>

              {/* Información Extra */}
              <div className="mt-4 pt-3 border-top border-secondary">
                <h6 className="mb-3 text-white">Información de Envío</h6>
                <div className="d-flex gap-2 mb-2">
                    <i className="bi bi-truck text-success"></i>
                    <small className="text-muted">Envío gratis en compras sobre $100.000</small>
                </div>
                <div className="d-flex gap-2 mb-2">
                    <i className="bi bi-clock text-warning"></i>
                    <small className="text-muted">Despacho en 24-48 horas hábiles</small>
                </div>
                <div className="d-flex gap-2">
                    <i className="bi bi-shield-check text-info"></i>
                    <small className="text-muted">Garantía extendida incluida</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;