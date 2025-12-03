/* Guarda un valor y lo recuerda en localStorage */
/* EJEMPLO: const [nombre, setNombre] = useLocalStorage('nombre', 'Invitado'); */
import { useEffect, useState } from 'react';

export function useLocalStorage(key, defaultValue) {
  /* Vuelve a cargar lo guardado, si no hay usa el valor inicial */
  /* EJEMPLO: Al recargar, busca window.localStorage.getItem('nombre') */
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  /* Cada vez que cambia, guarda de nuevo en localStorage */
  /* EJEMPLO: setNombre('Carlos') -> guarda "Carlos" en localStorage */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error silencioso - localStorage no disponible o lleno
    }
  }, [key, value]);

  /* Devuelve el valor actual y la función para actualizarlo */
  /* EJEMPLO: nombre tiene el dato, setNombre lo cambia */
  return [value, setValue];
}