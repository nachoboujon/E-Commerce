/* =================================================================
   SCRIPT PARA RESETEAR PRODUCTOS - PHONESPOT
   Ejecutar una sola vez para actualizar las rutas de imágenes
   ================================================================= */

// Limpiar productos antiguos
localStorage.removeItem('productosPhoneSpot');

// Recargar la página para que se carguen los productos con las nuevas rutas
console.log('✅ Productos reseteados. Recargando...');
setTimeout(() => {
    window.location.reload();
}, 500);

