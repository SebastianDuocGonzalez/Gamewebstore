import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-custom text-center text-white py-4 mt-5">
      <div className="container">
        <p>Síguenos en nuestras redes:</p>
        <div className="d-flex justify-content-center gap-3 mb-3">
          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm"
          >
            <i className="bi bi-discord"></i>
          </a>
        </div>
        <p>
          <a 
            href="https://wa.me/56912345678?text=Hola%20GameZone%20Pro,%20necesito%20soporte"
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <i className="bi bi-whatsapp"></i> Soporte Técnico
          </a>
        </p>
        <p className="mb-0">&copy; 2025 GameStore Pro. Todos los derechos reservados :p </p>
        <small>Desarrollado con Spring Boot & React</small>
      </div>
    </footer>
  );
};

export default Footer;
