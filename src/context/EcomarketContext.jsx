import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext.jsx';
import { InventarioProvider } from './InventarioContext.jsx';
import { CarritoProvider } from './CarritoContext.jsx';

// ENVUELVE LA APP CON TODOS LOS CONTEXTOS QUE USAMOS.
export function EcomarketProvider({ children }) {
  return (
    <AuthProvider>
      <InventarioProvider>
        <CarritoProvider>{children}</CarritoProvider>
      </InventarioProvider>
    </AuthProvider>
  );
}

EcomarketProvider.propTypes = {
  children: PropTypes.node.isRequired
};