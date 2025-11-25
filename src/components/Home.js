import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getAuthHeader } from '../services/auth.service';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Traemos todos los productos y mostramos los primeros 4 como "Destacados"
        const response = await api.get('/productos', {
            headers: getAuthHeader()
        });
        
        // Simular lógica de destacados y asignar imágenes
        const prods = response.data.slice(0, 4).map(p => ({
            ...p,
            imagen: p.imagen || 'https://via.placeholder.com/300x200/1a1a2e/00d4ff?text=Destacado'
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

  if (loading) return <div className="text-center py-5 text-white">Cargando...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white" style={{padding: '100px 0', background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'}}>
        <div className="container">
          <h1 className="display-3 fw-bold mb-4">Bienvenido a GameZone Pro</h1>
          <p className="lead mb-5">El mejor hardware y videojuegos en un solo lugar.</p>
          <Link to="/catalog" className="btn btn-custom btn-lg">Explorar Tienda</Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 text-white">Novedades</h2>
          <div className="row g-4">
            {featuredProducts.map(product => (
              <div key={product.id} className="col-md-3">
                <div className="card product-card h-100 text-white bg-dark border-secondary">
                  <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                  <div className="card-body">
                    <h5 className="card-title">{product.nombre}</h5>
                    <p className="card-text text-success">${product.precio.toLocaleString()}</p>
                    <button 
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => addToCart(product)}
                    >
                        Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sección estática de Noticias (Ya que no hay backend para esto aún) */}
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