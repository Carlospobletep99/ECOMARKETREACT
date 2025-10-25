import { useMemo } from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';

const customerLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/pedido', label: 'Pedido' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/login', label: 'Ingresar' },
  { to: '/registro', label: 'Registro' },
  { to: '/perfil', label: 'Perfil' }
];

const adminLinks = [{ to: '/perfil', label: 'Administrador' }];

export default function NavBar() {
  const { user } = useAuth();
  const { openCart } = useCarrito();
  const location = useLocation();
  const iconSrc = user ? '/images/perfil_on.png' : '/images/perfil_off.png';
  const isAdmin = user?.isAdmin;

  const visibleLinks = useMemo(() => {
    if (isAdmin) {
      return adminLinks;
    }

    return customerLinks.filter(link => {
      if (link.to === '/login' || link.to === '/registro') {
        return !user;
      }
      if (link.to === '/perfil') {
        return !!user;
      }
      return true;
    });
  }, [isAdmin, user]);

  return (
    <header className="bg-white shadow-sm sticky-top">
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand
            as={NavLink}
            to={isAdmin ? '/perfil' : '/'}
            className="fw-bold text-green text-uppercase"
          >
            ECOMARKET🌱
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="gap-lg-3 align-items-lg-center" activeKey={location.pathname}>
              {visibleLinks.map(({ to, label }) => {
                if (to === '/carrito') {
                  return (
                    <Nav.Link
                      key={to}
                      href="#carrito"
                      className="nav-link"
                      eventKey="carrito"
                      onClick={event => {
                        event.preventDefault();
                        openCart();
                      }}
                    >
                      {label}
                    </Nav.Link>
                  );
                }

                if (isAdmin) {
                  return (
                    <Nav.Link
                      key={to}
                      as={NavLink}
                      to={to}
                      end
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    >
                      {label}
                    </Nav.Link>
                  );
                }

                return (
                  <Nav.Link
                    key={to}
                    as={NavLink}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `nav-link${isActive || (to !== '/' && location.pathname.startsWith(to)) ? ' active' : ''}`
                    }
                  >
                    {label}
                  </Nav.Link>
                );
              })}
              <Image src={iconSrc} alt="Estado de sesión" width={30} height={30} roundedCircle />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
