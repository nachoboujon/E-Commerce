/* =================================================================
   🚀 SERVIDOR BACKEND - PHONESPOT E-COMMERCE PRO
   Node.js + Express + MongoDB + Security + Performance
   ================================================================= */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./backend/config/logger');

// Cargar variables de entorno (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ============================================================
// VALIDAR VARIABLES DE ENTORNO CRÍTICAS
// ============================================================

if (!process.env.JWT_SECRET) {
    logger.error('❌ FATAL: JWT_SECRET no está configurado en variables de entorno');
    logger.error('Por favor, configura JWT_SECRET antes de iniciar el servidor');
    process.exit(1);
}

// Crear aplicación Express
const app = express();

// ============================================================
// 🛡️ SEGURIDAD - HELMET
// ============================================================

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://cdn.emailjs.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://api.emailjs.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

logger.info('✅ Helmet security headers configurados');

// ============================================================
// 🗜️ COMPRESSION - RENDIMIENTO
// ============================================================

app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    level: 6, // Balance entre velocidad y compresión
    threshold: 1024 // Solo comprimir si es >1KB
}));

logger.info('✅ Compression activado (nivel 6)');

// ============================================================
// 🔒 MONGO SANITIZE - PREVENIR INYECCIONES
// ============================================================

app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        logger.warn(`⚠️ Intento de inyección bloqueado: ${key} en ${req.method} ${req.path}`);
    },
}));

logger.info('✅ Mongo-Sanitize activado');

// ============================================================
// 🚦 RATE LIMITING
// ============================================================

// Rate limit global
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por IP
    message: {
        success: false,
        message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`⚠️ Rate limit excedido: IP ${req.ip} - ${req.method} ${req.path}`);
        res.status(429).json({
            success: false,
            message: 'Demasiadas solicitudes. Intenta más tarde.'
        });
    }
});

// Rate limit estricto para autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Solo 5 intentos
    message: {
        success: false,
        message: 'Demasiados intentos de login. Por favor espera 15 minutos.'
    },
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        logger.warn(`🚨 Demasiados intentos de login: IP ${req.ip} - ${req.body.email || req.body.username}`);
        res.status(429).json({
            success: false,
            message: 'Demasiados intentos de login. Espera 15 minutos.'
        });
    }
});

// Aplicar rate limiting
app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/registro', authLimiter);

logger.info('✅ Rate limiting configurado (Global: 100/15min, Auth: 5/15min)');

// ============================================================
// 🌐 CORS - CONFIGURACIÓN ESTRICTA
// ============================================================

