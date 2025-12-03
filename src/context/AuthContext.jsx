import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// CLAVE PARA PERSISTIR LA SESIÓN
const ACTIVE_USER_KEY = 'usuarioActivo';
// URL BASE DEL BACKEND
const BASE_URL = 'http://localhost:8080/api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 // Inicializamos el usuario leyendo del localStorage
 const [user, setUserState] = useState(() => {
   try {
     const stored = window.localStorage.getItem(ACTIVE_USER_KEY);
     return stored ? JSON.parse(stored) : null;
   } catch (error) {
     return null;
   }
 });

 // Helper para guardar en estado y en localStorage
 const setUser = useCallback((userData) => {
   setUserState(userData);
   if (userData) {
     window.localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userData));
   } else {
     window.localStorage.removeItem(ACTIVE_USER_KEY);
   }
 }, []);

 // REGISTRO DE USUARIOS
 const register = useCallback(async ({ nombre, email, tel, pass, pass2 }) => {
   if (!nombre || !email || !tel || !pass || !pass2) {
     return { ok: false, message: 'Por favor, completa todos los campos.' };
   }
   if (pass !== pass2) {
     return { ok: false, message: 'Las contraseñas no coinciden.' };
   }

   try {
     const response = await fetch(`${BASE_URL}/registro`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ nombre, email, telefono: tel, password: pass })
     });

     const data = await response.json();

     if (!response.ok) {
       return { ok: false, message: data.message || 'Error al registrarse.' };
     }

     setUser({
       nombre: data.nombre,
       email: data.email,
       tel: data.telefono,
       isAdmin: data.esAdmin
     });

     return { ok: true, message: 'Usuario registrado con éxito.' };

   } catch (error) {
     console.error('Error en registro:', error);
     return { ok: false, message: 'Error de conexión con el servidor.' };
   }
 }, [setUser]);

 // INICIO DE SESIÓN
 const login = useCallback(async ({ email, pass }) => {
   if (!email || !pass) {
     return { ok: false, message: 'Por favor, completa todos los campos.' };
   }

   try {
     const response = await fetch(`${BASE_URL}/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, pass })
     });

     const data = await response.json();

     if (!response.ok) {
       return { ok: false, message: data.message || 'Credenciales incorrectas.' };
     }

     setUser({
       nombre: data.nombre,
       email: data.email,
       tel: data.telefono,
       isAdmin: data.esAdmin
     });

     return { ok: true, message: 'Inicio de sesión exitoso.' };

   } catch (error) {
     console.error('Error en login:', error);
     return { ok: false, message: 'Error de conexión con el servidor.' };
   }
 }, [setUser]);

 // CIERRE DE SESIÓN
 const logout = useCallback(() => {
   setUser(null);
 }, [setUser]);

 // EDICIÓN DE PERFIL (CONECTADA AL BACKEND)
 const updateProfile = useCallback(async ({ nombre, email, tel }) => {
   if (!user) return { ok: false, message: 'No hay sesión activa.' };
   
   try {
     // Endpoint PUT con el email como identificador
     const response = await fetch(`${BASE_URL}/actualizar/${user.email}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       // Mapeamos 'tel' a 'telefono' para el backend
       body: JSON.stringify({ 
         nombre: nombre, 
         email: email, 
         telefono: tel 
       }) 
     });

     const data = await response.json();

     if (!response.ok) {
       return { ok: false, message: data.message || 'Error al actualizar.' };
     }

     // Actualizamos sesión local con los datos del backend
     const updatedUser = { 
       ...user, 
       nombre: data.nombre, 
       email: data.email, 
       tel: data.telefono,
       isAdmin: user.isAdmin 
     };
     
     setUser(updatedUser);
     
     return { ok: true, message: 'Perfil actualizado correctamente en la base de datos.' };

   } catch (error) {
     console.error('Error al actualizar perfil:', error);
     return { ok: false, message: 'Error de conexión.' };
   }
 }, [user, setUser]);

 // ELIMINAR CUENTA (CONECTADA AL BACKEND)
 const eliminarCuenta = useCallback(async () => {
   if (!user) return { ok: false, message: 'No hay sesión activa.' };

   try {
     // Endpoint DELETE
     const response = await fetch(`${BASE_URL}/eliminar/${user.email}`, {
       method: 'DELETE',
     });

     if (!response.ok) {
       return { ok: false, message: 'No se pudo eliminar la cuenta.' };
     }

     setUser(null);
     return { ok: true, message: 'Cuenta eliminada permanentemente.' };

   } catch (error) {
     console.error('Error al eliminar cuenta:', error);
     return { ok: false, message: 'Error de conexión.' };
   }
 }, [user, setUser]);

 const value = useMemo(
   () => ({ 
     user, 
     users: [], 
     register, 
     login, 
     logout, 
     updateProfile, 
     eliminarCuenta 
   }),
   [user, register, login, logout, updateProfile, eliminarCuenta]
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
