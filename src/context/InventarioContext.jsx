import { createContext, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { products as initialProducts } from '../data/products.js';

// CLAVE DEL INVENTARIO ALMACENADO EN LOCALSTORAGE:
const PRODUCTS_KEY = 'productosInventario';

const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [products, setProducts] = useLocalStorage(PRODUCTS_KEY, initialProducts);

  // CREAR NUEVO PRODUCTO:
  const crearProducto = useCallback((nuevoProducto) => {
    // Validar que el código no exista
    const codigoExiste = products.some(p => p.codigo === nuevoProducto.codigo);
    if (codigoExiste) {
      return { ok: false, message: 'Ya existe un producto con ese código.' };
    }

    // Agregar el nuevo producto
    setProducts(prev => [...prev, nuevoProducto]);
    return { ok: true, message: 'Producto creado exitosamente.' };
  }, [products, setProducts]);

  // EDITAR PRODUCTO EXISTENTE:
  const editarProducto = useCallback((codigoOriginal, productoActualizado) => {
    // Validar que el producto exista
    const productoExiste = products.some(p => p.codigo === codigoOriginal);
    if (!productoExiste) {
      return { ok: false, message: 'El producto no existe.' };
    }

    // Si cambió el código, verificar que el nuevo no esté en uso
    if (codigoOriginal !== productoActualizado.codigo) {
      const codigoEnUso = products.some(p => p.codigo === productoActualizado.codigo);
      if (codigoEnUso) {
        return { ok: false, message: 'El nuevo código ya está en uso por otro producto.' };
      }
    }

    // Actualizar el producto
    setProducts(prev => prev.map(p => 
      p.codigo === codigoOriginal ? productoActualizado : p
    ));
    return { ok: true, message: 'Producto actualizado exitosamente.' };
  }, [products, setProducts]);

  // ELIMINAR PRODUCTO:
  const eliminarProducto = useCallback((codigo) => {
    const productoExiste = products.some(p => p.codigo === codigo);
    if (!productoExiste) {
      return { ok: false, message: 'El producto no existe.' };
    }

    setProducts(prev => prev.filter(p => p.codigo !== codigo));
    return { ok: true, message: 'Producto eliminado exitosamente.' };
  }, [products, setProducts]);

  // COMPARTIMOS CATALOGO Y FUNCIONES CRUD:
  const value = useMemo(
    () => ({ 
      products, 
      setProducts,
      crearProducto,
      editarProducto,
      eliminarProducto
    }),
    [products, setProducts, crearProducto, editarProducto, eliminarProducto]
  );

  return <InventarioContext.Provider value={value}>{children}</InventarioContext.Provider>;
}

InventarioProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useInventario() {
  const context = useContext(InventarioContext);
  return context;
}
