/* =================================================================
   CACHÉ CONFIGURATION - NODE-CACHE
   Sistema de caché en memoria para mejorar rendimiento
   ================================================================= */

const NodeCache = require('node-cache');
const logger = require('./logger');

// Crear instancia de caché
// stdTTL: Time To Live en segundos (600 = 10 minutos)
// checkperiod: Cada cuánto revisar elementos expirados (120 = 2 minutos)
const cache = new NodeCache({
    stdTTL: 600, // 10 minutos por default
    checkperiod: 120,
    useClones: false // Mejor rendimiento, pero cuidado con mutaciones
});

// Eventos del caché
cache.on('set', (key, value) => {
    logger.debug(`📦 Caché SET: ${key}`);
});

cache.on('del', (key) => {
    logger.debug(`🗑️  Caché DEL: ${key}`);
});

cache.on('expired', (key, value) => {
    logger.debug(`⏰ Caché EXPIRED: ${key}`);
});

cache.on('flush', () => {
    logger.info('🧹 Caché FLUSH: Todo el caché limpiado');
});

// Funciones helper
const cacheMiddleware = (duration = 600) => {
    return (req, res, next) => {
        // Solo cachear GET requests
        if (req.method !== 'GET') {
            return next();
        }
        
        const key = `__express__${req.originalUrl || req.url}`;
        const cachedResponse = cache.get(key);
        
        if (cachedResponse) {
            logger.debug(`✅ Cache HIT: ${key}`);
            return res.json(cachedResponse);
        }
        
        logger.debug(`❌ Cache MISS: ${key}`);
        
        // Guardar respuesta original
        res.originalJson = res.json;
        
        // Sobrescribir res.json para cachear la respuesta
        res.json = function(data) {
            res.originalJson(data);
            cache.set(key, data, duration);
        };
        
        next();
    };
};

// Limpiar caché por pattern
const clearCacheByPattern = (pattern) => {
    const keys = cache.keys();
    const matchedKeys = keys.filter(key => key.includes(pattern));
    
    if (matchedKeys.length > 0) {
        cache.del(matchedKeys);
        logger.info(`🧹 Caché limpiado: ${matchedKeys.length} keys con pattern "${pattern}"`);
    }
    
    return matchedKeys.length;
};

// Stats del caché
const getCacheStats = () => {
    const stats = cache.getStats();
    return {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses,
        ksize: stats.ksize,
        vsize: stats.vsize
    };
};

module.exports = {
    cache,
    cacheMiddleware,
    clearCacheByPattern,
    getCacheStats
};

