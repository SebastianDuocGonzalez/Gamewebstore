import React, { useState, useEffect } from 'react';
import api from '../services/api'
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Container, Row, Col, Card, Button, Spinner, Badge, Form } from 'react-bootstrap';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/productos');
        
        // Lógica mejorada de imágenes
        const productsWithImages = response.data.map(p => ({
            ...p,
            // Si el backend no trae imagen, usamos la función auxiliar
            imagen: p.imagen && p.imagen.startsWith('http') ? p.imagen : getProductImage(p)
        }));

        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
        
        const uniqueCategories = [...new Set(productsWithImages.map(p => p.tipo))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  // FUNCIÓN INTELIGENTE DE IMÁGENES
  const getProductImage = (product) => {
    // Normalizamos el nombre para buscar coincidencias
    const name = product.nombre.toLowerCase();
    
    // 1. Intentamos asignar imágenes locales específicas (tienes que tenerlas en public/assets)
    if (name.includes('playstation') || name.includes('ps5')) return '/assets/ps5.jpg';
    if (name.includes('xbox')) return '/assets/xbox.jpg';
    if (name.includes('nintendo') || name.includes('switch')) return '/assets/switch.jpg';
    if (name.includes('auricular') || name.includes('headset')) return '/assets/headset.jpg';
    if (name.includes('mouse')) return '/assets/mouse.jpg';
    if (name.includes('teclado')) return '/assets/keyboard.jpg';

    // 2. Si no coincide, usamos imagen genérica por categoría
    switch(product.tipo) {
      case 'CONSOLA': return 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80'; // Imagen real de Unsplash
      case 'VIDEOJUEGO': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80';
      case 'ACCESORIO': return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80';
      default: return '/public/assets/default-product.jpg';
    }
  };

   // Efecto de filtrado
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(p => p.tipo === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="info" /></div>;
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 text-white" style={{fontFamily: 'Orbitron, sans-serif'}}>
        Catálogo <span className="text-primary-custom">GameZone</span>
      </h2>
      
      {/* Filtros */}
      <Row className="g-3 mb-4 justify-content-center">
        <Col md={5}>
          <Form.Control 
            type="text" 
            placeholder="Buscar producto..." 
            className="form-control-custom"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select 
            className="form-control-custom"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Grid */}
      <Row>
        {filteredProducts.map((prod) => (
          <Col key={prod.id} md={4} lg={3} className="mb-4">
            <Card className="card-custom h-100 text-white border-0 shadow-sm">
              <div style={{height: '200px', overflow: 'hidden'}}>
                <Card.Img 
                    variant="top" 
                    src={prod.imagen} 
                    style={{ height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                    className="product-image"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'}} // Fallback por si falla la URL
                />
              </div>
              <Card.Body className="d-flex flex-column bg-dark bg-opacity-50">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg="info" className="bg-opacity-75">{prod.tipo}</Badge>
                  <span className="text-success fw-bold">${prod.precio.toLocaleString()}</span>
                </div>
                <Card.Title className="fs-6 mb-2 text-truncate">{prod.nombre}</Card.Title>
                
                <div className="mt-auto d-grid gap-2">
                  <Link to={`/product/${prod.id}`} className="btn btn-outline-light btn-sm">
                    Ver Detalle
                  </Link>
                  <Button 
                    variant="primary" 
                    className="btn-custom btn-sm border-0"
                    onClick={() => addToCart(prod)}
                    disabled={prod.stock <= 0}
                  >
                    {prod.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Catalog;