import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../src/components/NavBar.jsx';

// MOCKS PARA LOS HOOKS DE CONTEXTO:
vi.mock('../src/context/AuthContext.jsx', () => ({
  useAuth: vi.fn()
}));

vi.mock('../src/context/CarritoContext.jsx', () => ({
  useCarrito: vi.fn()
}));

import { useAuth } from '../src/context/AuthContext.jsx';
import { useCarrito } from '../src/context/CarritoContext.jsx';

// RENDERIZA NAVBAR DENTRO DE UN ROUTER FALSO PARA PROBARLO:
const renderNavBar = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavBar />
    </MemoryRouter>
  );
};

describe('NavBar', () => {
  // RESETEA LOS MOCKS ANTES DE CADA CASO:
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // VALIDA LA VISTA PARA INVITADOS:
  it('Muestra los enlaces publicos cuando NO hay sesión iniciada, oculta "Perfil"', () => {
    useAuth.mockReturnValue({ user: null });
    useCarrito.mockReturnValue({ openCart: vi.fn() });

    renderNavBar();

    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pedido' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nosotros' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Registro' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument();
  });

  // COMPRUEBA EL FLUJO DE CLIENTE CON CARRITO DISPONIBLE:
  it('Oculta login/registro y abre el carrito cuando hay sesion iniciada', async () => {
    const openCart = vi.fn();
    useAuth.mockReturnValue({ user: { nombre: 'Ana', isAdmin: false } });
    useCarrito.mockReturnValue({ openCart });

    renderNavBar('/catalogo');

    expect(screen.queryByRole('link', { name: 'Ingresar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Registro' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: 'Carrito' }));
    expect(openCart).toHaveBeenCalledTimes(1);
  });

  // ASEGURA LA VISTA EXCLUSIVA PARA ADMINISTRADORES:
  it('Muestra solo el enlace de administrador (panel de gestion) cuando el usuario es admin', () => {
    useAuth.mockReturnValue({ user: { nombre: 'Admin', isAdmin: true } });
    useCarrito.mockReturnValue({ openCart: vi.fn() });

    renderNavBar('/perfil');

    expect(screen.getByRole('link', { name: 'Administrador' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Carrito' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Catálogo' })).not.toBeInTheDocument();

    const brandLink = screen.getByRole('link', { name: /ecomarket/i });
    expect(brandLink).toHaveAttribute('href', '/perfil');
  });
});