const allowedOrigins = [
    'https://phonespott.netlify.app',
    'https://phonespotsj1.netlify.app',
    process.env.FRONTEND_URL,
    // Solo en desarrollo
    ...(process.env.NODE_ENV !== 'production' ? [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ] : [])
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (apps móviles, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.warn(`🚫 CORS bloqueado para origen: ${origin}`);
            if (process.env.NODE_ENV === 'production') {
                callback(new Error('Origen no permitido por CORS'));
            } else {
                callback(null, true); // Permitir en desarrollo
            }
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
logger.info(`✅ CORS configurado para ${allowedOrigins.length} orígenes`);

// ============================================================
// 📦 BODY PARSER
// ============================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// 📁 ARCHIVOS ESTÁTICOS
// ============================================================

app.use(express.static(__dirname, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// ============================================================
// 🗄️ CONEXIÓN A MONGODB
// ============================================================

const MONGODB_URI = process.env.MONGODB_URI 
    || process.env.MONGO_URL 
    || process.env.DATABASE_URL 
    || process.env.MONGO_URI;

if (!MONGODB_URI) {
    logger.error('❌ FATAL: No se encontró URI de MongoDB en variables de entorno');
    logger.error('Variables buscadas: MONGODB_URI, MONGO_URL, DATABASE_URL, MONGO_URI');
    process.exit(1);
}

// Opciones de conexión optimizadas
const mongooseOptions = {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

logger.info('🔄 Conectando a MongoDB...');
logger.info(`   Tipo: ${MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas ☁️' : 'MongoDB Local 💻'}`);

mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(async () => {
        logger.info('✅ Conectado a MongoDB correctamente');
        logger.info(`   Base de datos: ${mongoose.connection.name}`);
        logger.info(`   Host: ${mongoose.connection.host}`);
        
        // Listar colecciones y usuarios
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            logger.info(`   Colecciones: ${collections.map(c => c.name).join(', ')}`);
            
            const Usuario = require('./backend/models/Usuario');
            const totalUsuarios = await Usuario.countDocuments();
            logger.info(`   Total usuarios: ${totalUsuarios}`);
            
            if (totalUsuarios > 0) {
                const admins = await Usuario.countDocuments({ rol: 'administrador' });
                logger.info(`   Administradores: ${admins}`);
            } else {
                logger.warn('   ⚠️ NO HAY USUARIOS - Ejecuta: npm run init-db');
            }
        } catch (err) {
            logger.error('Error listando usuarios:', err.message);
        }
    })
    .catch((error) => {
        logger.error('❌ Error al conectar a MongoDB:', error.message);
        logger.error('   Verifica que MongoDB esté ejecutándose y las credenciales sean correctas');
        process.exit(1);
    });

// Eventos de conexión
mongoose.connection.on('connected', () => {
    logger.info('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    logger.error('❌ Error de conexión de Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('🔌 Mongoose desconectado de MongoDB');
});

// ============================================================
// 📝 LOGGING DE REQUESTS (OPCIONAL - Solo en desarrollo)
// ============================================================

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.http(`${req.method} ${req.path} - IP: ${req.ip}`);
        next();
    });
}

// ============================================================
// 🛣️ IMPORTAR RUTAS
// ============================================================

const authRoutes = require('./backend/routes/auth');
const productosRoutes = require('./backend/routes/productos');
const ordenesRoutes = require('./backend/routes/ordenes');
const usuariosRoutes = require('./backend/routes/usuarios');

// ============================================================
// 🔌 USAR RUTAS API
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/usuarios', usuariosRoutes);

logger.info('✅ Rutas API configuradas');

// ============================================================
// 🏠 RUTA PRINCIPAL
// ============================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de health check mejorada
app.get('/api/health', (req, res) => {
    const health = {
        status: 'OK',
        message: 'Servidor PhoneSpot funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Conectada ✅' : 'Desconectada ❌',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: require('./package.json').version
    };
    
    logger.http(`Health check: ${health.status}`);
    res.json(health);
});

// ============================================================
// ❌ MANEJO DE ERRORES 404
// ============================================================

app.use((req, res) => {
    logger.warn(`404 - Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada',
        path: req.path
    });
});

// ============================================================
// ⚠️ MANEJO DE ERRORES GLOBAL
// ============================================================

app.use((err, req, res, next) => {
    logger.error(`Error no manejado: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ============================================================
// 🚀 INICIAR SERVIDOR
// ============================================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info('='.repeat(60));
    logger.info('🚀 PHONESPOT E-COMMERCE SERVER INICIADO - v1.1');
    logger.info('='.repeat(60));
    logger.info(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`   Puerto: ${PORT}`);
    logger.info(`   URL Local: http://localhost:${PORT}`);
    logger.info(`   API: http://localhost:${PORT}/api`);
    logger.info(`   Health: http://localhost:${PORT}/api/health`);
    logger.info('='.repeat(60));
    logger.info('🛡️  Seguridad:');
    logger.info('   ✅ Helmet (Security Headers)');
    logger.info('   ✅ Rate Limiting (100/15min global, 5/15min auth)');
    logger.info('   ✅ Mongo Sanitize (Anti-Injection)');
    logger.info('   ✅ CORS Estricto');
    logger.info('   ✅ JWT Secret Validado');
    logger.info('='.repeat(60));
    logger.info('⚡ Rendimiento:');
    logger.info('   ✅ Compression (Gzip/Deflate)');
    logger.info('   ✅ Connection Pooling (5-10 conexiones)');
    logger.info('   ✅ Static File Caching');
    logger.info('='.repeat(60));
    logger.info('📝 Logging:');
    logger.info('   ✅ Winston Logger Professional');
    logger.info('   ✅ Logs en: ./logs/combined.log');
    logger.info('   ✅ Errores en: ./logs/error.log');
    logger.info('='.repeat(60));
});

// ============================================================
// 🔄 MANEJO DE CIERRE GRACEFUL
// ============================================================

const gracefulShutdown = async (signal) => {
    logger.info(`\n⏹️  ${signal} recibido. Cerrando servidor gracefully...`);
    
    server.close(async () => {
        logger.info('✅ Servidor HTTP cerrado');
        
        try {
            await mongoose.connection.close();
            logger.info('✅ Conexión a MongoDB cerrada');
            logger.info('👋 Servidor apagado correctamente');
            process.exit(0);
        } catch (err) {
            logger.error('❌ Error al cerrar MongoDB:', err.message);
            process.exit(1);
        }
    });
    
    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        logger.error('❌ No se pudo cerrar gracefully, forzando cierre...');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    logger.error('🚨 Unhandled Rejection:', reason);
    logger.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
    logger.error('🚨 Uncaught Exception:', error.message);
    logger.error('Stack:', error.stack);
    gracefulShutdown('UNCAUGHT EXCEPTION');
});

module.exports = app;

