import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import OrderService from '../../services/order.service'; // *** CAMBIO: Usar servicio real

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getAllOrders();
      // Ordenar por ID descendente (más recientes primero)
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setOrders(sorted);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las órdenes. Verifica conexión o permisos.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Gestión de Órdenes (Ventas)</h2>
      {error && <Alert variant="danger">{error}</Alert>}

    <div className="container">
        {/* Botón de Volver */}
        <button 
          className="btn-volver" 
          onClick={() => navigate(-1)} // -1 regresa a la página anterior
          style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
        >
          ⬅ Volver
        </button>

        <h2>Gestión de Productos</h2>
        {/* ... resto de tu tabla */}
      </div>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.fecha).toLocaleDateString()} {new Date(order.fecha).toLocaleTimeString()}</td>
                <td>{order.user ? order.user.email : 'Usuario Eliminado'}</td>
                <td className="text-success fw-bold">${order.total?.toLocaleString()}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleViewDetails(order)}>
                    <i className="bi bi-eye"></i> Ver Detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de Detalle */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Orden #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedOrder && (
            <>
                <p><strong>Cliente:</strong> {selectedOrder.user?.nombre}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <hr className="border-secondary"/>
                <h5>Productos:</h5>
                <Table variant="dark" size="sm">
                    <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                    <tbody>
                        {selectedOrder.detalles?.map((det, idx) => (
                            <tr key={idx}>
                                <td>{det.nombreProducto}</td>
                                <td>{det.cantidad}</td>
                                <td>${det.precioUnitario.toLocaleString()}</td>
                                <td>${det.subtotal.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <h3 className="text-end text-success mt-3">Total: ${selectedOrder.total.toLocaleString()}</h3>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminOrders;