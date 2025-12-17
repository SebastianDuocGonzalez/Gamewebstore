import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Card } from 'react-bootstrap';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/eventos')
       .then(res => setEvents(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4"><i className="bi bi-calendar-event me-2"></i>Torneos y Eventos</h2>
      <Card className="bg-dark border-secondary">
        <div className="table-responsive">
            <Table variant="dark" hover className="mb-0">
            <thead>
                <tr>
                <th>Fecha</th>
                <th>Evento</th>
                <th>Juego</th>
                <th>Lugar</th>
                <th>Premio</th>
                </tr>
            </thead>
            <tbody>
                {events.map(ev => (
                <tr key={ev.id}>
                    <td><Badge bg="info">{new Date(ev.fechaEvento).toLocaleDateString()}</Badge></td>
                    <td className="fw-bold">{ev.titulo}</td>
                    <td>{ev.juegoRelacionado}</td>
                    <td>{ev.lugar}</td>
                    <td className="text-warning">{ev.premio}</td>
                </tr>
                ))}
            </tbody>
            </Table>
        </div>
      </Card>
    </Container>
  );
};

export default Events;