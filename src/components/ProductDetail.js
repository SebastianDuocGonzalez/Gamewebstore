import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getAuthHeader } from '../services/auth.service';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Petición al backend: /api/v1/productos/{id}
        const response = await api.get(`/productos/${id}`, {
            headers: getAuthHeader()
        });
        
        // Asignar imagen placeholder
        const productData = response.data;
        productData.imagen = getProductImage(productData);
        
        setProduct(productData);
      } catch (err) {
        setError('No se pudo cargar el producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (loading) return <div className="text-center py-5 text-white">Cargando detalle...</div>;
  if (error || !product) return <div className="text-center py-5 text-danger">{error || 'Producto no encontrado'}</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.imagen} alt={product.nombre} className="img-fluid rounded shadow-lg" />
        </div>
        <div className="col-md-6 text-white">
          <h1 className="mb-3">{product.nombre}</h1>
          <span className="badge bg-info mb-3">{product.tipo}</span>
          <p className="lead">{product.descripcion}</p>
          <h2 className="text-success mb-4">${product.precio.toLocaleString()} CLP</h2>
          
          <div className="d-grid gap-3">
             <button 
                className="btn btn-custom btn-lg" 
                onClick={() => { addToCart(product); alert('Agregado!'); }}
                disabled={product.stock <= 0}
             >
                {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
             </button>
             <Link to="/catalog" className="btn btn-outline-light">
                Volver al Catálogo
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;