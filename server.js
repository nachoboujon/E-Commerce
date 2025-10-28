/* =================================================================
   SERVIDOR BACKEND - PHONESPOT E-COMMERCE
   Node.js + Express + MongoDB
   ================================================================= */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Crear aplicación Express
const app = express();

// ============================================================
// MIDDLEWARES
// ============================================================

// CORS - Permitir peticiones desde el frontend
const allowedOrigins = [
    'https://phonespott.netlify.app',
    'https://phonespotsj1.netlify.app', // URL anterior por compatibilidad
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como apps móviles o curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ CORS bloqueado para origen:', origin);
            callback(null, true); // En desarrollo, permitir todos
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser - Para leer JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(__dirname));

// ============================================================
// CONEXIÓN A MONGODB
// ============================================================

// Intentar múltiples nombres de variables para MongoDB
const MONGODB_URI = process.env.MONGODB_URI 
    || process.env.MONGO_URL 
    || process.env.DATABASE_URL 
    || process.env.MONGO_URI
    || 'mongodb://localhost:27017/phonespot_db';

// 🔍 DEBUG: Verificar variables de entorno
console.log('🔍 Variables de entorno cargadas:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'no configurado');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ NO configurado');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO configurado');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'no configurado');
console.log('   Intentando conectar a:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas ☁️' : 'MongoDB Local 💻');

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Conectado a MongoDB correctamente');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);
        console.log(`🔗 Host: ${mongoose.connection.host}`);
        
        // Listar colecciones y usuarios
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('📋 Colecciones:', collections.map(c => c.name).join(', '));
            
            const Usuario = require('./backend/models/Usuario');
            const totalUsuarios = await Usuario.countDocuments();
            console.log(`👥 Total usuarios: ${totalUsuarios}`);
            
            if (totalUsuarios > 0) {
                const usuarios = await Usuario.find({}, 'username email rol').limit(3);
                console.log('📋 Usuarios en BD:');
                usuarios.forEach((u, i) => {
                    console.log(`   ${i + 1}. ${u.username} / ${u.email} / ${u.rol}`);
                });
            } else {
                console.log('⚠️ NO HAY USUARIOS EN LA BASE DE DATOS - CREAR ADMIN');
            }
        } catch (err) {
            console.error('Error listando usuarios:', err.message);
        }
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error);
        console.log('\n⚠️  IMPORTANTE: Asegúrate de tener MongoDB instalado y ejecutándose');
        console.log('   Puedes instalarlo desde: https://www.mongodb.com/try/download/community');
    });

// Eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose desconectado de MongoDB');
});

// ============================================================
// IMPORTAR RUTAS
// ============================================================

const authRoutes = require('./backend/routes/auth');
const productosRoutes = require('./backend/routes/productos');
const ordenesRoutes = require('./backend/routes/ordenes');
const usuariosRoutes = require('./backend/routes/usuarios');

// ============================================================
// USAR RUTAS API
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// ============================================================
// RUTA PRINCIPAL
// ============================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor PhoneSpot funcionando correctamente',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Conectada' : 'Desconectada'
    });
});

// ============================================================
// MANEJO DE ERRORES 404
// ============================================================

app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SERVIDOR PHONESPOT E-COMMERCE INICIADO');
    console.log('='.repeat(60));
    console.log(`📡 Servidor escuchando en: http://localhost:${PORT}`);
    console.log(`🌐 Frontend disponible en: http://localhost:${PORT}/index.html`);
    console.log(`🔧 API disponible en: http://localhost:${PORT}/api`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60) + '\n');
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n⏹️  Cerrando servidor...');
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
});

