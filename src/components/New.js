import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import api from '../services/api';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Cargar noticias del backend
    api.get('/noticias')
       .then(res => setNews(res.data))
       .catch(err => console.error("Error cargando noticias", err));
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4"><i className="bi bi-newspaper me-2"></i>Noticias y Novedades</h2>
      <Row>
        {news.map(item => (
          <Col md={6} lg={4} key={item.id} className="mb-4">
            <Card className="h-100 bg-dark text-white border-secondary shadow-sm hover-scale">
              {item.imagenUrl && (
                <Card.Img variant="top" src={item.imagenUrl} style={{height: '200px', objectFit: 'cover'}} />
              )}
              <Card.Body>
                <Card.Title className="text-primary-custom">{item.titulo}</Card.Title>
                <Card.Text className="text-muted small">
                  {new Date(item.fechaPublicacion).toLocaleDateString()}
                </Card.Text>
                <Card.Text>{item.contenido.substring(0, 150)}...</Card.Text>
                <a href={item.fuenteUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light btn-sm">
                  Leer fuente completa
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {news.length === 0 && <p className="text-white">No hay noticias recientes.</p>}
      </Row>
    </Container>
  );
};

export default News;