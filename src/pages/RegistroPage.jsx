import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function RegistroPage() {
  const { register } = useEcomarket();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', tel: '', pass: '', pass2: '' });
  const [status, setStatus] = useState(null);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const result = register(form);
    setStatus({ variant: result.ok ? 'success' : 'danger', message: result.message });
    if (result.ok) {
      setTimeout(() => navigate('/perfil'), 800);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <section className="p-4 shadow-sm bg-white rounded-4">
            <h2 className="mb-4">Crear cuenta</h2>
            <Form onSubmit={handleSubmit} className="row g-3">
              <Col md={6}>
                <Form.Label htmlFor="nombre">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                />
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="pass">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="pass"
                  name="pass"
                  placeholder="Contraseña"
                  value={form.pass}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="pass2">Repite contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="pass2"
                  name="pass2"
                  placeholder="Repite contraseña"
                  value={form.pass2}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Col>
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100">
                  Registrarme
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