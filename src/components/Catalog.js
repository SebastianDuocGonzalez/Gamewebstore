import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
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
        //Llamada vía servicio
        const response = await ProductService.getAllProducts();
        
        //lógica de imágenes
        const productsWithImages = response.data.map(p => ({
            ...p,
            imagen: getSmartImage(p)
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
  const getSmartImage = (product) => {
    // 1. Prioridad: URL del backend
    if (product.imagen && product.imagen.startsWith('http')) {
        return product.imagen;
    }
    // 2. Intentamos asignar imágenes locales específicas (tienes que tenerlas en public/assets)
    const name = product.nombre ? product.nombre.toLowerCase() : '';
    if (name.includes('playstation') || name.includes('ps5')) return '/assets/ps5.jpg';
    if (name.includes('xbox')) return '/assets/xbox.jpg';
    if (name.includes('nintendo') || name.includes('switch')) return '/assets/switch.jpg';
    if (name.includes('auricular') || name.includes('headset')) return '/assets/headset.jpg';
    if (name.includes('mouse')) return '/assets/mouse.jpg';
    if (name.includes('teclado')) return '/assets/keyboard.jpg';

    // 3. Si no coincide, usamos imagen genérica por categoría
    switch(product.tipo) {
      case 'Consolas': return 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80';
      case 'Videojuegos': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80';
      case 'Accesorios': return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80';
      case 'Equipos': return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80';
      default: return 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg';// Fallback final
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
                    onError={(e) => {e.target.src = 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg'}}
                />
              </div>
              <Card.Body className="d-flex flex-column bg-dark bg-opacity-50">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg="info" className="bg-opacity-75">{prod.tipo}</Badge>
                  <span className="text-success fw-bold">${prod.precio?.toLocaleString()}</span>
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