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

// Configuración por entorno
const CONFIG = {
    development: {
        BACKEND_URL: 'http://localhost:3000/api',
        USE_LOCAL_STORAGE: false,
        DEBUG: true
    },
    production: {
        // 🔥 IMPORTANTE: Reemplaza esta URL con la URL de tu backend desplegado
        // Ejemplos:
        // - Render: 'https://phonespot-backend.onrender.com/api'
        // - Railway: 'https://phonespot-backend.up.railway.app/api'
        // - Heroku: 'https://phonespot-backend.herokuapp.com/api'
        BACKEND_URL: process.env.BACKEND_URL || null, // Si no hay backend, usa localStorage
        USE_LOCAL_STORAGE: true, // Usar localStorage como fallback
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
if (APP_CONFIG.DEBUG) {
    console.log('🔧 Configuración cargada:');
    console.log('  - Entorno:', ENTORNO_ACTUAL);
    console.log('  - Backend URL:', APP_CONFIG.BACKEND_URL || 'No configurado (modo offline)');
    console.log('  - Usar localStorage:', APP_CONFIG.USE_LOCAL_STORAGE);
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

