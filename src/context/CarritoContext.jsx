import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useInventario } from './InventarioContext.jsx';

// CLAVE PARA PERSISTIR EL CONTENIDO DEL CARRITO:
const CART_KEY = 'carrito';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_KEY, []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // FUNCIONES DE INVENTARIO
  const { products, setProducts, editarProducto } = useInventario();

  // SINCRONIZAR CARRITO CUANDO CAMBIA EL INVENTARIO:
  useEffect(() => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          const producto = products.find(p => p.codigo === item.codigo);
          
          if (!producto) {
            return null;
          }

          let nuevaCantidad = item.cantidad;
          if (item.cantidad > producto.cantidad) {
            nuevaCantidad = producto.cantidad;
          }

          if (producto.cantidad === 0 || nuevaCantidad === 0) {
            return null;
          }

          return { 
            ...producto, 
            cantidad: nuevaCantidad 
          };
        })
        .filter(Boolean);
    });
  }, [products, setCart]);

  // OPERACIONES SOBRE EL CARRITO:
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

  const removeFromCart = useCallback(
    codigo => {
      setCart(prev => prev.filter(item => item.codigo !== codigo));
    },
    [setCart]
  );

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

  const updateCartQuantity = useCallback(
    (codigo, cantidad) => {
      const parsedCantidad = Number(cantidad);
      if (!Number.isInteger(parsedCantidad) || parsedCantidad < 0) {
        return;
      }

      const catalogProduct = products.find(item => item.codigo === codigo);
      const availableStock = catalogProduct?.cantidad ?? 0;

      setCart(prev => {
        if (parsedCantidad === 0) {
          return prev.filter(item => item.codigo !== codigo);
        }

        return prev.map(item => {
          if (item.codigo !== codigo) {
            return item;
          }
          const nextCantidad = Math.min(parsedCantidad, availableStock);
          return { ...item, cantidad: nextCantidad };
        });
      });
    },
    [products, setCart]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  // FINALIZAR PEDIDO Y ACTUALIZAR STOCK EN BD
  const finalizeOrder = useCallback(async () => {
    if (cart.length === 0) {
      return { ok: false, message: 'Tu carrito está vacío.' };
    }

    try {
      // ACTUALIZAR STOCK DE TODOS LOS PRODUCTOS EN BD
      const promesasDeActualizacion = cart.map(item => {
        const productoEnInventario = products.find(p => p.codigo === item.codigo);
        
        if (!productoEnInventario) return Promise.resolve();

        const nuevoStock = Math.max(0, productoEnInventario.cantidad - item.cantidad);

        const productoActualizado = {
          ...productoEnInventario,
          cantidad: nuevoStock
        };

        return editarProducto(item.codigo, productoActualizado);
      });

      await Promise.all(promesasDeActualizacion);

      // Si todo salió bien, vaciamos el carrito y cerramos
      setCart([]);
      setIsCartOpen(false);

      return { ok: true, message: 'Pedido confirmado y stock actualizado.' };

    } catch (error) {
      console.error("Error al finalizar compra:", error);
      return { ok: false, message: 'Hubo un error al procesar el pedido en el servidor.' };
    }
  }, [cart, products, setCart, setIsCartOpen, editarProducto]);

  // ACTUALIZAR STOCK LOCAL
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

      const baseMessage = `Stock de ${product.nombre} actualizado a ${parsed} unidades (Local).`;
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
      updateCartQuantity,
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
      updateCartQuantity,
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
