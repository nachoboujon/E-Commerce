/* =================================================================
   CARGAR PRODUCTOS A MONGODB ATLAS - AUTOMÁTICO
   ================================================================= */

const mongoose = require('mongoose');

// URL de MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://nachoboujon:Nacho2005@cluster0.bhl5wo4.mongodb.net/phonespot_db?appName=Cluster0';

// Productos a cargar
const productosIniciales = [
    // ========== CELULARES ==========
    {
        id: 'prod-1',
        nombre: 'Samsung Galaxy S24 Ultra',
        categoria: 'Celulares',
        marca: 'Samsung',
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
        precio: 349,
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
        precio: 450000,
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
        precio: 380000,
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
        precio: 320000,
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
        precio: 850000,
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
        precio: 420000,
        stock: 8,
        descripcion: 'Snapdragon 8 Gen 2, Dynamic AMOLED 11", 8GB RAM, S Pen incluido.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.6,
        esNuevo: false,
        enOferta: false,
        activo: true
    },
    
    // ========== ACCESORIOS ==========
    {
        id: 'prod-9',
        nombre: 'AirPods Pro 2da Gen',
        categoria: 'Accesorios',
        marca: 'Apple',
        precio: 145000,
        stock: 20,
        descripcion: 'Cancelación activa de ruido, Audio espacial, Estuche MagSafe, USB-C.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 5.0,
        esNuevo: true,
        enOferta: false,
        activo: true
    },
    {
        id: 'prod-10',
        nombre: 'Samsung Galaxy Buds2 Pro',
        categoria: 'Accesorios',
        marca: 'Samsung',
        precio: 85000,
        stock: 15,
        descripcion: 'ANC inteligente, Audio 360, Resistencia al agua IPX7, Carga inalámbrica.',
        imagen: 'IMG/Note 14 Pro.png',
        rating: 4.5,
        esNuevo: false,
        enOferta: false,
        activo: true
    }
];

// Schema de Producto
const productoSchema = new mongoose.Schema({
    id: String,
    nombre: String,
    categoria: String,
    marca: String,
    precio: Number,
    precioAnterior: Number,
    stock: Number,
    descripcion: String,
    imagen: String,
    rating: Number,
    esNuevo: Boolean,
    enOferta: Boolean,
    activo: Boolean
}, { collection: 'productos' });

const Producto = mongoose.model('Producto', productoSchema);

async function cargarProductos() {
    try {
        console.log('\n========================================');
        console.log('  CARGAR PRODUCTOS A MONGODB ATLAS');
        console.log('========================================\n');
        
        console.log('🔌 Conectando a MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado correctamente\n');
        
        // Verificar productos existentes
        const cantidadExistente = await Producto.countDocuments();
        console.log(`📦 Productos actuales en la base de datos: ${cantidadExistente}\n`);
        
        if (cantidadExistente > 0) {
            console.log('⚠️  Ya hay productos en la base de datos.');
            console.log('   Eliminando productos anteriores...\n');
            await Producto.deleteMany({});
            console.log('✅ Productos anteriores eliminados\n');
        }
        
        // Insertar productos
        console.log(`📦 Insertando ${productosIniciales.length} productos...`);
        const resultado = await Producto.insertMany(productosIniciales);
        
        console.log(`\n✅ ${resultado.length} productos insertados correctamente!\n`);
        
        // Mostrar resumen por categoría
        const resumen = {};
        productosIniciales.forEach(p => {
            resumen[p.categoria] = (resumen[p.categoria] || 0) + 1;
        });
        
        console.log('📊 Resumen por categoría:');
        Object.entries(resumen).forEach(([categoria, cantidad]) => {
            console.log(`   - ${categoria}: ${cantidad} productos`);
        });
        
        console.log('\n========================================');
        console.log('  ✅ ¡COMPLETADO!');
        console.log('========================================\n');
        console.log('Tus productos están en la nube y aparecerán');
        console.log('automáticamente en tu tienda.\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nDetalles:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada\n');
        process.exit(0);
    }
}

cargarProductos();

