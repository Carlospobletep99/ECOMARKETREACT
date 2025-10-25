import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const USERS_KEY = 'usuarios';
const ACTIVE_USER_KEY = 'usuarioActivo';
const CART_KEY = 'carrito';

const EcomarketContext = createContext(null);

export function EcomarketProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_KEY, []);
  const [user, setUser] = useLocalStorage(ACTIVE_USER_KEY, null);
  const [cart, setCart] = useLocalStorage(CART_KEY, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const register = ({ nombre, email, tel, pass, pass2 }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const errors = [];

    if (!nombre.trim() || !trimmedEmail || !tel.trim() || !pass.trim() || !pass2.trim()) {
      errors.push('Por favor, completa todos los campos.');
    }
    if (pass !== pass2) {
      errors.push('Las contraseñas no coinciden.');
    }
    if (trimmedEmail && (!trimmedEmail.includes('@') || !trimmedEmail.includes('.'))) {
      errors.push('El correo electrónico no es válido.');
    }
    if (tel && !/^\+?\d+$/.test(tel.trim())) {
      errors.push('El número telefónico no es válido.');
    }
    if (users.some(u => u.email === trimmedEmail)) {
      errors.push('El correo ya está registrado.');
    }

    if (errors.length > 0) {
      return { ok: false, message: errors[0] };
    }

    const newUser = {
      nombre: nombre.trim(),
      email: trimmedEmail,
      tel: tel.trim(),
      pass: pass.trim()
    };

    setUsers([...users, newUser]);
    setUser({ nombre: newUser.nombre, email: newUser.email, tel: newUser.tel });
    return { ok: true, message: 'Usuario registrado con éxito.' };
  };

  const login = ({ email, pass }) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass.trim()) {
      return { ok: false, message: 'Por favor, completa todos los campos.' };
    }

    const found = users.find(u => u.email === trimmedEmail && u.pass === pass.trim());
    if (!found) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }

    setUser({ nombre: found.nombre, email: found.email, tel: found.tel });
    return { ok: true, message: 'Inicio de sesión exitoso.' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = ({ nombre, tel }) => {
    if (!user) {
      return { ok: false, message: 'Debes iniciar sesión.' };
    }
    if (!nombre.trim()) {
      return { ok: false, message: 'El nombre no puede estar vacío.' };
    }

    const updatedUsers = users.map(u =>
      u.email === user.email ? { ...u, nombre: nombre.trim(), tel: tel.trim() } : u
    );
    setUsers(updatedUsers);
    const updatedUser = { ...user, nombre: nombre.trim(), tel: tel.trim() };
    setUser(updatedUser);
    return { ok: true, message: 'Perfil actualizado con éxito.' };
  };

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.codigo === product.codigo);
      if (existing) {
        return prev.map(item =>
          item.codigo === product.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const clearCart = () => setCart([]);

  const removeFromCart = codigo => {
    setCart(prev => prev.filter(item => item.codigo !== codigo));
  };

  const incrementQuantity = codigo => {
    setCart(prev =>
      prev.map(item =>
        item.codigo === codigo ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decrementQuantity = codigo => {
    setCart(prev =>
      prev.map(item =>
        item.codigo === codigo
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
          : item
      )
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      users,
      user,
      cart,
      cartTotal,
      cartItemCount,
      isCartOpen,
      register,
      login,
      logout,
      updateProfile,
      addToCart,
      clearCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      openCart,
      closeCart
    }),
    [users, user, cart, cartTotal, cartItemCount, isCartOpen]
  );

  return <EcomarketContext.Provider value={value}>{children}</EcomarketContext.Provider>;
}

EcomarketProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useEcomarket() {
  const context = useContext(EcomarketContext);
  if (!context) {
    throw new Error('useEcomarket debe usarse dentro de un EcomarketProvider');
  }
  return context;
}