import { useEffect, useMemo, useState } from 'react';
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
  const [form, setForm] = useState({ 
    fecha: getTomorrowISO(), 
    direccion: '', 
    comentarios: '',
    email: '',
    tel: ''
  });
  const [alerta, setAlerta] = useState(null);

  // FECHA MÍNIMA PARA EL CALENDARIO
  const minDate = useMemo(() => getTomorrowISO(), []);

  // TÍTULO DINÁMICO DE LA PÁGINA
  useEffect(() => {
    document.title = 'Mi Pedido - Ecomarket';
  }, []);

  // SINCRONIZA LOS CAMPOS DEL FORMULARIO
  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // VALIDA LOS DATOS Y FINALIZA EL PEDIDO
  const handleSubmit = async (event) => { // <--- AHORA ES ASYNC
    event.preventDefault();
    if (cart.length === 0) {
      setAlerta({ variant: 'danger', message: 'Tu carrito está vacío. Agrega productos antes de confirmar.' });
      return;
    }
    if (!form.direccion.trim()) {
      setAlerta({ variant: 'danger', message: 'Por favor, ingresa una dirección de entrega.' });
      return;
    }

    // VALIDACIÓN PARA USUARIOS INVITADOS
    if (!user) {
      if (!form.email.trim() || !form.tel.trim()) {
        setAlerta({ variant: 'danger', message: 'Por favor, completa tus datos de contacto (email y teléfono).' });
        return;
      }
      // Validación de formato de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        setAlerta({ variant: 'danger', message: 'Por favor, ingresa un correo electrónico válido.' });
        return;
      }
      // Validación de teléfono
      if (!/^\+?\d+$/.test(form.tel.trim())) {
        setAlerta({ variant: 'danger', message: 'El número telefónico no es válido.' });
        return;
      }
    }

    // <--- CORRECCIÓN PRINCIPAL: ESPERAMOS LA RESPUESTA DEL BACKEND --->
    const result = await finalizeOrder();
    
    if (!result.ok) {
      setAlerta({ variant: 'danger', message: result.message ?? 'No pudimos confirmar tu pedido.' });
      return;
    }

    const emailDestino = user ? user.email : form.email;
    setAlerta({ variant: 'success', message: `¡Pedido confirmado! Te enviaremos los detalles a ${emailDestino}` });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* FORMULARIO DE CONFIRMACIÓN DE PEDIDO */}
          <section className="p-4 shadow-sm bg-white rounded-4">
            <h2 className="mb-4">Pedido</h2>
            <Form onSubmit={handleSubmit} className="row g-3">
              {!user && (
                <>
                  <Col md={6}>
                    <Form.Label htmlFor="email">Email de contacto</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      name="email"
                      placeholder="tu@correo.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="tel">Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      id="tel"
                      name="tel"
                      placeholder="+56912345678"
                      value={form.tel}
                      onChange={handleChange}
                      autoComplete="tel"
                      required
                    />
                  </Col>
                </>
              )}
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
                <Form.Text className="text-muted">Selecciona cualquier día a partir de mañana.</Form.Text>
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
                  autoComplete="street-address"
                  required
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
              {alerta && (
                <Col xs={12}>
                  <Alert variant={alerta.variant} className="mb-0">
                    {alerta.message}
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