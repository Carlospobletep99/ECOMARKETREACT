import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function LoginPage() {
  const { login } = useEcomarket();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', pass: '' });
  const [status, setStatus] = useState(null);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const result = login(form);
    setStatus({ variant: result.ok ? 'success' : 'danger', message: result.message });
    if (result.ok) {
      setTimeout(() => navigate('/perfil'), 800);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <section className="p-4 shadow-sm bg-white rounded-4">
            <h2 className="mb-4">Ingresar</h2>
            <Form onSubmit={handleSubmit} className="row g-3">
              <Col xs={12}>
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
              <Col xs={12}>
                <Form.Label htmlFor="pass">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="pass"
                  name="pass"
                  placeholder="Contraseña"
                  value={form.pass}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </Col>
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100">
                  Ingresar
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