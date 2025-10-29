/* =================================================================
   SERVICIO DE API - PHONESPOT
   Conecta el frontend con el backend Node.js/MongoDB
   ================================================================= */

// Configuración de la API
const API_CONFIG = {
    // ✅ Backend desplegado en Railway.app - Mucho más rápido que Render
    baseURL: 'https://phonespot-backend-production.up.railway.app/api',
    timeout: 10000
};

/**
 * Función auxiliar para hacer peticiones HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise}
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    // Obtener token de sesión si existe
    const sesion = window.Auth ? Auth.obtenerSesion() : null;
    const token = sesion ? sesion.token : null;
    
    // 🔍 DEBUG: Log para verificar token
    console.log('🔍 API Request:', endpoint);
    console.log('👤 Sesión:', sesion ? `Usuario: ${sesion.username}, Rol: ${sesion.rol}` : 'NO HAY SESIÓN');
    console.log('🔑 Token:', token ? `Presente ✅ (${token.substring(0, 30)}...)` : 'NO presente ❌');
    
    // Configurar headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Header Authorization configurado correctamente');
    } else {
        console.warn('⚠️ NO hay token JWT - Las operaciones requieren autenticación');
        console.warn('⚠️ Si acabas de iniciar sesión, intenta cerrar sesión y volver a entrar');
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
            timeout: API_CONFIG.timeout
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Mensaje de error mejorado
            const errorMsg = data.message || 'Error en la petición';
            console.error(`❌ Error ${response.status} en ${endpoint}:`, errorMsg);
            
            // Si el error es de autenticación, informar al usuario
            if (response.status === 401 || response.status === 403) {
                console.error('🔐 Error de autenticación - Token inválido o expirado');
                throw new Error('No se proporcionó token de autenticación\n\nPor favor, verifica tu conexión e intenta nuevamente.');
            }
            
            throw new Error(errorMsg);
        }
        
        return data;
    } catch (error) {
        console.error(`❌ Error en ${endpoint}:`, error.message);
        throw error;
    }
}

/* =================================================================
   PRODUCTOS API
   ================================================================= */

/**
 * Obtener todos los productos desde el servidor
 * @param {object} filtros - Filtros opcionales
 * @returns {Promise}
 */
async function obtenerProductosAPI(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const endpoint = `/productos?${params.toString()}`;
    
    try {
        const data = await fetchAPI(endpoint);
        return data.productos || [];
    } catch (error) {
        console.error('Error al obtener productos:', error);
        // Si falla, usar localStorage como fallback
        return window.Productos ? Productos.obtenerProductos() : [];
    }
}

/**
 * Obtener producto por ID
 * @param {string} id - ID del producto
 * @returns {Promise}
 */
async function obtenerProductoAPI(id) {
    try {
        const data = await fetchAPI(`/productos/${id}`);
        return data.producto;
    } catch (error) {
        console.error('Error al obtener producto:', error);
        return null;
    }
}

/**
 * Crear nuevo producto (solo admin)
 * @param {object} productoData - Datos del producto
 * @returns {Promise}
 */
async function crearProductoAPI(productoData) {
    try {
        const data = await fetchAPI('/productos', {
            method: 'POST',
            body: JSON.stringify(productoData)
        });
        return data.producto;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
}

/**
 * Actualizar producto existente (solo admin)
 * @param {string} id - ID del producto
 * @param {object} datosActualizados - Nuevos datos
 * @returns {Promise}
 */
async function actualizarProductoAPI(id, datosActualizados) {
    try {
        const data = await fetchAPI(`/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datosActualizados)
        });
        return data.producto;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
}

/**
 * Eliminar producto (solo admin)
 * @param {string} id - ID del producto
 * @returns {Promise}
 */
async function eliminarProductoAPI(id) {
    try {
        const data = await fetchAPI(`/productos/${id}`, {
            method: 'DELETE'
        });
        return data.success;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
}

/**
 * Actualizar stock de producto (solo admin)
 * @param {string} id - ID del producto
 * @param {number} stock - Nuevo stock
 * @returns {Promise}
 */
async function actualizarStockAPI(id, stock) {
    try {
        const data = await fetchAPI(`/productos/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock })
        });
        return data.producto;
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        throw error;
    }
}

/* =================================================================
   ÓRDENES API
   ================================================================= */

/**
 * Crear nueva orden/compra
 * @param {object} ordenData - Datos de la orden
 * @returns {Promise}
 */
async function crearOrdenAPI(ordenData) {
    try {
        const data = await fetchAPI('/ordenes', {
            method: 'POST',
            body: JSON.stringify(ordenData)
        });
        return data.orden;
    } catch (error) {
        console.error('Error al crear orden:', error);
        throw error;
    }
}

/**
 * Obtener mis órdenes (usuario actual)
 * @returns {Promise}
 */
async function obtenerMisOrdenesAPI() {
    try {
        const data = await fetchAPI('/ordenes/mis-ordenes');
        return data.ordenes || [];
    } catch (error) {
        console.error('Error al obtener mis órdenes:', error);
        return [];
    }
}

/**
 * Obtener todas las órdenes (solo admin)
 * @param {object} filtros - Filtros opcionales
 * @returns {Promise}
 */
async function obtenerTodasOrdenesAPI(filtros = {}) {
    try {
        const params = new URLSearchParams(filtros);
        const data = await fetchAPI(`/ordenes?${params.toString()}`);
        return data.ordenes || [];
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        return [];
    }
}

