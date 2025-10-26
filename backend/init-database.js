/* =================================================================
   SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
   Crea el usuario administrador y productos iniciales
   ================================================================= */

const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phonespot_db';

// ============================================================
// DATOS INICIALES
// ============================================================

const adminData = {
    username: 'admin',
    password: 'Nacho2005', // Se encriptará automáticamente
    email: 'nboujon7@gmail.com',
    nombre: 'Nacho Boujon',
    telefono: '3447 416011',
    direccion: 'Moreno 840, San José, Entre Ríos',
    rol: 'administrador',
    verificado: true,
    activo: true
};

const productosIniciales = [
    // SAMSUNG
    {
        id: 'prod-1',
        nombre: 'Samsung Galaxy S24 Ultra',
        categoria: 'Celulares',
        marca: 'Samsung',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 899,
        precioAnterior: 1199,
        stock: 12,
        descripcion: 'Snapdragon 8 Gen 3, 12GB RAM, S-Pen incluido. Cámara 200MP.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.9,
        esNuevo: true,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-2',
        nombre: 'Samsung Galaxy A54',
        categoria: 'Celulares',
        marca: 'Samsung',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 349,
        stock: 20,
        descripcion: 'Exynos 1380, cámara 50MP, batería 5000mAh. Gama media premium.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-3',
        nombre: 'Samsung Galaxy S23 FE',
        categoria: 'Celulares',
        marca: 'Samsung',
        memoria: '256GB',
        condicion: 'Americano',
        precio: 499,
        precioAnterior: 599,
        stock: 8,
        descripcion: 'Exynos 2200, pantalla AMOLED 120Hz, cámara triple.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    
    // XIAOMI
    {
        id: 'prod-4',
        nombre: 'Xiaomi 14 Pro',
        categoria: 'Celulares',
        marca: 'Xiaomi',
        memoria: '512GB',
        condicion: 'Nuevo',
        precio: 799,
        stock: 15,
        descripcion: 'Snapdragon 8 Gen 3, cámara Leica, carga rápida 120W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.7,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-5',
        nombre: 'Xiaomi Redmi Note 13 Pro',
        categoria: 'Celulares',
        marca: 'Xiaomi',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 279,
        stock: 25,
        descripcion: 'MediaTek Dimensity 7200, cámara 200MP, carga rápida 67W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-6',
        nombre: 'Xiaomi Poco X6 Pro',
        categoria: 'Celulares',
        marca: 'Xiaomi',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 329,
        precioAnterior: 399,
        stock: 18,
        descripcion: 'MediaTek Dimensity 8300, pantalla AMOLED 120Hz.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: true,
        enOferta: true,
        activo: true
    },
    
    // MOTOROLA
    {
        id: 'prod-7',
        nombre: 'Motorola Edge 40 Pro',
        categoria: 'Celulares',
        marca: 'Motorola',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 549,
        stock: 10,
        descripcion: 'Snapdragon 8 Gen 2, cámara 50MP, carga inalámbrica 125W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.4,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-8',
        nombre: 'Motorola Moto G84',
        categoria: 'Celulares',
        marca: 'Motorola',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 249,
        stock: 22,
        descripcion: 'Snapdragon 695, pantalla pOLED 120Hz, diseño premium.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.3,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    
    // APPLE
    {
        id: 'prod-9',
        nombre: 'iPhone 15 Pro Max',
        categoria: 'Celulares',
        marca: 'Apple',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 1199,
        precioAnterior: 1399,
        stock: 8,
        descripcion: 'A17 Pro chip, Titanio, Cámara 48MP, USB-C. Lo último de Apple.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: true,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-10',
        nombre: 'iPhone 14',
        categoria: 'Celulares',
        marca: 'Apple',
        memoria: '128GB',
        condicion: 'Americano',
        precio: 699,
        precioAnterior: 799,
        stock: 12,
        descripcion: 'A15 Bionic, pantalla OLED 6.1", cámara dual 12MP.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.8,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-11',
        nombre: 'iPhone 13',
        categoria: 'Celulares',
        marca: 'Apple',
        memoria: '128GB',
        condicion: 'Americano',
        precio: 549,
        stock: 15,
        descripcion: 'A15 Bionic, cámara dual 12MP, batería de larga duración.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.7,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    
    // INFINIX
    {
        id: 'prod-12',
        nombre: 'Infinix Note 30 Pro',
        categoria: 'Celulares',
        marca: 'Infinix',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 189,
        stock: 30,
        descripcion: 'MediaTek Helio G99, cámara 108MP, carga rápida 68W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.2,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-13',
        nombre: 'Infinix Zero 30',
        categoria: 'Celulares',
        marca: 'Infinix',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 229,
        precioAnterior: 279,
        stock: 25,
        descripcion: 'MediaTek Dimensity 8020, pantalla AMOLED 144Hz.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.3,
        esNuevo: true,
        enOferta: true,
        activo: true
    },
    
    // ITEL
    {
        id: 'prod-14',
        nombre: 'Itel S23+',
        categoria: 'Celulares',
        marca: 'Itel',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 129,
        stock: 40,
        descripcion: 'Unisoc T616, cámara 50MP, batería 5000mAh. Económico.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 3.9,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-15',
        nombre: 'Itel P55',
        categoria: 'Celulares',
        marca: 'Itel',
        memoria: '64GB',
        condicion: 'Nuevo',
        precio: 89,
        stock: 50,
        descripcion: 'Unisoc T606, batería 5000mAh, ideal para uso básico.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 3.7,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    
    // BLACKVIEW
    {
        id: 'prod-16',
        nombre: 'Blackview BV9300',
        categoria: 'Celulares',
        marca: 'Blackview',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 299,
        stock: 12,
        descripcion: 'MediaTek Helio G99, resistente IP68/IP69K, batería 15080mAh.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.4,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-17',
        nombre: 'Blackview A85',
        categoria: 'Celulares',
        marca: 'Blackview',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 119,
        stock: 20,
        descripcion: 'Unisoc T606, pantalla 6.5", batería 4480mAh.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.0,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    
    // LENOVO
    {
        id: 'prod-18',
        nombre: 'Lenovo Legion Y700',
        categoria: 'Tablets',
        marca: 'Lenovo',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 449,
        stock: 8,
        descripcion: 'Snapdragon 870, pantalla 8.8" 120Hz, ideal para gaming.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-19',
        nombre: 'Lenovo Tab P11 Pro',
        categoria: 'Tablets',
        marca: 'Lenovo',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 349,
        stock: 10,
        descripcion: 'MediaTek Kompanio 1300T, pantalla OLED 11.5".',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    
    // ACCESORIOS
    {
        id: 'prod-20',
        nombre: 'AirPods Pro (2da Gen)',
        categoria: 'Accesorios',
        marca: 'Apple',
        memoria: null,
        condicion: 'Nuevo',
        precio: 249,
        precioAnterior: 299,
        stock: 25,
        descripcion: 'Cancelación de ruido activa, audio espacial, estuche MagSafe.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.9,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    
    // PRODUCTOS SIN STOCK
    {
        id: 'prod-21',
        nombre: 'Samsung Galaxy Z Fold 5',
        categoria: 'Celulares',
        marca: 'Samsung',
        memoria: '512GB',
        condicion: 'Nuevo',
        precio: 1599,
        stock: 0,
        descripcion: 'Plegable premium, Snapdragon 8 Gen 2, pantalla 7.6".',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.8,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-22',
        nombre: 'Motorola Razr 40 Ultra',
        categoria: 'Celulares',
        marca: 'Motorola',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 899,
        stock: 0,
        descripcion: 'Plegable flip, Snapdragon 8+ Gen 1, pantalla externa 3.6".',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: true,
        enOferta: false,
        activo: true
    }
];

// ============================================================
// FUNCIÓN DE INICIALIZACIÓN
// ============================================================

async function initDatabase() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');
        
        // ============================================================
        // CREAR ADMINISTRADOR
        // ============================================================
        console.log('👤 Creando usuario administrador...');
        
        // Verificar si ya existe
        const adminExistente = await Usuario.findOne({ username: 'admin' });
        
        if (adminExistente) {
            console.log('⚠️  El administrador ya existe. Actualizando datos...');
            adminExistente.email = adminData.email;
            adminExistente.nombre = adminData.nombre;
            adminExistente.telefono = adminData.telefono;
            adminExistente.direccion = adminData.direccion;
            await adminExistente.save();
            console.log('✅ Administrador actualizado\n');
        } else {
            const admin = new Usuario(adminData);
            await admin.save();
            console.log('✅ Administrador creado exitosamente\n');
        }
        
        // ============================================================
        // CREAR PRODUCTOS
        // ============================================================
        console.log('📦 Creando productos iniciales...');
        
        let productosCreados = 0;
        let productosActualizados = 0;
        
        for (const productoData of productosIniciales) {
            const productoExistente = await Producto.findOne({ id: productoData.id });
            
            if (productoExistente) {
                Object.assign(productoExistente, productoData);
                await productoExistente.save();
                productosActualizados++;
            } else {
                const producto = new Producto(productoData);
                await producto.save();
                productosCreados++;
            }
        }
        
        console.log(`✅ ${productosCreados} productos creados`);
        console.log(`✅ ${productosActualizados} productos actualizados\n`);
        
        // ============================================================
        // RESUMEN
        // ============================================================
        console.log('='.repeat(60));
        console.log('✅ BASE DE DATOS INICIALIZADA CORRECTAMENTE');
        console.log('='.repeat(60));
        console.log('\n📊 RESUMEN:');
        console.log(`   - Base de datos: ${mongoose.connection.name}`);
        console.log(`   - Administrador: ${adminData.username} (${adminData.email})`);
        console.log(`   - Productos: ${productosCreados + productosActualizados}`);
        console.log('\n🔐 CREDENCIALES DE ADMINISTRADOR:');
        console.log(`   - Usuario: ${adminData.username}`);
        console.log(`   - Email: ${adminData.email}`);
        console.log(`   - Contraseña: ${adminData.password}`);
        console.log('='.repeat(60) + '\n');
        
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar inicialización
initDatabase();

