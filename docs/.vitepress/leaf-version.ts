/**
 * ÚNICA FUENTE DE LA VERSIÓN DE LEAF EN TODO EL SITIO.
 *
 * Actualizar manualmente al publicar un nuevo tren estable.
 * Se propaga automáticamente a:
 *  - Badge del navbar (junto al logo)
 *  - Todas las páginas markdown que usan el placeholder %LEAF_VERSION%
 *    (prosa, tablas y bloques de código)
 */
export const LEAF_VERSION = '2.0.1'
