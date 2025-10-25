import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useInventario } from './InventarioContext.jsx';

// CLAVE PARA PERSISTIR EL CONTENIDO DEL CARRITO:
const CART_KEY = 'carrito';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_KEY, []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products, setProducts } = useInventario();

  // OPERACIONES SOBRE EL CARRITO:
  // Agrega una unidad y abre el carrito cuando la acción es válida.
  const addToCart = useCallback(
    product => {
      const catalogProduct = products.find(item => item.codigo === product.codigo);
      const availableStock = catalogProduct?.cantidad ?? 0;
      let result = { ok: false, message: 'No hay stock disponible para este producto.' };

      setCart(prev => {
        const existing = prev.find(item => item.codigo === product.codigo);
        const nextQuantity = existing ? existing.cantidad + 1 : 1;

        if (nextQuantity > availableStock) {
          result = {
            ok: false,
            message: 'No hay stock suficiente para agregar más unidades.'
          };
          return prev;
        }

        result = { ok: true, message: 'Producto agregado al carrito.' };

        if (existing) {
          return prev.map(item =>
            item.codigo === product.codigo
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }

        return [...prev, { ...product, cantidad: 1 }];
      });

      if (result.ok) {
        setIsCartOpen(true);
      }

      return result;
    },
    [products, setCart, setIsCartOpen]
  );

  // Elimina completamente un producto del carrito.
  const removeFromCart = useCallback(
    codigo => {
      setCart(prev => prev.filter(item => item.codigo !== codigo));
    },
    [setCart]
  );

  // Suma una unidad a un ítem sin superar el stock.
  const incrementQuantity = useCallback(
    codigo => {
      const catalogProduct = products.find(item => item.codigo === codigo);
      const availableStock = catalogProduct?.cantidad ?? 0;

      setCart(prev =>
        prev.map(item => {
          if (item.codigo !== codigo) {
            return item;
          }

          if (item.cantidad >= availableStock) {
            return item;
          }

          return { ...item, cantidad: item.cantidad + 1 };
        })
      );
    },
    [products, setCart]
  );

  // Resta una unidad a un ítem sin bajar de 1.
  const decrementQuantity = useCallback(
    codigo => {
      setCart(prev =>
        prev.map(item =>
          item.codigo === codigo
            ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
            : item
        )
      );
    },
    [setCart]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // CÁLCULOS DERIVADOS:
  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  // FINALIZACION Y STOCK: 
  // Descuenta stock y vacía el carrito al confirmar el pedido.
  const finalizeOrder = useCallback(() => {
    if (cart.length === 0) {
      return { ok: false, message: 'Tu carrito está vacío.' };
    }

    const quantities = new Map(cart.map(item => [item.codigo, item.cantidad]));

    setProducts(prev =>
      prev.map(product => {
        const quantity = quantities.get(product.codigo);
        if (!quantity) {
          return product;
        }
        const nextCantidad = Math.max(0, product.cantidad - quantity);
        if (nextCantidad === product.cantidad) {
          return product;
        }
        return { ...product, cantidad: nextCantidad };
      })
    );

    setCart([]);
    setIsCartOpen(false);

    return { ok: true };
  }, [cart, setCart, setIsCartOpen, setProducts]);

  // Actualiza el stock desde el panel y sincroniza el carrito.
  const updateProductStock = useCallback(
    (codigo, value) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
        return { ok: false, message: 'Ingresa un número entero válido para el stock.' };
      }

      if (parsed < 0) {
        return { ok: false, message: 'El stock no puede ser negativo.' };
      }

      const product = products.find(item => item.codigo === codigo);
      if (!product) {
        return { ok: false, message: 'No pudimos encontrar ese producto.' };
      }

      if (product.cantidad === parsed) {
        return { ok: false, message: 'El stock ingresado es igual al actual.' };
      }

      const cartItem = cart.find(item => item.codigo === codigo);
      const willAffectCart = cartItem && (parsed === 0 || cartItem.cantidad > parsed);

      setProducts(prev =>
        prev.map(item =>
          item.codigo === codigo
            ? { ...item, cantidad: parsed }
            : item
        )
      );

      if (willAffectCart) {
        setCart(prev =>
          prev
            .map(item => {
              if (item.codigo !== codigo) {
                return item;
              }
              if (parsed === 0) {
                return null;
              }
              if (item.cantidad > parsed) {
                return { ...item, cantidad: parsed };
              }
              return item;
            })
            .filter(Boolean)
        );
      }

      const baseMessage = `Stock de ${product.nombre} actualizado a ${parsed} unidades.`;
      if (!willAffectCart) {
        return { ok: true, message: baseMessage };
      }

      const cartNote =
        parsed === 0
          ? ' El producto se eliminó del carrito por falta de stock.'
          : ' Se ajustó la cantidad en el carrito para respetar el nuevo stock.';

      return { ok: true, message: `${baseMessage}${cartNote}` };
    },
    [cart, products, setCart, setProducts]
  );

  // VALORES EXPUESTOS:
  const value = useMemo(
    () => ({
      cart,
      cartTotal,
      cartItemCount,
      isCartOpen,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      openCart,
      closeCart,
      finalizeOrder,
      updateProductStock
    }),
    [
      cart,
      cartTotal,
      cartItemCount,
      isCartOpen,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      openCart,
      closeCart,
      finalizeOrder,
      updateProductStock
    ]
  );

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useCarrito() {
  const context = useContext(CarritoContext);
  return context;
}
