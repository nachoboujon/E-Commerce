/* =================================================================
   SCRIPT PARA LIMPIAR CACHE DE PRODUCTOS - PHONESPOT
   ================================================================= */

/**
 * Limpia el cache de productos y fuerza recarga desde MongoDB
 * Uso: Ejecutar en la consola del navegador cuando necesites actualizar productos
 */
function limpiarCacheProductos() {
    console.log('🧹 Limpiando cache de productos...');
    
    // Eliminar productos del localStorage
    localStorage.removeItem('productosPhoneSpot');
    
    // Resetear versión para forzar actualización
    localStorage.removeItem('versionProductosPhoneSpot');
    
    console.log('✅ Cache limpiado correctamente');
    console.log('🔄 Recargando página...');
    
    // Recargar página para obtener productos desde MongoDB
    location.reload();
}

/**
 * Muestra información sobre el cache actual
 */
function verCacheProductos() {
    const productos = localStorage.getItem('productosPhoneSpot');
    const version = localStorage.getItem('versionProductosPhoneSpot');
    
    console.log('📋 INFORMACIÓN DEL CACHE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Versión actual:', version || 'No definida');
    
    if (productos) {
        const productosArray = JSON.parse(productos);
        console.log('📊 Productos en cache:', productosArray.length);
        console.log('📝 Últimos 5 productos:', productosArray.slice(0, 5).map(p => p.nombre));
    } else {
        console.log('⚠️ No hay productos en cache');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Fuerza recarga desde MongoDB sin limpiar cache
 */
async function recargarDesdeMongoDB() {
    if (!window.APIService) {
        console.error('❌ APIService no disponible');
        return;
    }
    
    try {
        console.log('🔄 Recargando productos desde MongoDB...');
        const productos = await window.APIService.obtenerProductos();
        
        if (productos && productos.length > 0) {
            localStorage.setItem('productosPhoneSpot', JSON.stringify(productos));
            console.log('✅ Productos actualizados:', productos.length);
            console.log('🔄 Recargando página...');
            location.reload();
        } else {
            console.error('❌ No se obtuvieron productos de MongoDB');
        }
    } catch (error) {
        console.error('❌ Error al recargar desde MongoDB:', error);
    }
}

// Exportar funciones globalmente
window.CacheUtils = {
    limpiar: limpiarCacheProductos,
    ver: verCacheProductos,
    recargar: recargarDesdeMongoDB
};

console.log('🛠️ Utilidades de cache cargadas. Usa:');
console.log('  - CacheUtils.limpiar() → Limpia cache y recarga');
console.log('  - CacheUtils.ver() → Muestra info del cache');
console.log('  - CacheUtils.recargar() → Fuerza recarga desde MongoDB');

