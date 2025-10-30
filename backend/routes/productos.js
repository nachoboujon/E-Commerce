/* =================================================================
   RUTAS DE PRODUCTOS
   ================================================================= */

const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const { cache, clearCacheByPattern } = require('../config/cache');
const logger = require('../config/logger');

// ============================================================
// OBTENER TODOS LOS PRODUCTOS (CON CACHÉ)
// ============================================================
router.get('/', async (req, res) => {
    try {
        const { categoria, busqueda, marca, memoria, condicion, soloActivos = 'true' } = req.query;
        
        // Crear clave de caché única basada en los parámetros
        const cacheKey = `productos_${soloActivos}_${categoria || 'all'}_${busqueda || ''}_${marca || ''}_${memoria || ''}_${condicion || ''}`;
        
        // Verificar caché
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            logger.debug(`✅ Cache HIT: ${cacheKey}`);
            return res.json({ ...cachedData, cached: true });
        }
        
        logger.debug(`❌ Cache MISS: ${cacheKey}`);
        
        let filtro = {};
        
        if (soloActivos === 'true') {
            filtro.activo = true;
        }
        
        if (categoria) {
            filtro.categoria = categoria;
        }
        
        if (marca) {
            filtro.marca = { $regex: marca, $options: 'i' };
        }
        
        if (memoria) {
            filtro.memoria = { $regex: memoria, $options: 'i' };
        }
        
        if (condicion) {
            filtro.condicion = condicion;
        }
        
        if (busqueda) {
            filtro.$or = [
                { nombre: { $regex: busqueda, $options: 'i' } },
                { descripcion: { $regex: busqueda, $options: 'i' } }
            ];
        }
        
        // Obtener productos con .lean() para mejor rendimiento
        const productos = await Producto
            .find(filtro)
            .sort({ stock: -1, fechaCreacion: -1 })
            .lean(); // Documentos planos, más rápido
        
        // Separar productos con y sin stock
        const conStock = productos.filter(p => p.stock > 0);
        const sinStock = productos.filter(p => p.stock === 0);
        
        const response = {
            success: true,
            count: productos.length,
            productos: [...conStock, ...sinStock],
            conStock: conStock.length,
            sinStock: sinStock.length,
            cached: false
        };
        
        // Guardar en caché por 10 minutos
        cache.set(cacheKey, response, 600);
        
        res.json(response);
        
    } catch (error) {
        logger.error('Error al obtener productos:', { error: error.message });
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
        
        // ✅ INVALIDAR CACHÉ
        const clearedKeys = clearCacheByPattern('productos');
        logger.info(`🧹 Caché invalidado al actualizar producto: ${clearedKeys} keys`);
        
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            producto
        });
        
    } catch (error) {
        logger.error('Error al actualizar producto:', { error: error.message });
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
        
        // ✅ INVALIDAR CACHÉ
        const clearedKeys = clearCacheByPattern('productos');
        logger.info(`🧹 Caché invalidado al eliminar producto: ${clearedKeys} keys`);
        
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
        
    } catch (error) {
        logger.error('Error al eliminar producto:', { error: error.message });
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
        
        // ✅ INVALIDAR CACHÉ
        const clearedKeys = clearCacheByPattern('productos');
        logger.info(`🧹 Caché invalidado al actualizar stock: ${clearedKeys} keys`);
        
        res.json({
            success: true,
            message: 'Stock actualizado exitosamente',
            producto
        });
        
    } catch (error) {
        logger.error('Error al actualizar stock:', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Error al actualizar stock',
            error: error.message
        });
    }
});

module.exports = router;

