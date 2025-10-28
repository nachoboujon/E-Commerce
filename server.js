/* =================================================================
   SERVIDOR BACKEND - PHONESPOT E-COMMERCE
   Node.js + Express + MongoDB
   ================================================================= */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config();

// Crear aplicación Express
const app = express();

// ============================================================
// MIDDLEWARES
// ============================================================

// CORS - Permitir peticiones desde el frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // En producción, especificar tu URL de Netlify
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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phonespot_db';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB correctamente');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);
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

