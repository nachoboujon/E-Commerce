/* =================================================================
   SCRIPT DE INICIALIZACIÓN DE PRODUCTOS
   Populate la base de datos con productos iniciales
   ================================================================= */

const mongoose = require('mongoose');
const Producto = require('./models/Producto');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phonespot_db';

// Productos iniciales del catálogo
const productosIniciales = [
    // ========== CELULARES - SAMSUNG ==========
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
        precioAnterior: null,
        stock: 20,
        descripcion: 'Exynos 1380, cámara 50MP, batería 5000mAh. Gama media premium.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.0,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-3',
        nombre: 'iPhone 14',
        categoria: 'Celulares',
        marca: 'Apple',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 450000,
        precioAnterior: null,
        stock: 3,
        descripcion: 'Chip A15 Bionic, Pantalla 6.1", Cámara dual 12MP, 5G. iOS 16.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-4',
        nombre: 'Motorola Edge 40',
        categoria: 'Celulares',
        marca: 'Motorola',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 48750,
        precioAnterior: 75000,
        stock: 15,
        descripcion: 'MediaTek Dimensity 8020, Pantalla pOLED 6.55", 8GB RAM, Carga 68W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.2,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-5',
        nombre: 'Google Pixel 8',
        categoria: 'Celulares',
        marca: 'Google',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 380000,
        precioAnterior: null,
        stock: 7,
        descripcion: 'Tensor G3, OLED 6.2", 8GB RAM, 128GB. Cámara 50MP con IA.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.8,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-6',
        nombre: 'OnePlus 11',
        categoria: 'Celulares',
        marca: 'OnePlus',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 320000,
        precioAnterior: null,
        stock: 6,
        descripcion: 'Snapdragon 8 Gen 2, AMOLED 120Hz 6.7", 12GB RAM, Carga rápida 100W.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    
    // ========== TABLETS ==========
    {
        id: 'prod-7',
        nombre: 'iPad Pro 12.9" M2',
        categoria: 'Tablets',
        marca: 'Apple',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 850000,
        precioAnterior: null,
        stock: 4,
        descripcion: 'Chip M2, Liquid Retina XDR, 128GB, Wi-Fi 6E. Compatible con Apple Pencil.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-8',
        nombre: 'Samsung Galaxy Tab S9',
        categoria: 'Tablets',
        marca: 'Samsung',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 420000,
        precioAnterior: null,
        stock: 8,
        descripcion: 'Snapdragon 8 Gen 2, Dynamic AMOLED 11", 8GB RAM, S Pen incluido.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-9',
        nombre: 'Lenovo Tab P11 Pro Gen 2',
        categoria: 'Tablets',
        marca: 'Lenovo',
        memoria: '128GB',
        condicion: 'Nuevo',
        precio: 180000,
        precioAnterior: 220000,
        stock: 15,
        descripcion: 'MediaTek Kompanio 1300T, OLED 11.5", 6GB RAM, Dolby Atmos.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.1,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-10',
        nombre: 'iPad Air 5ta Gen',
        categoria: 'Tablets',
        marca: 'Apple',
        memoria: '64GB',
        condicion: 'Nuevo',
        precio: 520000,
        precioAnterior: null,
        stock: 10,
        descripcion: 'Chip M1, Liquid Retina 10.9", 64GB, Touch ID, Cámara frontal 12MP.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.8,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-11',
        nombre: 'Samsung Galaxy Tab A8',
        categoria: 'Tablets',
        marca: 'Samsung',
        memoria: '64GB',
        condicion: 'Nuevo',
        precio: 95000,
        precioAnterior: null,
        stock: 20,
        descripcion: 'Unisoc Tiger T618, LCD 10.5", 4GB RAM, Quad Speakers.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 3.9,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    
    // ========== NOTEBOOKS ==========
    {
        id: 'prod-12',
        nombre: 'MacBook Pro 14" M3',
        categoria: 'Notebooks',
        marca: 'Apple',
        memoria: '512GB',
        condicion: 'Nuevo',
        precio: 1450000,
        precioAnterior: null,
        stock: 3,
        descripcion: 'Chip M3, 16GB RAM, SSD 512GB, Pantalla Liquid Retina XDR, macOS Sonoma.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-13',
        nombre: 'Dell XPS 13 Plus',
        categoria: 'Notebooks',
        marca: 'Dell',
        memoria: '512GB',
        condicion: 'Nuevo',
        precio: 920000,
        precioAnterior: null,
        stock: 5,
        descripcion: 'Intel Core i7 13th Gen, 16GB RAM, SSD 512GB, Pantalla OLED 13.4", Win 11.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.7,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-14',
        nombre: 'Lenovo ThinkPad X1 Carbon',
        categoria: 'Notebooks',
        marca: 'Lenovo',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 680000,
        precioAnterior: 780000,
        stock: 8,
        descripcion: 'Intel Core i5 12th Gen, 16GB RAM, SSD 256GB, 14" FHD, Ultraliviana.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.3,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-15',
        nombre: 'ASUS ROG Strix G16',
        categoria: 'Notebooks',
        marca: 'ASUS',
        memoria: '1TB',
        condicion: 'Nuevo',
        precio: 1280000,
        precioAnterior: null,
        stock: 4,
        descripcion: 'Intel Core i9, RTX 4060, 16GB RAM, SSD 1TB, 16" 165Hz. Gaming Pro.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-16',
        nombre: 'HP Pavilion 15',
        categoria: 'Notebooks',
        marca: 'HP',
        memoria: '256GB',
        condicion: 'Nuevo',
        precio: 380000,
        precioAnterior: null,
        stock: 12,
        descripcion: 'Intel Core i5 11th Gen, 8GB RAM, SSD 256GB, 15.6" FHD.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.0,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    
    // ========== ACCESORIOS ==========
    {
        id: 'prod-17',
        nombre: 'AirPods Pro 2da Gen',
        categoria: 'Accesorios',
        marca: 'Apple',
        memoria: null,
        condicion: 'Nuevo',
        precio: 145000,
        precioAnterior: null,
        stock: 20,
        descripcion: 'Cancelación activa de ruido, Audio espacial, Estuche MagSafe, USB-C.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-18',
        nombre: 'Samsung Galaxy Buds2 Pro',
        categoria: 'Accesorios',
        marca: 'Samsung',
        memoria: null,
        condicion: 'Nuevo',
        precio: 85000,
        precioAnterior: null,
        stock: 15,
        descripcion: 'ANC inteligente, Audio 360, Resistencia al agua IPX7, Carga inalámbrica.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-19',
        nombre: 'Funda Spigen Ultra Hybrid',
        categoria: 'Accesorios',
        marca: 'Spigen',
        memoria: null,
        condicion: 'Nuevo',
        precio: 8500,
        precioAnterior: 12000,
        stock: 50,
        descripcion: 'Protección militar, Transparente, Anti-amarilleo, Compatible con MagSafe.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.2,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-20',
        nombre: 'Cargador Rápido 65W GaN',
        categoria: 'Accesorios',
        marca: 'Anker',
        memoria: null,
        condicion: 'Nuevo',
        precio: 28000,
        precioAnterior: null,
        stock: 30,
        descripcion: '3 puertos USB-C, Tecnología GaN, Compacto, Compatible con laptops y celulares.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.7,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-21',
        nombre: 'Apple Watch Series 9',
        categoria: 'Accesorios',
        marca: 'Apple',
        memoria: null,
        condicion: 'Nuevo',
        precio: 320000,
        precioAnterior: null,
        stock: 12,
        descripcion: 'GPS + Cellular, Pantalla Always-On, Sensor de temperatura, S9 SiP.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.9,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-22',
        nombre: 'Anker PowerBank 20000mAh',
        categoria: 'Accesorios',
        marca: 'Anker',
        memoria: null,
        condicion: 'Nuevo',
        precio: 45000,
        precioAnterior: null,
        stock: 25,
        descripcion: 'Carga rápida 30W, 2 puertos USB-C, Pantalla LED, Ultra compacto.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-23',
        nombre: 'Teclado Logitech MX Keys',
        categoria: 'Accesorios',
        marca: 'Logitech',
        memoria: null,
        condicion: 'Nuevo',
        precio: 68000,
        precioAnterior: null,
        stock: 18,
        descripcion: 'Mecánico, Retroiluminado, Multi-dispositivo, USB-C, Wireless.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.8,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-24',
        nombre: 'Mouse Logitech MX Master 3S',
        categoria: 'Accesorios',
        marca: 'Logitech',
        memoria: null,
        condicion: 'Nuevo',
        precio: 52000,
        precioAnterior: null,
        stock: 22,
        descripcion: 'Ergonómico, 8000 DPI, Silencioso, Multi-dispositivo, Carga USB-C.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.9,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-25',
        nombre: 'Auriculares Bluetooth Pro',
        categoria: 'Accesorios',
        marca: 'Sony',
        memoria: null,
        condicion: 'Nuevo',
        precio: 22000,
        precioAnterior: 40000,
        stock: 35,
        descripcion: 'Cancelación de ruido, 30h batería, Bluetooth 5.3, Sonido Hi-Fi.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.0,
        esNuevo: false,
        enOferta: true,
        activo: true
    },
    {
        id: 'prod-26',
        nombre: 'Pack 3 Fundas Premium',
        categoria: 'Accesorios',
        marca: 'Genérico',
        memoria: null,
        condicion: 'Nuevo',
        precio: 14000,
        precioAnterior: 20000,
        stock: 40,
        descripcion: '3 Fundas de silicona premium, colores variados, protección completa.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: false,
        enOferta: true,
        activo: true
    }
];

// Conectar a MongoDB y popular productos
async function inicializarProductos() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        
        // Verificar si ya hay productos
        const cantidadProductos = await Producto.countDocuments();
        
        if (cantidadProductos > 0) {
            console.log(`ℹ️  Ya existen ${cantidadProductos} productos en la base de datos`);
            console.log('💡 Si quieres reiniciar, elimina todos los productos primero');
            return;
        }
        
        console.log('📦 Insertando productos iniciales...');
        
        // Insertar productos
        const resultado = await Producto.insertMany(productosIniciales);
        
        console.log(`✅ ${resultado.length} productos insertados correctamente!`);
        console.log('\n📊 Resumen por categoría:');
        
        // Mostrar resumen
        const resumen = {};
        productosIniciales.forEach(p => {
            resumen[p.categoria] = (resumen[p.categoria] || 0) + 1;
        });
        
        Object.entries(resumen).forEach(([categoria, cantidad]) => {
            console.log(`   - ${categoria}: ${cantidad} productos`);
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar productos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión a MongoDB cerrada');
        process.exit(0);
    }
}

// Ejecutar
inicializarProductos();

