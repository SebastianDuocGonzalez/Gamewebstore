import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../services/product.service';
import { useCart } from '../contexts/CartContext';

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
        // REFACTORIZADO: Usamos el servicio en lugar de llamar a api directamente
        const response = await ProductService.getProductById(id);
        const productData = response.data;

        //lógica de imágenes local (está perfecta aquí o en un utils)
        productData.imagen = getSmartImage(productData);
        
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

  // --- Tu lógica de imágenes
const getSmartImage = (product) => {
    // 1. Backend URL
    if (product.imagen && product.imagen.startsWith('http')) {
        return product.imagen;
    }
    
    // 2. Local Assets
    const name = product.nombre ? product.nombre.toLowerCase() : '';
    if (name.includes('playstation') || name.includes('ps5')) return '/assets/ps5.jpg';
    if (name.includes('xbox')) return '/assets/xbox.jpg';
    if (name.includes('nintendo') || name.includes('switch')) return '/assets/switch.jpg';
    if (name.includes('auricular') || name.includes('headset')) return '/assets/headset.jpg';
    if (name.includes('mouse')) return '/assets/mouse.jpg';
    if (name.includes('teclado')) return '/assets/keyboard.jpg';

    // 3. Generic
    switch(product.tipo) {
      case 'Consolas': return 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80';
      case 'Videojuegos': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80';
      case 'Accesorios': return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80';
      case 'Equipos': return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80';
      default: return 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg';
    }
  };

  if (loading) return <div className="text-center py-5 text-white">Cargando detalle...</div>;
  if (error || !product) return <div className="text-center py-5 text-danger">{error || 'Producto no encontrado'}</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.imagen} 
            alt={product.nombre} 
            className="img-fluid rounded shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://thumbs.dreamstime.com/z/error-109026446.jpg?ct=jpeg'; }} 
          />
        </div>
        <div className="col-md-6 text-white">
          <h1 className="mb-3">{product.nombre}</h1>
          <span className="badge bg-info mb-3">{product.tipo}</span>
          <p className="lead">{product.descripcion}</p>
          <h2 className="text-success mb-4 text-nowrap">${product.precio?.toLocaleString()} CLP</h2>
          
          <div className="d-grid gap-3">
             <button 
                className="btn btn-primary btn-lg" 
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