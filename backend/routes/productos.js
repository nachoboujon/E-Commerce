/* =================================================================
   RUTAS DE PRODUCTOS
   ================================================================= */

const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// ============================================================
// OBTENER TODOS LOS PRODUCTOS
// ============================================================
router.get('/', async (req, res) => {
    try {
        const { categoria, busqueda, marca, memoria, condicion, soloActivos = 'true' } = req.query;
        
        let filtro = {};
        
        if (soloActivos === 'true') {
            filtro.activo = true;
        }
        
        if (categoria) {
            filtro.categoria = categoria;
        }
        
        // Filtro por marca
        if (marca) {
            filtro.marca = { $regex: marca, $options: 'i' };
        }
        
        // Filtro por memoria
        if (memoria) {
            filtro.memoria = { $regex: memoria, $options: 'i' };
        }
        
        // Filtro por condición
        if (condicion) {
            filtro.condicion = condicion;
        }
        
        if (busqueda) {
            filtro.$or = [
                { nombre: { $regex: busqueda, $options: 'i' } },
                { descripcion: { $regex: busqueda, $options: 'i' } }
            ];
        }
        
        // Obtener productos y ordenar: primero con stock > 0, luego sin stock
        const productos = await Producto.find(filtro).sort({ 
            stock: -1,  // Primero los que tienen stock
            fechaCreacion: -1 
        });
        
        // Separar productos con y sin stock
        const conStock = productos.filter(p => p.stock > 0);
        const sinStock = productos.filter(p => p.stock === 0);
        
        res.json({
            success: true,
            count: productos.length,
            productos: [...conStock, ...sinStock], // Sin stock al final
            conStock: conStock.length,
            sinStock: sinStock.length
        });
        
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER PRODUCTO POR ID
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findOne({ id: req.params.id });
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            producto
        });
        
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
});

// ============================================================
// CREAR PRODUCTO (solo admin)
// ============================================================
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const productoData = req.body;
        
        // Generar ID único si no se proporciona
        if (!productoData.id) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            productoData.id = `prod-${timestamp}-${random}`;
        }
        
        const nuevoProducto = new Producto(productoData);
        await nuevoProducto.save();
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            producto: nuevoProducto
        });
        
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
});

// ============================================================
// ACTUALIZAR PRODUCTO (solo admin)
// ============================================================
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findOne({ id: req.params.id });
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        // Actualizar campos
        Object.assign(producto, req.body);
        await producto.save();
        
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            producto
        });
        
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
});

// ============================================================
// ELIMINAR PRODUCTO (solo admin)
// ============================================================
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findOne({ id: req.params.id });
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        // Soft delete - solo marcar como inactivo
        producto.activo = false;
        await producto.save();
        
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
});

// ============================================================
// ACTUALIZAR STOCK (solo admin)
// ============================================================
router.patch('/:id/stock', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock inválido'
            });
        }
        
        const producto = await Producto.findOne({ id: req.params.id });
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        producto.stock = stock;
        await producto.save();
        
        res.json({
            success: true,
            message: 'Stock actualizado exitosamente',
            producto
        });
        
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar stock',
            error: error.message
        });
    }
});

module.exports = router;

