/**
 * Formatea un monto numérico a formato de moneda chilena (CLP)
 * @param {number} monto - El monto a formatear
 * @returns {string} El monto formateado con separador de miles (ej: "$1.500")
 */
export function formatearMoneda(monto) {
  return `$${monto.toLocaleString('es-CL')}`;
}
