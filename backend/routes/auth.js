/* =================================================================
   RUTAS DE AUTENTICACIÓN
   ================================================================= */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { verificarToken } = require('../middleware/auth');
const { 
    enviarEmailVerificacion, 
    generarCodigoVerificacion 
} = require('../services/emailService');

// ============================================================
// REGISTRO DE USUARIO
// ============================================================
router.post('/registro', async (req, res) => {
    try {
        const { username, password, email, nombre, telefono, direccion } = req.body;
        
        // Validar datos requeridos
        if (!username || !password || !email || !nombre) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos requeridos deben ser completados'
            });
        }
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            $or: [{ username }, { email }]
        });
        
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: usuarioExistente.username === username 
                    ? 'El nombre de usuario ya está en uso' 
                    : 'El email ya está registrado'
            });
        }
        
        // Generar código de verificación
        const codigoVerificacion = generarCodigoVerificacion();
        const codigoExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        
        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            username,
            password,
            email,
            nombre,
            telefono,
            direccion,
            rol: 'cliente',
            verificado: false, // Requiere verificación
            codigoVerificacion,
            codigoExpiracion
        });
        
        await nuevoUsuario.save();
        
        // Enviar email de verificación
        await enviarEmailVerificacion(nuevoUsuario, codigoVerificacion);
        
        // Generar token JWT
        const token = jwt.sign(
            { id: nuevoUsuario._id, username: nuevoUsuario.username, rol: nuevoUsuario.rol },
            process.env.JWT_SECRET || 'phonespot_secret_key_2025',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
            token,
            usuario: {
                id: nuevoUsuario._id,
                username: nuevoUsuario.username,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                rol: nuevoUsuario.rol,
                verificado: nuevoUsuario.verificado
            },
            requiereVerificacion: true
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// ============================================================
// LOGIN
// ============================================================
router.post('/login', async (req, res) => {
    try {
        const { identificador, password } = req.body;
        
        console.log('🔐 LOGIN REQUEST:');
        console.log('   Identificador:', identificador);
        console.log('   Password recibido:', password ? '✅ Presente' : '❌ Vacío');
        
        if (!identificador || !password) {
            console.log('❌ Faltan credenciales');
            return res.status(400).json({
                success: false,
                message: 'Usuario/Email y contraseña son requeridos'
            });
        }
        
        // Buscar usuario por username o email
        console.log('🔍 Buscando usuario en MongoDB...');
        const usuario = await Usuario.findOne({
            $or: [{ username: identificador }, { email: identificador }]
        });
        
        if (!usuario) {
            console.log('❌ Usuario NO encontrado');
            console.log('   Buscando por:', identificador);
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
        
        console.log('✅ Usuario encontrado:');
        console.log('   Username:', usuario.username);
        console.log('   Email:', usuario.email);
        console.log('   Rol:', usuario.rol);
        console.log('   Password hash:', usuario.password ? usuario.password.substring(0, 20) + '...' : 'NO HAY');
        
        // Verificar contraseña
        console.log('🔐 Verificando contraseña con bcrypt...');
        console.log('   Password ingresado:', password);
        console.log('   Hash en BD:', usuario.password ? 'Presente' : 'NO HAY');
        
        const passwordValida = await usuario.compararPassword(password);
        
        console.log('📊 Resultado comparación:', passwordValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
        
        if (!passwordValida) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
        
        // Verificar si está activo
        if (!usuario.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo. Contacta al administrador'
            });
        }
        
        // Actualizar último acceso
        usuario.ultimoAcceso = new Date();
        await usuario.save();
        
        // Generar token JWT
        console.log('🔑 Generando token JWT...');
        console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado ✅' : 'Usando default');
        
        const token = jwt.sign(
            { id: usuario._id, username: usuario.username, rol: usuario.rol },
            process.env.JWT_SECRET || 'phonespot_secret_key_2025',
            { expiresIn: '7d' }
        );
        
        console.log('✅ Token generado:', token ? token.substring(0, 30) + '...' : 'NULL');
        console.log('📏 Longitud token:', token ? token.length : 0);
        
        const respuesta = {
            success: true,
            message: 'Login exitoso',
            token,
            sesion: {
                id: usuario._id,
                username: usuario.username,
                email: usuario.email,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                rol: usuario.rol,
                verificado: usuario.verificado,
                fechaRegistro: usuario.fechaRegistro
            }
        };
        
        console.log('📤 Enviando respuesta exitosa al cliente');
        console.log('   success:', respuesta.success);
        console.log('   token presente:', !!respuesta.token);
        console.log('   sesion.rol:', respuesta.sesion.rol);
        
        res.json(respuesta);
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
});

// ============================================================
// OBTENER PERFIL (requiere autenticación)
// ============================================================
router.get('/perfil', verificarToken, async (req, res) => {
    try {
        res.json({
            success: true,
            usuario: {
                id: req.usuario._id,
                username: req.usuario.username,
                email: req.usuario.email,
                nombre: req.usuario.nombre,
                telefono: req.usuario.telefono,
                direccion: req.usuario.direccion,
                rol: req.usuario.rol,
                verificado: req.usuario.verificado,
                fechaRegistro: req.usuario.fechaRegistro
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
});

// ============================================================
// ACTUALIZAR PERFIL
// ============================================================
router.put('/perfil', verificarToken, async (req, res) => {
    try {
        const { nombre, email, telefono, direccion } = req.body;
        
        const usuario = await Usuario.findById(req.usuario._id);
        
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
        
        await usuario.save();
        
        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
            usuario: {
                id: usuario._id,
                username: usuario.username,
                email: usuario.email,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                rol: usuario.rol
            }
        });
        
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
});

// ============================================================
// CAMBIAR CONTRASEÑA
// ============================================================
router.put('/cambiar-password', verificarToken, async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;
        
        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere la contraseña actual y la nueva'
            });
        }
        
        const usuario = await Usuario.findById(req.usuario._id);
        
        // Verificar contraseña actual
        const passwordValida = await usuario.compararPassword(passwordActual);
        
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }
        
        // Cambiar contraseña
        usuario.password = passwordNueva;
        await usuario.save();
        
        res.json({
            success: true,
            message: 'Contraseña cambiada exitosamente'
        });
        
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
});