/**
 * Obtener orden por ID
 * @param {string} id - ID de la orden
 * @returns {Promise}
 */
async function obtenerOrdenAPI(id) {
    try {
        const data = await fetchAPI(`/ordenes/${id}`);
        return data.orden;
    } catch (error) {
        console.error('Error al obtener orden:', error);
        return null;
    }
}

/**
 * Actualizar estado de orden (solo admin)
 * @param {string} id - ID de la orden
 * @param {string} estado - Nuevo estado
 * @returns {Promise}
 */
async function actualizarEstadoOrdenAPI(id, estado) {
    try {
        const data = await fetchAPI(`/ordenes/${id}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estado })
        });
        return data.orden;
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        throw error;
    }
}

/**
 * Obtener estadísticas de ventas (solo admin)
 * @returns {Promise}
 */
async function obtenerEstadisticasAPI() {
    try {
        const data = await fetchAPI('/ordenes/admin/estadisticas');
        return data.estadisticas;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
    }
}

/* =================================================================
   USUARIOS API
   ================================================================= */

/**
 * Obtener información del usuario actual
 * @returns {Promise}
 */
async function obtenerPerfilAPI() {
    try {
        const data = await fetchAPI('/usuarios/perfil');
        return data.usuario;
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return null;
    }
}

/**
 * Actualizar perfil del usuario
 * @param {object} datosActualizados - Nuevos datos
 * @returns {Promise}
 */
async function actualizarPerfilAPI(datosActualizados) {
    try {
        const data = await fetchAPI('/usuarios/perfil', {
            method: 'PUT',
            body: JSON.stringify(datosActualizados)
        });
        return data.usuario;
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
}

/* =================================================================
   VERIFICAR CONEXIÓN CON EL BACKEND
   ================================================================= */

/**
 * Verificar si el servidor está disponible
 * @returns {Promise<boolean>}
 */
async function verificarConexionAPI() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL.replace('/api', '')}/api/health`);
        const data = await response.json();
        return data.status === 'OK';
    } catch (error) {
        console.warn('⚠️ No se pudo conectar con el servidor backend');
        return false;
    }
}

/* =================================================================
   SINCRONIZACIÓN PRODUCTOS: BACKEND ↔ LOCALSTORAGE
   ================================================================= */

/**
 * Sincronizar productos desde el backend hacia localStorage
 * Útil para modo offline o cache
 * @param {boolean} forzar - Si es true, sincroniza sin importar historial local
 * @returns {Promise<boolean>}
 */
async function sincronizarProductosDesdeBackend(forzar = false) {
    try {
        // ⚠️ IMPORTANTE: Solo sincronizar productos si no hay cambios locales pendientes
        // Esto evita que se sobrescriban los stocks reducidos por compras offline
        if (!forzar) {
            const historialCompras = localStorage.getItem('historialCompras');
            const hayComprasPendientes = historialCompras && JSON.parse(historialCompras).length > 0;
            
            if (hayComprasPendientes) {
                console.warn('⚠️ Hay compras en historial local - NO sincronizando para preservar stock local');
                console.warn('💡 Si quieres sincronizar, limpia el historial desde el panel de admin');
                return false;
            }
        }
        
        const productos = await obtenerProductosAPI();
        
        if (productos && productos.length > 0) {
            // Guardar en localStorage
            if (window.Productos) {
                localStorage.setItem('productosPhoneSpot', JSON.stringify(productos));
                console.log('✅ Productos sincronizados desde backend:', productos.length);
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error al sincronizar productos:', error);
        return false;
    }
}

/* =================================================================
   INICIALIZACIÓN Y DETECCIÓN AUTOMÁTICA
   ================================================================= */

// Variable global para saber si el backend está disponible
window.BACKEND_DISPONIBLE = false;

/**
 * Inicializar API Service
 * Verifica conexión con backend al cargar
 */
async function inicializarAPIService() {
    console.log('🔌 Verificando conexión con backend...');
    
    const conectado = await verificarConexionAPI();
    window.BACKEND_DISPONIBLE = conectado;
    
    if (conectado) {
        console.log('✅ Conectado al backend - Usando MongoDB');
        
        // Sincronizar productos automáticamente
        await sincronizarProductosDesdeBackend();
    } else {
        console.log('⚠️  Backend no disponible - Usando localStorage (modo offline)');
    }
}

// Inicializar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAPIService);
} else {
    inicializarAPIService();
}

/* =================================================================
   EXPORTAR FUNCIONES
   ================================================================= */

window.APIService = {
    // Productos
    obtenerProductos: obtenerProductosAPI,
    obtenerProducto: obtenerProductoAPI,
    crearProducto: crearProductoAPI,
    actualizarProducto: actualizarProductoAPI,
    eliminarProducto: eliminarProductoAPI,
    actualizarStock: actualizarStockAPI,
    
    // Órdenes
    crearOrden: crearOrdenAPI,
    obtenerMisOrdenes: obtenerMisOrdenesAPI,
    obtenerTodasOrdenes: obtenerTodasOrdenesAPI,
    obtenerOrden: obtenerOrdenAPI,
    actualizarEstadoOrden: actualizarEstadoOrdenAPI,
    obtenerEstadisticas: obtenerEstadisticasAPI,
    
    // Usuarios
    obtenerPerfil: obtenerPerfilAPI,
    actualizarPerfil: actualizarPerfilAPI,
    
    // Utilidades
    verificarConexion: verificarConexionAPI,
    sincronizarProductos: sincronizarProductosDesdeBackend
};

console.log('🔌 Servicio de API cargado');

