import React, { useState, useEffect } from 'react';
import ProductService from '../../services/product.service';
import { Table, Button, Container, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para el Modal (Crear/Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    tipo: 'VIDEOJUEGO', 
    imagen: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // REFACTORIZADO: Usamos el servicio para obtener lista
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos. Verifica que el servidor esté activo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal (Modo Crear o Editar)
  const handleShow = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        tipo: product.tipo,
        imagen: product.imagen || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        tipo: 'VIDEOJUEGO',
        imagen: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // Guardar (Crear o Actualizar)
  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    
    const categoryMap = {
        'VIDEOJUEGO': { id: 1 },
        'CONSOLA': { id: 2 },
        'ACCESORIO': { id: 3 },
        'EQUIPO': { id: 4 }
    };

    // Preparar datos (Convertir tipos para Java)
    const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        // Aquí está la magia: Enviamos el objeto categoría completo
        categoria: categoryMap[formData.tipo] 
    };
    try {
      if (editingProduct) {
        // REFACTORIZADO: Actualizar vía servicio (inyecta token)
        await ProductService.updateProduct(editingProduct.id, productData);
        alert('Producto actualizado correctamente');
      } else {
        // REFACTORIZADO: Crear vía servicio (inyecta token) <--- AQUÍ ESTÁ LO QUE BUSCABAS
        await ProductService.createProduct(productData);
        alert('Producto creado correctamente');
      }
      handleClose();
      fetchProducts(); // Recargar lista
    } catch (err) {
      console.error(err);
      // Mostrar mensaje de error más específico si el backend lo envía
      const msg = err.response?.data?.message || 'Error al guardar el producto (Verifica permisos)';
      alert(msg);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        // REFACTORIZADO: Eliminar vía servicio
        await ProductService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('Error al eliminar el producto. Verifica que seas administrador.');
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Gestión de Productos</h2>
        <Button variant="success" onClick={() => handleShow()}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Producto
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td><Badge bg="info">{prod.tipo}</Badge></td>
                <td>${prod.precio?.toLocaleString()}</td>
                <td>
                  <Badge bg={prod.stock > 0 ? 'success' : 'danger'}>
                    {prod.stock}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShow(prod)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(prod.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de Creación/Edición */}
      <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} centered className="text-dark">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="bg-secondary text-white border-0" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleInputChange} className="bg-secondary text-white border-0" />
            </Form.Group>
            <div className="row">
                <div className="col-6">
                    <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number" name="precio" value={formData.precio} onChange={handleInputChange} required className="bg-secondary text-white border-0" />
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="bg-secondary text-white border-0" />
                    </Form.Group>
                </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select name="tipo" value={formData.tipo} onChange={handleInputChange} className="bg-secondary text-white border-0">
                <option value="VIDEOJUEGO">Videojuego</option>
                <option value="CONSOLA">Consola</option>
                <option value="ACCESORIO">Accesorio</option>
                <option value="EQUIPO">Equipo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen (Opcional)</Form.Label>
              <Form.Control type="text" name="imagen" value={formData.imagen} onChange={handleInputChange} placeholder="https://..." className="bg-secondary text-white border-0" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" type="submit">{editingProduct ? 'Actualizar' : 'Crear'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProducts;