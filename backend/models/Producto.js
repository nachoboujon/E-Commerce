/* =================================================================
   MODELO DE PRODUCTO - MONGODB
   ================================================================= */

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Celulares', 'Tablets', 'Notebooks', 'Accesorios']
    },
    marca: {
        type: String,
        trim: true
    },
    memoria: {
        type: String,
        trim: true
    },
    condicion: {
        type: String,
        enum: ['Nuevo', 'Americano'],
        default: 'Nuevo'
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    precioAnterior: {
        type: Number,
        min: [0, 'El precio anterior no puede ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    descripcion: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    imagen: {
        type: String,
        required: false,
        default: '/IMG/producto-default.png'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    esNuevo: {
        type: Boolean,
        default: false
    },
    enOferta: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para búsquedas rápidas
productoSchema.index({ categoria: 1, activo: 1 });
productoSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Producto', productoSchema);

