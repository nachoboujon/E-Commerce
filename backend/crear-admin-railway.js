/* =================================================================
   CREAR USUARIO ADMIN EN MONGODB (PARA RAILWAY)
   Ejecutar: node backend/crear-admin-railway.js
   ================================================================= */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Usar la misma URI que usa el servidor
const MONGODB_URI = process.env.MONGODB_URI 
    || process.env.MONGO_URL 
    || process.env.DATABASE_URL 
    || process.env.MONGO_URI
    || 'mongodb+srv://nachoboujon:Nacho2005@cluster0.bhl5wo4.mongodb.net/phonespot_db?retryWrites=true&w=majority';

console.log('🔌 Conectando a:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas ☁️' : 'MongoDB Local 💻');

// Importar el modelo Usuario
const Usuario = require('./models/Usuario');

async function crearAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        console.log('📊 Base de datos:', mongoose.connection.db.databaseName);
        console.log('');
        
        // Verificar si ya existe
        const adminExistente = await Usuario.findOne({ email: 'nboujon7@gmail.com' });
        
        if (adminExistente) {
            console.log('⚠️ Usuario admin ya existe:');
            console.log('   Username:', adminExistente.username);
            console.log('   Email:', adminExistente.email);
            console.log('   Rol:', adminExistente.rol);
            console.log('');
            console.log('🗑️ Eliminando usuario existente para recrearlo...');
            await Usuario.deleteOne({ email: 'nboujon7@gmail.com' });
            console.log('✅ Usuario eliminado');
        }
        
        // Crear nuevo usuario admin
        console.log('👤 Creando nuevo usuario admin...');
        
        const adminData = {
            username: 'admin',
            password: 'Nacho2005', // Se hasheará automáticamente por el pre-save hook
            email: 'nboujon7@gmail.com',
            nombre: 'Nacho Boujon',
            telefono: '1234567890',
            direccion: 'Buenos Aires, Argentina',
            rol: 'administrador',
            verificado: true,
            activo: true,
            fechaRegistro: new Date()
        };
        
        const nuevoAdmin = new Usuario(adminData);
        await nuevoAdmin.save();
        
        console.log('✅ Usuario admin creado exitosamente!');
        console.log('');
        console.log('📋 DATOS DEL ADMIN:');
        console.log('   Username:', nuevoAdmin.username);
        console.log('   Email:', nuevoAdmin.email);
        console.log('   Nombre:', nuevoAdmin.nombre);
        console.log('   Rol:', nuevoAdmin.rol);
        console.log('   Verificado:', nuevoAdmin.verificado);
        console.log('   Activo:', nuevoAdmin.activo);
        console.log('   Password hash:', nuevoAdmin.password.substring(0, 30) + '...');
        console.log('');
        
        // Verificar que la password funciona
        const passwordTest = await bcrypt.compare('Nacho2005', nuevoAdmin.password);
        console.log('🧪 Test de password:', passwordTest ? '✅ CORRECTA' : '❌ INCORRECTA');
        
        if (passwordTest) {
            console.log('');
            console.log('🎉 ¡TODO LISTO!');
            console.log('');
            console.log('Ahora puedes iniciar sesión con:');
            console.log('   📧 Email: nboujon7@gmail.com');
            console.log('   🔑 Password: Nacho2005');
        }
        
        await mongoose.disconnect();
        console.log('');
        console.log('👋 Desconectado de MongoDB');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

crearAdmin();

