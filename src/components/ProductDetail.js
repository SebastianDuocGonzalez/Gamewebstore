import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../services/product.service'; // <--- Importamos el servicio
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
        // Mantenemos tu lógica de imágenes local (está perfecta aquí o en un utils)
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

  // --- Tu lógica de imágenes se mantiene igual ---
  const getProductImage = (product) => {
    const name = product.nombre ? product.nombre.toLowerCase() : '';
    
    if (name.includes('playstation') || name.includes('ps5')) return '/assets/ps5.jpg';
    if (name.includes('xbox')) return '/assets/xbox.jpg';
    if (name.includes('nintendo') || name.includes('switch')) return '/assets/switch.jpg';
    if (name.includes('auricular') || name.includes('headset')) return '/assets/headset.jpg';
    if (name.includes('mouse')) return '/assets/mouse.jpg';
    if (name.includes('teclado')) return '/assets/keyboard.jpg';

    switch(product.tipo) {
      case 'CONSOLA': return 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80';
      case 'VIDEOJUEGO': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80';
      case 'ACCESORIO': return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80';
      default: return '/assets/default-product.jpg'; // Corregido path relativo si usas CRA/Vite
    }
  };

  if (loading) return <div className="text-center py-5 text-white">Cargando detalle...</div>;
  if (error || !product) return <div className="text-center py-5 text-danger">{error || 'Producto no encontrado'}</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
           {/* Agregamos un onError por si la imagen falla */}
          <img 
            src={product.imagen} 
            alt={product.nombre} 
            className="img-fluid rounded shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = '/assets/default-product.jpg'; }} 
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