import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PanelAdmin from '../components/PanelAdmin.jsx';
import AlertaConfirmacion from '../components/AlertaConfirmacion.jsx';

export default function PerfilPage() {
  // Importamos 'login' para validar la contraseña al guardar
  const { user, login, updateProfile, eliminarCuenta } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', tel: '' });
  const [alerta, setAlerta] = useState(null);
  
  const [mostrarAlertaPassword, setMostrarAlertaPassword] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null); // 'guardar' o 'eliminar'
  const [passwordConfirmacion, setPasswordConfirmacion] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ 
        nombre: user.nombre ?? '', 
        email: user.email ?? '', 
        tel: user.tel ?? user.telefono ?? '' // Soporte para 'tel' o 'telefono'
      });
    }
  }, [user]);

  useEffect(() => {
    document.title = user?.isAdmin ? 'Panel de Administración - Ecomarket' : 'Mi Perfil - Ecomarket';
  }, [user]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = event => {
    event.preventDefault();
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setAlerta({ variant: 'danger', message: 'El correo electrónico no es válido.' });
      return;
    }
    if (form.tel.trim() && !/^\+?\d+$/.test(form.tel.trim())) {
      setAlerta({ variant: 'danger', message: 'El número telefónico no es válido.' });
      return;
    }
    setAccionPendiente('guardar');
    setMostrarAlertaPassword(true);
  };

  // AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL (ASYNC/AWAIT)
  const handleConfirmarPassword = async () => {
    if (!passwordConfirmacion) {
      setModalError('Debes ingresar tu contraseña.');
      return;
    }

    // 1. Verificamos la contraseña haciendo un login silencioso
    const validacion = await login({ email: user.email, pass: passwordConfirmacion });

    if (!validacion.ok) {
      setModalError('La contraseña es incorrecta.');
      return;
    }

    // 2. Si la contraseña es correcta, procedemos (esperando la respuesta con AWAIT)
    if (accionPendiente === 'guardar') {
      const result = await updateProfile({ nombre: form.nombre, email: form.email, tel: form.tel });
      
      // Ahora 'result' tiene los datos reales, no es una promesa
      setAlerta({ variant: result.ok ? 'success' : 'danger', message: result.message });
      cerrarModalPassword();

    } else if (accionPendiente === 'eliminar') {
      const result = await eliminarCuenta();
      
      if (result.ok) {
        cerrarModalPassword();
        navigate('/');
      } else {
        setModalError(result.message);
      }
    }
  };

  const cerrarModalPassword = () => {
    setMostrarAlertaPassword(false);
    setPasswordConfirmacion('');
    setModalError('');
    setAccionPendiente(null);
  };

  if (user?.isAdmin) {
    return <PanelAdmin />;
  }

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
                  autoComplete="name"
                />
              </Col>
              <Col md={12}>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </Col>
              <Col md={12}>
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
              <Col xs={12} className="mt-3">
                <Button type="submit" variant="success" className="w-100">
                  Guardar
                </Button>
              </Col>
              
              <Col xs={12} className="mt-2">
                <Button
                  type="button"
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    setAccionPendiente('eliminar');
                    setMostrarAlertaPassword(true);
                  }}
                >
                  Eliminar cuenta
                </Button>
              </Col>

              {alerta && (
                <Col xs={12}>
                  <Alert variant={alerta.variant} className="mb-0 mt-3">
                    {alerta.message}
                  </Alert>
                </Col>
              )}
            </Form>
          </section>
        </Col>
      </Row>

      <AlertaConfirmacion
        mostrar={mostrarAlertaPassword}
        alCerrar={cerrarModalPassword}
        alConfirmar={handleConfirmarPassword}
        titulo={accionPendiente === 'eliminar' ? 'Eliminar cuenta' : 'Confirmar cambios'}
        mensaje={
          accionPendiente === 'eliminar'
            ? 'Para confirmar la eliminación de tu cuenta, por favor ingresa tu contraseña. Esta acción cerrará tu sesión.'
            : 'Por seguridad, confirma tu contraseña para guardar los cambios en tu perfil.'
        }
        textoConfirmar={accionPendiente === 'eliminar' ? 'Eliminar cuenta' : 'Confirmar'}
        textoCancelar="Cancelar"
        variante={accionPendiente === 'eliminar' ? 'danger' : 'success'}
      >
        <Form.Group className="mt-3">
          <Form.Control 
            type="password" 
            placeholder="Contraseña actual" 
            value={passwordConfirmacion}
            onChange={e => {
              setPasswordConfirmacion(e.target.value);
              setModalError('');
            }}
          />
          {modalError && (
            <div className="text-danger small mt-1">
              {modalError}
            </div>
          )}
        </Form.Group>
      </AlertaConfirmacion>
    </Container>
  );
}