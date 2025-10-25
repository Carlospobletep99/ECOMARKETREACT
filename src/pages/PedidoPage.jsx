import { useMemo, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// FECHA MÍNIMA PERMITIDA PARA EL PEDIDO
function getTomorrowISO() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export default function PedidoPage() {
  // CONTEXTO DEL CARRITO Y DEL USUARIO
  const { cart, cartTotal, finalizeOrder } = useCarrito();
  const { user } = useAuth();
  const [form, setForm] = useState({ fecha: getTomorrowISO(), direccion: '', comentarios: '' });
  const [status, setStatus] = useState(null);

  // FECHA MÍNIMA PARA EL CALENDARIO
  const minDate = useMemo(() => getTomorrowISO(), []);

  // SINCRONIZA LOS CAMPOS DEL FORMULARIO
  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // VALIDA LOS DATOS Y FINALIZA EL PEDIDO
  const handleSubmit = event => {
    event.preventDefault();
    if (cart.length === 0) {
      setStatus({ variant: 'danger', message: 'Tu carrito está vacío. Agrega productos antes de confirmar.' });
      return;
    }
    if (!form.direccion.trim()) {
      setStatus({ variant: 'danger', message: 'Por favor, ingresa una dirección de entrega.' });
      return;
    }

    const result = finalizeOrder();
    if (!result.ok) {
      setStatus({ variant: 'danger', message: result.message ?? 'No pudimos confirmar tu pedido.' });
      return;
    }

    setStatus({ variant: 'success', message: '¡Pedido confirmado! Te enviaremos los detalles al correo registrado.' });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* FORMULARIO DE CONFIRMACIÓN DE PEDIDO */}
          <section className="p-4 shadow-sm bg-white rounded-4">
            <h2 className="mb-4">Pedido</h2>
            <Form onSubmit={handleSubmit} className="row g-3">
              <Col md={6}>
                <Form.Label htmlFor="fecha">Fecha preferida de entrega</Form.Label>
                <Form.Control
                  type="date"
                  id="fecha"
                  name="fecha"
                  min={minDate}
                  value={form.fecha}
                  onChange={handleChange}
                />
                <Form.Text className="form-helper">Selecciona cualquier día a partir de mañana.</Form.Text>
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="direccion">Dirección</Form.Label>
                <Form.Control
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Calle, número, comuna"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </Col>
              <Col xs={12}>
                <Form.Label htmlFor="comentarios">Comentarios</Form.Label>
                <Form.Control
                  type="text"
                  id="comentarios"
                  name="comentarios"
                  placeholder="Instrucciones para el repartidor"
                  value={form.comentarios}
                  onChange={handleChange}
                />
              </Col>
              {user && (
                <Col xs={12}>
                  <Alert variant="info" className="mb-0">
                    Confirmaremos con: <strong>{user.nombre}</strong> ({user.email})
                  </Alert>
                </Col>
              )}
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100" disabled={cartTotal === 0}>
                  Confirmar pedido
                </Button>
              </Col>
              {status && (
                <Col xs={12}>
                  <Alert variant={status.variant} className="mb-0">
                    {status.message}
                  </Alert>
                </Col>
              )}
            </Form>
          </section>
        </Col>
      </Row>
    </Container>
  );
}