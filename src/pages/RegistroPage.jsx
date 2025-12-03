import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegistroPage() {
  // CONTEXTO Y ESTADOS DEL REGISTRO
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', tel: '', pass: '', pass2: '' });
  const [alerta, setAlerta] = useState(null);

  // TÍTULO DINÁMICO DE LA PÁGINA
  useEffect(() => {
    document.title = 'Crear Cuenta - Ecomarket';
  }, []);

  // SINCRONIZA INPUTS CON EL ESTADO
  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // REALIZA EL REGISTRO Y REDIRIGE AL PERFIL
  const handleSubmit = async (event) => { // <--- AGREGADO ASYNC
    event.preventDefault();
    
    // AGREGADO AWAIT: Esperamos a que el backend cree el usuario
    const result = await register(form);
    
    setAlerta({ variant: result.ok ? 'success' : 'danger', message: result.message });
    
    if (result.ok) {
      setTimeout(() => navigate('/perfil'), 800);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {/* FORMULARIO DE CREACIÓN DE CUENTA */}
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
                  required
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
                  required
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
                  required
                />
              </Col>
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100">
                  Registrarme
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