// ============================================================
// VERIFICAR EMAIL CON CÓDIGO
// ============================================================
router.post('/verificar-email', verificarToken, async (req, res) => {
    try {
        const { codigo } = req.body;
        
        if (!codigo) {
            return res.status(400).json({
                success: false,
                message: 'El código de verificación es requerido'
            });
        }
        
        const usuario = await Usuario.findById(req.usuario._id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        if (usuario.verificado) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya está verificado'
            });
        }
        
        // Verificar si el código expiró
        if (new Date() > usuario.codigoExpiracion) {
            return res.status(400).json({
                success: false,
                message: 'El código de verificación ha expirado. Solicita uno nuevo.'
            });
        }
        
        // Verificar el código
        if (usuario.codigoVerificacion !== codigo) {
            return res.status(400).json({
                success: false,
                message: 'Código de verificación incorrecto'
            });
        }
        
        // Marcar como verificado
        usuario.verificado = true;
        usuario.codigoVerificacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();
        
        res.json({
            success: true,
            message: '¡Email verificado exitosamente!'
        });
        
    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar email',
            error: error.message
        });
    }
});

// ============================================================
// REENVIAR CÓDIGO DE VERIFICACIÓN
// ============================================================
router.post('/reenviar-codigo', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        if (usuario.verificado) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya está verificado'
            });
        }
        
        // Generar nuevo código
        const nuevoCodigoVerificacion = generarCodigoVerificacion();
        const nuevaExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        usuario.codigoVerificacion = nuevoCodigoVerificacion;
        usuario.codigoExpiracion = nuevaExpiracion;
        await usuario.save();
        
        // Enviar email
        await enviarEmailVerificacion(usuario, nuevoCodigoVerificacion);
        
        res.json({
            success: true,
            message: 'Código de verificación reenviado a tu email'
        });
        
    } catch (error) {
        console.error('Error al reenviar código:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reenviar código',
            error: error.message
        });
    }
});

// ============================================================
// DIAGNÓSTICO JWT (solo para debugging)
// ============================================================
router.get('/diagnostico-jwt', (req, res) => {
    const jwtSecret = process.env.JWT_SECRET;
    const defaultSecret = 'phonespot_secret_key_2025';
    
    res.json({
        success: true,
        diagnostico: {
            JWT_SECRET_configurado: !!jwtSecret,
            usando_default: !jwtSecret,
            secret_actual: jwtSecret ? 'Configurado ✅' : `Default (${defaultSecret})`,
            coincide_con_esperado: jwtSecret === defaultSecret,
            NODE_ENV: process.env.NODE_ENV || 'no configurado',
            timestamp: new Date().toISOString()
        },
        recomendacion: !jwtSecret || jwtSecret !== defaultSecret 
            ? `⚠️ Configura JWT_SECRET=${defaultSecret} en Railway` 
            : '✅ JWT_SECRET correcto'
    });
});

// ============================================================
// CREAR ADMIN (ENDPOINT TEMPORAL - SOLO PARA SETUP INICIAL)
// ============================================================
router.post('/crear-admin-inicial', async (req, res) => {
    try {
        console.log('🔧 Creando usuario admin inicial...');
        
        // Verificar si ya existe
        const adminExistente = await Usuario.findOne({ email: 'nboujon7@gmail.com' });
        
        if (adminExistente) {
            console.log('⚠️ Admin ya existe, eliminando para recrear...');
            await Usuario.deleteOne({ email: 'nboujon7@gmail.com' });
        }
        
        // Crear nuevo admin
        const adminData = {
            username: 'admin',
            password: 'Nacho2005', // Se hasheará automáticamente
            email: 'nboujon7@gmail.com',
            nombre: 'Nacho Boujon',
            telefono: '1234567890',
            direccion: 'Buenos Aires, Argentina',
            rol: 'administrador',
            verificado: true,
            activo: true,
            fechaRegistro: new Date()
        };
        
        const nuevoAdmin = new Usuario(adminData);
        await nuevoAdmin.save();
        
        console.log('✅ Admin creado exitosamente');
        console.log('   Username:', nuevoAdmin.username);
        console.log('   Email:', nuevoAdmin.email);
        console.log('   Rol:', nuevoAdmin.rol);
        
        res.json({
            success: true,
            message: 'Usuario admin creado exitosamente',
            admin: {
                username: nuevoAdmin.username,
                email: nuevoAdmin.email,
                rol: nuevoAdmin.rol,
                verificado: nuevoAdmin.verificado,
                activo: nuevoAdmin.activo
            },
            instrucciones: {
                email: 'nboujon7@gmail.com',
                password: 'Nacho2005',
                siguiente_paso: 'Ahora puedes iniciar sesión con estas credenciales'
            }
        });
        
    } catch (error) {
        console.error('❌ Error creando admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario admin',
            error: error.message
        });
    }
});

module.exports = router;

