import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../src/components/Carrito.jsx';

// MOCKS DE LOS HOOKS DEL CONTEXTO:
vi.mock('../src/context/CarritoContext.jsx', () => ({
  useCarrito: vi.fn()
}));

vi.mock('../src/context/InventarioContext.jsx', () => ({
  useInventario: vi.fn()
}));

import { useCarrito } from '../src/context/CarritoContext.jsx';
import { useInventario } from '../src/context/InventarioContext.jsx';

// MATCHMEDIA FALSO PARA QUE ABRA EL CARRITO (OFFCANVAS):
if (!globalThis.matchMedia) {
  globalThis.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

// RENDERIZA EL COMPONENTE CON LOS VALORES MOCKEADOS:
const renderCarrito = () =>
  render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );

describe('Carrito', () => {
  // RESETEA LOS MOCKS ENTRE PRUEBAS:
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // VERIFICA EL ESTADO VACÍO DEL CARRITO:
  it('muestra mensaje vacío cuando no hay productos', () => {
    useCarrito.mockReturnValue({
      cart: [],
      cartTotal: 0,
      cartItemCount: 0,
      isCartOpen: true,
      closeCart: vi.fn()
    });
    useInventario.mockReturnValue({ products: [] });

    renderCarrito();

    expect(
      screen.getByText('Tu carrito está vacío. Agrega productos desde el catálogo.')
    ).toBeInTheDocument();
  });

  // VALIDA LAS ACCIONES CUANDO HAY PRODUCTOS EN EL CARRITO:
  it('renderiza productos y permite ajustar cantidades', async () => {
    const incrementQuantity = vi.fn();
    const decrementQuantity = vi.fn();
    const removeFromCart = vi.fn();
    const closeCart = vi.fn();

    useCarrito.mockReturnValue({
      cart: [
        {
          codigo: 'P01',
          nombre: 'Quinoa',
          precio: 2500,
          cantidad: 1,
          imagen: '/images/quinoa.png',
          unidadMedida: 'Bolsa'
        }
      ],
      cartTotal: 2500,
      cartItemCount: 1,
      isCartOpen: true,
      closeCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart
    });

    useInventario.mockReturnValue({
      products: [{ codigo: 'P01', cantidad: 3 }]
    });

    renderCarrito();

  expect(screen.getByText('Quinoa')).toBeInTheDocument();
  expect(screen.getByText(/\$2\.500 c\/u/)).toBeInTheDocument();
  expect(screen.getAllByText('$2.500')).toHaveLength(2);

    const user = userEvent.setup();

  // SUBE LA CANTIDAD CUANDO TODAVIA QUEDA STOCK:
    await user.click(screen.getByRole('button', { name: /sumar uno/i }));
    expect(incrementQuantity).toHaveBeenCalledWith('P01');

  // ELIMINA EL PRODUCTO DEL CARRITO CON UN CLICK:
    await user.click(screen.getByRole('button', { name: /eliminar quinoa/i }));
    expect(removeFromCart).toHaveBeenCalledWith('P01');

  // BOTON DE CONFIRMAR TAMBIEN CIERRA EL CARRITO:
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));
    expect(closeCart).toHaveBeenCalled();
  });
});
