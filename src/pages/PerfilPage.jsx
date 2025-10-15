import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function PerfilPage() {
  const { user, updateProfile, logout } = useEcomarket();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', tel: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre ?? '', email: user.email ?? '', tel: user.tel ?? '' });
    }
  }, [user]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = event => {
    event.preventDefault();
    const result = updateProfile({ nombre: form.nombre, tel: form.tel });
    setStatus({ variant: result.ok ? 'success' : 'danger', message: result.message });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <section className="p-4 shadow-sm bg-white rounded-4">
            <h2 className="mb-4">Mi perfil</h2>
            <Form className="row g-3" onSubmit={handleSave}>
              <Col md={12}>
                <Form.Label htmlFor="nombre">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12}>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control type="email" id="email" name="email" value={form.email} disabled />
              </Col>
              <Col md={12}>
                <Form.Label htmlFor="tel">Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  id="tel"
                  name="tel"
                  value={form.tel}
                  onChange={handleChange}
                />
              </Col>
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100">
                  Guardar
                </Button>
              </Col>
              <Col xs={12}>
                <Button type="button" variant="danger" className="w-100" onClick={handleLogout}>
                  Cerrar sesión
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