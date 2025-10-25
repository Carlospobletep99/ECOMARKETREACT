import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { products as initialProducts } from '../data/products.js';

// CLAVE DEL INVENTARIO ALMACENADO EN LOCALSTORAGE:
const PRODUCTS_KEY = 'productosInventario';

const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [products, setProducts] = useLocalStorage(PRODUCTS_KEY, initialProducts);

  // COMPARTIMOS CATALOGO Y SETTER PARA QUE OTROS CONTEXTOS SINCRONICEN EL STOCK:
  const value = useMemo(
    () => ({ products, setProducts }),
    [products, setProducts]
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
