import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const InventarioContext = createContext();

// URL BASE DEL BACKEND (Asegúrate de que tu Spring Boot esté corriendo en el puerto 8080)
const BASE_URL = 'http://localhost:8080/api/productos';

export function InventarioProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. OBTENER PRODUCTOS (GET /api/productos)
  // Esta función carga la lista real desde la base de datos
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

  // Carga inicial automática al abrir la página
  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  // 2. CREAR PRODUCTO (POST /api/productos)
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
        // Si el backend envía un mensaje de error específico (ej: "El código ya existe"), lo usamos
        throw new Error(errorData.message || 'Error al crear el producto.');
      }

      // Recargamos la lista para ver el nuevo producto inmediatamente
      await obtenerProductos();
      return { ok: true, message: 'Producto creado exitosamente.' };

    } catch (err) {
      console.error('Error creando producto:', err);
      return { ok: false, message: err.message };
    }
  }, [obtenerProductos]);

  // 3. EDITAR PRODUCTO (PUT /api/productos/{codigo})
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

  // 4. ELIMINAR PRODUCTO (DELETE /api/productos/{codigo})
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

  // Empaquetamos todo para que el resto de la app lo use
  const value = useMemo(() => ({
    products,       // La lista de productos (Estado)
    setProducts,    // Por si necesitas manipular localmente (aunque obtenerProductos es mejor)
    loading,        // Para mostrar un spinner si quieres
    error,          // Para mostrar mensajes de error si falla la conexión
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

// Hook personalizado para usar el contexto fácilmente
export function useInventario() {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario debe usarse dentro de un InventarioProvider');
  }
  return context;
}

// Importación necesaria para el hook useInventario
import { useContext } from 'react';