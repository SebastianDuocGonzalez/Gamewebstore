import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/product.service';
import { useCart } from '../contexts/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // *** CAMBIO: Usamos el servicio. Ya no necesitamos enviar headers manuales.
        const response = await ProductService.getAllProducts();
        
        // Tomamos los primeros 4 y aplicamos la lógica de imagen inteligente
        const prods = response.data.slice(0, 4).map(p => ({
            ...p,
            imagen: getSmartImage(p)
        }));
        
        setFeaturedProducts(prods);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getSmartImage = (product) => {
    // 1. Si el backend trae una URL válida, úsala.
    if (product.imagen && product.imagen.startsWith('http')) {
        return product.imagen;
    }
    // 2. Si no, inferir por nombre (Assets locales)
    const name = product.nombre ? product.nombre.toLowerCase() : '';
    if (name.includes('playstation') || name.includes('ps5')) return '/assets/ps5.jpg';
    if (name.includes('xbox')) return '/assets/xbox.jpg';
    if (name.includes('nintendo') || name.includes('switch')) return '/assets/switch.jpg';
    if (name.includes('auricular') || name.includes('headset')) return '/assets/headset.jpg';
    if (name.includes('mouse')) return '/assets/mouse.jpg';
    if (name.includes('teclado')) return '/assets/keyboard.jpg';

    // 3. Fallback por categoría (Unsplash)
    switch(product.tipo) {
      case 'Consolas': return 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80';
      case 'Videojuegos': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80';
      case 'Accesorios': return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80';
      case 'Equipos': return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80';
      default: return 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg';
    }
  };

  if (loading) return <div className="text-center py-5 text-white">Cargando...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white" style={{padding: '100px 0', background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'}}>
        <div className="container hero-content">
          <h1 className="display-3 fw-bold mb-4">Bienvenido a GameZone Pro</h1>
          <p className="lead mb-5">El mejor hardware y videojuegos en un solo lugar.</p>
          <Link to="/catalog" className="btn btn-primary btn-lg">Explorar Tienda</Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-5">
        <div className="container hero-content">
          <h2 className="text-center mb-5 text-white">Novedades</h2>
          <div className="row g-4">
            {featuredProducts.map(product => (
              <div key={product.id} className="col-md-3">
                <div className="card product-card h-100 text-white bg-dark border-secondary">
                  <div style={{height: '200px', overflow: 'hidden'}}>
                    <img 
                        src={product.imagen} 
                        className="card-img-top h-100 object-fit-cover" 
                        alt={product.nombre}
                        onError={(e) => {e.target.src = 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg'}} 
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.nombre}</h5>
                    <p className="card-text text-success fw-bold">${product.precio?.toLocaleString()}</p>
                    <button 
                        className="btn btn-primary btn-sm w-100 mt-auto"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? 'Agregar' : 'Agotado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-5 bg-dark">
         <div className="container text-center text-white">
            <h2>Próximos Eventos</h2>
            <p className="text-muted">Mantente atento a nuestros torneos de E-Sports.</p>
            <div className="alert alert-info">¡Torneo de Valorant - Próximamente!</div>
         </div>
      </section>
    </div>
  );
};

export default Home;