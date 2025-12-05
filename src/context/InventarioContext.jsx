import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const InventarioContext = createContext();

// URL BASE DEL BACKEND
const BASE_URL = 'http://98.95.199.158:8080/api/productos';

export function InventarioProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // OBTENER PRODUCTOS DESDE BD
  const obtenerProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`Error al conectar con el servidor: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('No se pudo cargar el inventario. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // CARGAR PRODUCTOS AL MONTAR
  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  // CREAR PRODUCTO EN BD
  const crearProducto = useCallback(async (productoNuevo) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoNuevo),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el producto.');
      }

      // RECARGAR LISTA
      await obtenerProductos();
      return { ok: true, message: 'Producto creado exitosamente.' };

    } catch (err) {
      console.error('Error creando producto:', err);
      return { ok: false, message: err.message };
    }
  }, [obtenerProductos]);

  // EDITAR PRODUCTO EN BD
  const editarProducto = useCallback(async (codigo, productoActualizado) => {
    try {
      const response = await fetch(`${BASE_URL}/${codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoActualizado),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al editar el producto.');
      }

      await obtenerProductos();
      return { ok: true, message: 'Producto actualizado exitosamente.' };

    } catch (err) {
      console.error('Error editando producto:', err);
      return { ok: false, message: err.message };
    }
  }, [obtenerProductos]);

  // ELIMINAR PRODUCTO EN BD
  const eliminarProducto = useCallback(async (codigo) => {
    try {
      const response = await fetch(`${BASE_URL}/${codigo}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar el producto.');
      }

      await obtenerProductos();
      return { ok: true, message: 'Producto eliminado exitosamente.' };

    } catch (err) {
      console.error('Error eliminando producto:', err);
      return { ok: false, message: err.message };
    }
  }, [obtenerProductos]);

  // CONTEXTO VALUE
  const value = useMemo(() => ({
    products,
    setProducts,
    loading,
    error,
    obtenerProductos,
    crearProducto,
    editarProducto,
    eliminarProducto
  }), [products, loading, error, obtenerProductos, crearProducto, editarProducto, eliminarProducto]);

  return (
    <InventarioContext.Provider value={value}>
      {children}
    </InventarioContext.Provider>
  );
}

InventarioProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// HOOK PERSONALIZADO
export function useInventario() {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario debe usarse dentro de un InventarioProvider');
  }
  return context;
}

// Importación necesaria para el hook useInventario
import { useContext } from 'react';