/* =================================================================
   CARGAR PRODUCTOS A MONGODB ATLAS (NUBE)
   ================================================================= */

const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
    console.log('\n========================================');
    console.log('  CARGAR PRODUCTOS A MONGODB ATLAS');
    console.log('========================================\n');
    
    rl.question('Pega aquí tu URL de MongoDB Atlas:\n', async (MONGODB_URI) => {
        if (!MONGODB_URI || MONGODB_URI.trim() === '') {
            console.log('❌ URL vacía. Abortando.');
            process.exit(1);
        }
        
        try {
            console.log('\n🔌 Conectando a MongoDB Atlas...');
            await mongoose.connect(MONGODB_URI.trim());
            console.log('✅ Conectado correctamente\n');
            
            // Verificar productos existentes
            const cantidadExistente = await Producto.countDocuments();
            console.log(`📦 Productos actuales en la base de datos: ${cantidadExistente}\n`);
            
            if (cantidadExistente > 0) {
                console.log('⚠️  Ya hay productos en la base de datos.');
                console.log('   Si continúas, se agregarán MÁS productos.\n');
            }
            
            // Insertar productos
            console.log(`📦 Insertando ${productosIniciales.length} productos...`);
            const resultado = await Producto.insertMany(productosIniciales);
            
            console.log(`\n✅ ${resultado.length} productos insertados correctamente!\n`);
            
            const totalAhora = await Producto.countDocuments();
            console.log(`📊 Total de productos en la base de datos: ${totalAhora}\n`);
            
            console.log('========================================');
            console.log('  ¡COMPLETADO!');
            console.log('========================================\n');
            console.log('Ahora tus productos están en la nube y');
            console.log('aparecerán automáticamente en tu tienda.\n');
            
        } catch (error) {
            console.error('\n❌ Error:', error.message);
        } finally {
            await mongoose.connection.close();
            process.exit(0);
        }
    });
}

cargarProductos();

