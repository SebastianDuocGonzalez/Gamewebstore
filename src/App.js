import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useUser } from './contexts/UserContext';

// Componentes Públicos
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';       
import Register from './components/Register';

// Nota: Si no tienes News/Events/Profile creados aún, coméntalos o crea archivos vacíos
// import Profile from './components/Profile'; 
// import News from './components/News';
// import Events from './components/Events';

// Componentes de Admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminUsers from './components/admin/AdminUsers';
import AdminOrders from './components/admin/AdminOrders';

// Contextos
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si es trabajador intentando entrar a zona admin pura, lo mandamos a su dashboard o al home
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            
            {/* main-content asegura que el footer se vaya al fondo */}
            <main className="main-content flex-grow-1">
              <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> 
                {/* Rutas Pendientes (Descomentar cuando crees los archivos) */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                {/* <Route path="/news" element={<News />} /> */}
                {/* <Route path="/events" element={<Events />} /> */}
                
                {/* Rutas Protegidas para ADMINISTRADORES */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="orders" element={<AdminOrders />} />
                  </Routes>
                </ProtectedRoute>
              } />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;