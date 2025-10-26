/* =================================================================
   RUTAS DE USUARIOS (solo admin)
   ================================================================= */

const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// ============================================================
// OBTENER TODOS LOS USUARIOS (solo admin)
// ============================================================
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { rol, activo } = req.query;
        
        let filtro = {};
        if (rol) filtro.rol = rol;
        if (activo !== undefined) filtro.activo = activo === 'true';
        
        const usuarios = await Usuario.find(filtro)
            .select('-password')
            .sort({ fechaRegistro: -1 });
        
        res.json({
            success: true,
            count: usuarios.length,
            usuarios
        });
        
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER USUARIO POR ID (solo admin)
// ============================================================
router.get('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.json({
            success: true,
            usuario
        });
        
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
});

// ============================================================
// ACTUALIZAR USUARIO (solo admin)
// ============================================================
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { nombre, email, telefono, direccion, rol, activo, verificado } = req.body;
        
        const usuario = await Usuario.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Actualizar campos
        if (nombre) usuario.nombre = nombre;
        if (email) usuario.email = email;
        if (telefono) usuario.telefono = telefono;
        if (direccion) usuario.direccion = direccion;
        if (rol) usuario.rol = rol;
        if (activo !== undefined) usuario.activo = activo;
        if (verificado !== undefined) usuario.verificado = verificado;
        
        await usuario.save();
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario
        });
        
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});

// ============================================================
// ELIMINAR USUARIO (solo admin)
// ============================================================
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Prevenir eliminación del propio admin
        if (usuario._id.toString() === req.usuario._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }
        
        // Soft delete
        usuario.activo = false;
        await usuario.save();
        
        res.json({
            success: true,
            message: 'Usuario desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});

// ============================================================
// ESTADÍSTICAS DE USUARIOS (solo admin)
// ============================================================
router.get('/admin/estadisticas', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const totalUsuarios = await Usuario.countDocuments();
        const usuariosActivos = await Usuario.countDocuments({ activo: true });
        const clientes = await Usuario.countDocuments({ rol: 'cliente' });
        const administradores = await Usuario.countDocuments({ rol: 'administrador' });
        
        res.json({
            success: true,
            estadisticas: {
                totalUsuarios,
                usuariosActivos,
                clientes,
                administradores
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

