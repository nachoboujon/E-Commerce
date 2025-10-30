/* =================================================================
   MIDDLEWARE DE AUTENTICACIÓN
   ================================================================= */

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const logger = require('../config/logger');

// Verificar token JWT
exports.verificarToken = async (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }
        
        // Verificar token (JWT_SECRET ya validado en server.js)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuario
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        if (!usuario.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }
        
        // Agregar usuario al request
        req.usuario = usuario;
        next();
        
    } catch (error) {
        logger.error('❌ Error en verificación de token:', {
            message: error.message,
            name: error.name,
            path: req.path
        });
        
        let mensaje = 'Token inválido o expirado';
        if (error.name === 'JsonWebTokenError') {
            mensaje = 'Token inválido - JWT_SECRET no coincide';
            logger.warn('🔑 Token con JWT_SECRET incorrecto');
        } else if (error.name === 'TokenExpiredError') {
            mensaje = 'Token expirado - inicie sesión nuevamente';
            logger.info('⏰ Token expirado para usuario');
        }
        
        return res.status(401).json({
            success: false,
            message: mensaje,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verificar rol de administrador
exports.verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'administrador') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Requiere permisos de administrador'
        });
    }
    next();
};

