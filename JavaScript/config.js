/* =================================================================
   CONFIGURACIÓN DEL PROYECTO - PHONESPOT
   Define variables de configuración según el entorno
   ================================================================= */

/**
 * Detectar el entorno actual
 * @returns {string} - 'development', 'staging', o 'production'
 */
function detectarEntorno() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    } else if (hostname.includes('netlify.app') || hostname.includes('phonespot')) {
        return 'production';
    }
    
    return 'production';
}

// ⚙️ URL del backend en Railway (compartida entre producción y desarrollo)
const RAILWAY_BACKEND_URL = 'https://phonespot-backend-production.up.railway.app/api';

// 🔧 MODO DE DESARROLLO: Cambia esto para elegir qué backend usar en localhost
// true = usar Railway (verás compras de producción)
// false = usar localhost:3000 (solo desarrollo local)
const USE_RAILWAY_IN_DEV = true; // ✅ Cambiar a false si quieres desarrollo local aislado

// Configuración por entorno
const CONFIG = {
    development: {
        BACKEND_URL: USE_RAILWAY_IN_DEV ? RAILWAY_BACKEND_URL : 'http://localhost:3000/api',
        USE_LOCAL_STORAGE: false,
        DEBUG: true
    },
    production: {
        BACKEND_URL: RAILWAY_BACKEND_URL, // ✅ Siempre usa Railway en producción
        USE_LOCAL_STORAGE: true, // Usar localStorage como fallback si Railway falla
        DEBUG: false
    }
};

// Obtener configuración actual
const ENTORNO_ACTUAL = detectarEntorno();
const APP_CONFIG = CONFIG[ENTORNO_ACTUAL];

// Exponer configuración globalmente
window.APP_CONFIG = APP_CONFIG;
window.BACKEND_URL = APP_CONFIG.BACKEND_URL;
window.USE_LOCAL_STORAGE_FALLBACK = APP_CONFIG.USE_LOCAL_STORAGE;

// Log de configuración
console.log('%c🔧 CONFIGURACIÓN DE PHONESPOT', 'color: #0066cc; font-size: 14px; font-weight: bold;');
console.log('  📍 Entorno:', ENTORNO_ACTUAL);
console.log('  🔗 Backend URL:', APP_CONFIG.BACKEND_URL || 'No configurado (modo offline)');
console.log('  💾 Usar localStorage como fallback:', APP_CONFIG.USE_LOCAL_STORAGE);

if (ENTORNO_ACTUAL === 'development') {
    if (USE_RAILWAY_IN_DEV) {
        console.log('%c  ✅ LOCALHOST conectado a RAILWAY (verás compras de producción)', 'color: #4caf50; font-weight: bold;');
    } else {
        console.log('%c  🔧 LOCALHOST usando backend local (desarrollo aislado)', 'color: #ff9800; font-weight: bold;');
    }
}

if (ENTORNO_ACTUAL === 'production') {
    console.log('%c  🚀 PRODUCCIÓN conectada a RAILWAY', 'color: #4caf50; font-weight: bold;');
}

// ============================================================
// VERSIÓN DE LA APLICACIÓN
// ============================================================

// Incrementa esta versión cada vez que actualices productos/imágenes
window.APP_VERSION = '5.1';

// Verificar si hay nueva versión y limpiar caché si es necesario
const versionAlmacenada = localStorage.getItem('app_version');
if (versionAlmacenada !== window.APP_VERSION) {
    console.log('🔄 Nueva versión detectada. Limpiando caché...');
    
    // Limpiar productos y caché
    localStorage.removeItem('productosPhoneSpot');
    localStorage.removeItem('versionImagenesPhoneSpot');
    
    // Guardar nueva versión
    localStorage.setItem('app_version', window.APP_VERSION);
    
    console.log('✅ Caché limpiado. Versión:', window.APP_VERSION);
}

