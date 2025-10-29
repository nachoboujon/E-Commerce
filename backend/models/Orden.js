/* =================================================================
   MODELO DE ORDEN/COMPRA - MONGODB
   ================================================================= */

const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    numeroOrden: {
        type: String,
        required: true,
        unique: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        productoId: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true
        },
        // Variantes del producto (opcionales)
        color: {
            type: String,
            default: null
        },
        memoria: {
            type: String,
            default: null
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    envio: {
        type: Number,
        default: 0,
        min: 0
    },
    descuento: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'usdt', 'pendiente'],
        default: 'pendiente'
    },
    // ✅ INFORMACIÓN DE ENVÍO
    metodoEnvio: {
        type: String,
        enum: ['retiro', 'envio', 'envio-10km', 'envio-40km'], // 'envio' es genérico (cálculo dinámico)
        default: 'retiro'
    },
    costoEnvio: {
        type: Number,
        default: 0,
        min: 0
    },
    direccionEnvio: {
        type: String,
        trim: true
    },
    datosContacto: {
        nombre: String,
        email: String,
        telefono: String,
        direccion: String
    },
    notas: {
        type: String,
        trim: true
    },
    fechaOrden: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date
    }
}, {
    timestamps: true
});

// Índices
ordenSchema.index({ usuario: 1, fechaOrden: -1 });
ordenSchema.index({ numeroOrden: 1 });
ordenSchema.index({ estado: 1 });

// Generar número de orden automáticamente
ordenSchema.pre('save', async function(next) {
    if (this.isNew && !this.numeroOrden) {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const contador = await mongoose.model('Orden').countDocuments();
        this.numeroOrden = `ORD-${año}${mes}${dia}-${String(contador + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Orden', ordenSchema);

