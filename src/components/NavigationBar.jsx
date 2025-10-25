import { useMemo } from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useEcomarket } from '../context/EcomarketContext.jsx';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/pedido', label: 'Pedido' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/login', label: 'Ingresar' },
  { to: '/registro', label: 'Registro' },
  { to: '/perfil', label: 'Perfil' }
];

export default function NavigationBar() {
  const { user, openCart } = useEcomarket();
  const location = useLocation();
  const iconSrc = user ? '/images/perfil_on.png' : '/images/perfil_off.png';

  const visibleLinks = useMemo(() => {
    return links.filter(link => {
      if (link.to === '/login' || link.to === '/registro') {
        return !user;
      }
      if (link.to === '/perfil') {
        return !!user;
      }
      return true;
    });
  }, [user]);

  return (
    <header className="bg-white shadow-sm sticky-top">
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-green text-uppercase">
            ECOMARKET🌱
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="gap-lg-3 align-items-lg-center">
              {visibleLinks.map(({ to, label }) => {
                if (to === '/carrito') {
                  const isCartRoute = location.pathname.startsWith('/carrito');
                  return (
                    <Nav.Link
                      key={to}
                      href="#carrito"
                      active={isCartRoute}
                      onClick={event => {
                        event.preventDefault();
                        openCart();
                      }}
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