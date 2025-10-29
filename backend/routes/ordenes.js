/* =================================================================
   RUTAS DE ÓRDENES/COMPRAS
   ================================================================= */

const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const { 
    enviarEmailConfirmacionCompra, 
    enviarEmailNotificacionAdmin 
} = require('../services/emailService');

// ============================================================
// CREAR ORDEN (requiere autenticación)
// ============================================================
router.post('/', verificarToken, async (req, res) => {
    try {
        const { productos, metodoPago, metodoEnvio, costoEnvio, direccionEnvio, notas, cargoMayorista } = req.body;
        
        if (!productos || productos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay productos en la orden'
            });
        }
        
        console.log('📦 Procesando orden con productos:', productos);
        console.log('💰 Cargo mayorista:', cargoMayorista || 0);
        
        // Validar stock y calcular totales
        let subtotal = 0;
        const productosValidados = [];
        
        for (const item of productos) {
            const producto = await Producto.findOne({ id: item.productoId });
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: `Producto ${item.productoId} no encontrado`
                });
            }
            
            if (producto.stock < item.cantidad) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`
                });
            }
            
            // ✨ USAR PRECIO UNITARIO ENVIADO DESDE EL FRONTEND (incluye cargo mayorista)
            const precioFinal = item.precioUnitario || producto.precio;
            const subtotalItem = precioFinal * item.cantidad;
            subtotal += subtotalItem;
            
            console.log(`📱 ${producto.nombre} - Precio: $${precioFinal} (original: $${producto.precio}) | Color: ${item.color || 'N/A'} | Memoria: ${item.memoria || 'N/A'}`);
            
            productosValidados.push({
                productoId: item.productoId,
                nombre: producto.nombre,
                precio: precioFinal, // ✅ Usar precio con cargo mayorista incluido
                cantidad: item.cantidad,
                subtotal: subtotalItem,
                // Incluir variantes si vienen del carrito (color, memoria, etc.)
                color: item.color || null,
                memoria: item.memoria || null
            });
            
            // ✅ REDUCIR STOCK AL FINALIZAR LA COMPRA (crear orden)
            producto.stock -= item.cantidad;
            await producto.save();
            console.log(`📦 Stock reducido: ${producto.nombre} - Cantidad: ${item.cantidad} - Stock restante: ${producto.stock}`);
        }
        
        // Calcular envío y total
        const envio = costoEnvio || 0; // ✅ Costo de envío según método seleccionado
        const descuento = 0;
        const total = subtotal + envio - descuento;
        
        // Crear orden
        const nuevaOrden = new Orden({
            usuario: req.usuario._id,
            productos: productosValidados,
            subtotal,
            envio,
            descuento,
            total,
            metodoPago: metodoPago || 'pendiente',
            metodoEnvio: metodoEnvio || 'retiro',
            costoEnvio: costoEnvio || 0,
            direccionEnvio: direccionEnvio || 'Retiro en tienda',
            datosContacto: {
                nombre: req.usuario.nombre,
                email: req.usuario.email,
                telefono: req.usuario.telefono,
                direccion: req.usuario.direccion
            },
            notas
        });
        
        await nuevaOrden.save();
        
        // Enviar emails de confirmación
        try {
            // Email al cliente
            await enviarEmailConfirmacionCompra(nuevaOrden, req.usuario);
            
            // Email al administrador
            await enviarEmailNotificacionAdmin(nuevaOrden, req.usuario);
        } catch (emailError) {
            console.error('Error al enviar emails:', emailError);
            // No fallar la orden si el email falla
        }
        
        res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente. Recibirás un email de confirmación.',
            orden: nuevaOrden
        });
        
    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear orden',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER ÓRDENES DEL USUARIO
// ============================================================
router.get('/mis-ordenes', verificarToken, async (req, res) => {
    try {
        const ordenes = await Orden.find({ usuario: req.usuario._id })
            .sort({ fechaOrden: -1 })
            .populate('usuario', 'nombre email');
        
        res.json({
            success: true,
            count: ordenes.length,
            ordenes
        });
        
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener órdenes',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER TODAS LAS ÓRDENES (solo admin)
// ============================================================
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado, limite = 100 } = req.query;
        
        let filtro = {};
        if (estado) {
            filtro.estado = estado;
        }
        
        const ordenes = await Orden.find(filtro)
            .sort({ fechaOrden: -1 })
            .limit(parseInt(limite))
            .populate('usuario', 'nombre email telefono');
        
        res.json({
            success: true,
            count: ordenes.length,
            ordenes
        });
        
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener órdenes',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER ORDEN POR ID
// ============================================================
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.id)
            .populate('usuario', 'nombre email telefono direccion');
        
        if (!orden) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        
        // Verificar que el usuario sea el dueño o admin
        if (orden.usuario._id.toString() !== req.usuario._id.toString() && 
            req.usuario.rol !== 'administrador') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta orden'
            });
        }
        
        res.json({
            success: true,
            orden
        });
        
    } catch (error) {
        console.error('Error al obtener orden:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener orden',
            error: error.message
        });
    }
});

// ============================================================
// ACTUALIZAR ESTADO DE ORDEN (solo admin)
// ============================================================
router.patch('/:id/estado', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        
        const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido'
            });
        }
        
        const orden = await Orden.findById(req.params.id);
        
        if (!orden) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        
        const estadoAnterior = orden.estado;
        
        // ✅ DEVOLVER STOCK SI SE CANCELA LA ORDEN
        // (El stock ya se redujo al crear la orden, solo necesitamos devolverlo si se cancela)
        if (estado === 'cancelado' && estadoAnterior !== 'cancelado') {
            console.log('❌ Orden cancelada - Devolviendo stock de productos...');
            
            for (const item of orden.productos) {
                const producto = await Producto.findOne({ id: item.productoId });
                
                if (producto) {
                    producto.stock += item.cantidad;
                    await producto.save();
                    console.log(`↩️ Stock devuelto: ${producto.nombre} - Cantidad: ${item.cantidad} - Stock actual: ${producto.stock}`);
                }
            }
        }
        
        orden.estado = estado;
        orden.fechaActualizacion = new Date();
        await orden.save();
        
        res.json({
            success: true,
            message: 'Estado actualizado exitosamente',
            orden
        });
        
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado',
            error: error.message
        });
    }
});

// ============================================================
// ESTADÍSTICAS DE VENTAS (solo admin)
// ============================================================
router.get('/admin/estadisticas', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const totalOrdenes = await Orden.countDocuments();
        const ordenesPendientes = await Orden.countDocuments({ estado: 'pendiente' });
        const ordenesEntregadas = await Orden.countDocuments({ estado: 'entregado' });
        
        const ventasTotales = await Orden.aggregate([
            { $match: { estado: { $ne: 'cancelado' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        
        const ventasMensuales = await Orden.aggregate([
            {
                $match: {
                    estado: { $ne: 'cancelado' },
                    fechaOrden: { 
                        $gte: new Date(new Date().setDate(1))
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        
        res.json({
            success: true,
            estadisticas: {
                totalOrdenes,
                ordenesPendientes,
                ordenesEntregadas,
                ventasTotales: ventasTotales[0]?.total || 0,
                ventasMensuales: ventasMensuales[0]?.total || 0
            }
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
});

module.exports = router;

