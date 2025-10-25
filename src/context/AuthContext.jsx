import { createContext, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

// CLAVES DE ALMACENAMIENTO PERSISTENTE:
const USERS_KEY = 'usuarios';
const ACTIVE_USER_KEY = 'usuarioActivo';

// DATOS DEL ADMIN POR DEFECTO:
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_KEY, []);
  const [user, setUser] = useLocalStorage(ACTIVE_USER_KEY, null);

  // REGISTRO DE USUARIOS:
  const register = useCallback(({ nombre, email, tel, pass, pass2 }) => {
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
    if (trimmedEmail === ADMIN_EMAIL) {
      errors.push('Ese correo está reservado para el administrador.');
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
      pass: pass.trim(),
      isAdmin: false
    };

    setUsers(prev => [...prev, newUser]);
    setUser({ nombre: newUser.nombre, email: newUser.email, tel: newUser.tel, isAdmin: false });
    return { ok: true, message: 'Usuario registrado con éxito.' };
  }, [setUser, setUsers, users]);

  // INICIO DE SESION:
  const login = useCallback(({ email, pass }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail || !trimmedPass) {
      return { ok: false, message: 'Por favor, completa todos los campos.' };
    }

    if (trimmedEmail === ADMIN_EMAIL && trimmedPass === ADMIN_PASSWORD) {
      const adminUser = {
        nombre: 'Administrador',
        email: ADMIN_EMAIL,
        tel: '',
        isAdmin: true
      };
      setUser(adminUser);
      return { ok: true, message: 'Bienvenido, administrador.' };
    }

    const found = users.find(u => u.email === trimmedEmail && u.pass === trimmedPass);
    if (!found) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }

    setUser({
      nombre: found.nombre,
      email: found.email,
      tel: found.tel,
      isAdmin: !!found.isAdmin
    });
    return { ok: true, message: 'Inicio de sesión exitoso.' };
  }, [setUser, users]);

  // CIERRE DE SESION:
  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  // EDICION DEL PERFIL:
  const updateProfile = useCallback(({ nombre, tel }) => {
    if (!user) {
      return { ok: false, message: 'Debes iniciar sesión.' };
    }
    if (user.isAdmin) {
      return { ok: false, message: 'El perfil de administrador no se puede editar desde aquí.' };
    }
    if (!nombre.trim()) {
      return { ok: false, message: 'El nombre no puede estar vacío.' };
    }

    setUsers(prev =>
      prev.map(u => (u.email === user.email ? { ...u, nombre: nombre.trim(), tel: tel.trim() } : u))
    );
    const updatedUser = { ...user, nombre: nombre.trim(), tel: tel.trim() };
    setUser(updatedUser);
    return { ok: true, message: 'Perfil actualizado con éxito.' };
  }, [setUser, setUsers, user]);

  // DISPONIBLES PARA TODA LA APP:
  const value = useMemo(
    () => ({ users, user, register, login, logout, updateProfile }),
    [users, user, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
