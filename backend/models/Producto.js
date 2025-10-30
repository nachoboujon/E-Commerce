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
    bateria: {
        type: String,
        trim: true,
        default: null
    },
    esAmericano: {
        type: Boolean,
        default: false
    },
    // Campos adicionales para variantes
    colores: {
        type: [String],
        default: []
    },
    memorias: {
        type: [String],
        default: []
    },
    variantes: [{
        color: {
            type: String,
            trim: true
        },
        memoria: {
            type: String,
            trim: true
        },
        bateria: {
            type: String,
            trim: true
        },
        precio: {
            type: Number,
            min: 0
        },
        stock: {
            type: Number,
            min: 0,
            default: 0
        }
    }],
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

// ============================================================
// ÍNDICES OPTIMIZADOS PARA BÚSQUEDAS RÁPIDAS
// ============================================================

// Índice compuesto para listados principales
productoSchema.index({ categoria: 1, activo: 1, stock: -1 });

// Índice para ID (búsquedas individuales)
productoSchema.index({ id: 1 }, { unique: true });

// Índice de texto para búsqueda
productoSchema.index({ nombre: 'text', descripcion: 'text', marca: 'text' });

// Índice para ordenamiento por fecha
productoSchema.index({ createdAt: -1 });

// Índice para filtros comunes
productoSchema.index({ marca: 1, categoria: 1 });
productoSchema.index({ precio: 1 });
productoSchema.index({ enOferta: 1, activo: 1 });
productoSchema.index({ esNuevo: 1, activo: 1 });

// ============================================================
// VIRTUALES
// ============================================================

// Virtual para verificar disponibilidad
productoSchema.virtual('disponible').get(function() {
    return this.activo && this.stock > 0;
});

productoSchema.virtual('descuento').get(function() {
    if (!this.precioAnterior || this.precioAnterior <= this.precio) return 0;
    return Math.round(((this.precioAnterior - this.precio) / this.precioAnterior) * 100);
});

// ============================================================
// HOOKS
// ============================================================

// Pre-save validations
productoSchema.pre('save', function(next) {
    // Validar que precio anterior sea mayor que precio en ofertas
    if (this.enOferta && this.precioAnterior) {
        if (this.precioAnterior <= this.precio) {
            return next(new Error('Precio anterior debe ser mayor al precio actual en ofertas'));
        }
    }
    
    // Asegurar que stock no sea negativo
    if (this.stock < 0) {
        this.stock = 0;
    }
    
    next();
});

module.exports = mongoose.model('Producto', productoSchema);

