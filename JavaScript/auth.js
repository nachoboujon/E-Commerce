/* =================================================================
   SISTEMA DE AUTENTICACIÓN - PHONESPOT
   ================================================================= */

// Usuarios predeterminados del sistema (SOLO ADMINISTRADOR)
const USUARIOS_PREDETERMINADOS = {
    admin: {
        username: 'admin',
        password: 'Nacho2005',
        rol: 'administrador',
        nombre: 'Nacho Boujon',
        email: 'nboujon7@gmail.com',
        telefono: '3447 416011',
        direccion: 'Moreno 840, San José, Entre Ríos',
        fechaRegistro: '2025-01-01T00:00:00.000Z',
        verificado: true
    }
    // Los clientes deben registrarse a través del formulario de registro
};

// ============================================================
// GESTIÓN DE USUARIOS EN LOCALSTORAGE
// ============================================================

/**
 * Obtener todos los usuarios (predeterminados + registrados)
 * @returns {Object} - Objeto con todos los usuarios
 */
function obtenerTodosLosUsuarios() {
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '{}');
    return { ...USUARIOS_PREDETERMINADOS, ...usuariosRegistrados };
}

/**
 * Guardar usuario registrado en localStorage
 * @param {Object} usuario - Datos del usuario
 */
function guardarUsuarioRegistrado(usuario) {
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '{}');
    usuariosRegistrados[usuario.username] = usuario;
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
}

/**
 * Buscar usuario por username o email
 * @param {string} identificador - Username o email
 * @returns {Object|null} - Usuario encontrado o null
 */
function buscarUsuario(identificador) {
    const usuarios = obtenerTodosLosUsuarios();
    
    // Buscar por username
    if (usuarios[identificador]) {
        return usuarios[identificador];
    }
    
    // Buscar por email
    for (const username in usuarios) {
        if (usuarios[username].email === identificador) {
            return usuarios[username];
        }
    }
    
    return null;
}

// ============================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================

/**
 * Iniciar sesión
 * @param {string} identificador - Nombre de usuario o email
 * @param {string} password - Contraseña
 * @returns {Object} - Resultado del login con success, sesion o message
 */
function login(identificador, password) {
    const usuario = buscarUsuario(identificador);
    
    if (!usuario) {
        return { success: false, message: 'Usuario no encontrado' };
    }
    
    if (usuario.password !== password) {
        return { success: false, message: 'Contraseña incorrecta' };
    }
    
    // Verificar si el usuario está verificado (solo para usuarios registrados, no predeterminados)
    if (usuario.verificado === false && !USUARIOS_PREDETERMINADOS[usuario.username]) {
        return { 
            success: false, 
            message: 'Debes verificar tu email antes de iniciar sesión',
            requiresVerification: true,
            email: usuario.email
        };
    }
    
    // Guardar sesión en localStorage
    const sesion = {
        username: usuario.username,
        rol: usuario.rol,
        nombre: usuario.nombre,
        email: usuario.email,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('sesionPhoneSpot', JSON.stringify(sesion));
    return { success: true, sesion: sesion };
}

/**
 * Cerrar sesión
 */
function logout() {
    localStorage.removeItem('sesionPhoneSpot');
    // Verificar si estamos en la raíz o en una subcarpeta
    if (window.location.pathname.includes('/HTML/')) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'HTML/login.html';
    }
}

/**
 * Obtener sesión actual
 * @returns {Object|null} - Objeto de sesión o null
 */
function obtenerSesion() {
    const sesionStr = localStorage.getItem('sesionPhoneSpot');
    if (sesionStr) {
        return JSON.parse(sesionStr);
    }
    return null;
}

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
function estaAutenticado() {
    return obtenerSesion() !== null;
}

/**
 * Verificar si el usuario es administrador
 * @returns {boolean}
 */
function esAdministrador() {
    const sesion = obtenerSesion();
    return sesion && sesion.rol === 'administrador';
}

/**
 * Proteger página (requiere autenticación)
 */
function protegerPagina() {
    if (!estaAutenticado()) {
        // Si estamos en HTML/, el login está en la misma carpeta
        if (window.location.pathname.includes('/HTML/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'HTML/login.html';
        }
    }
}

/**
 * Proteger página de administrador
 */
function protegerPaginaAdmin() {
    if (!estaAutenticado()) {
        if (window.location.pathname.includes('/HTML/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'HTML/login.html';
        }
        return;
    }
    
    if (!esAdministrador()) {
        alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
        if (window.location.pathname.includes('/HTML/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

/**
 * Actualizar UI según el rol del usuario
 */
function actualizarUISegunRol() {
    const sesion = obtenerSesion();
    
    if (!sesion) return;
    
    // Mostrar nombre del usuario
    const userInfoElements = document.querySelectorAll('.user-info');
    userInfoElements.forEach(element => {
        element.textContent = sesion.nombre;
    });
    
    // Mostrar/ocultar botones de administrador
    const adminButtons = document.querySelectorAll('.admin-only');
    adminButtons.forEach(button => {
        if (sesion.rol === 'administrador') {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

/**
 * Registrar nuevo usuario
 * @param {Object} datosUsuario - Datos del nuevo usuario
 * @returns {Object} - Resultado del registro
 */
function registrarNuevoUsuario(datosUsuario) {
    const usuarios = obtenerTodosLosUsuarios();
    
    // Validar que el username no exista
    if (usuarios[datosUsuario.username]) {
        return {
            success: false,
            message: 'El nombre de usuario ya está en uso'
        };
    }
    
    // Validar que el email no esté registrado
    for (const username in usuarios) {
        if (usuarios[username].email === datosUsuario.email) {
            return {
                success: false,
                message: 'El email ya está registrado'
            };
        }
    }
    
    // Asegurar que el usuario tenga verificado en false
    datosUsuario.verificado = false;
    
    // Guardar usuario
    guardarUsuarioRegistrado(datosUsuario);
    
    console.log('✅ Usuario registrado:', datosUsuario.username);
    
    return {
        success: true,
        message: 'Usuario registrado exitosamente'
    };
}

/**
 * Generar código de verificación de 6 dígitos
 * @param {string} email - Email del usuario
 * @returns {string} - Código de verificación
 */
function generarCodigoVerificacion(email) {
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código de verificación (válido por 15 minutos)
    const verificacion = {
        email: email,
        code: code,
        expiracion: Date.now() + (15 * 60 * 1000) // 15 minutos
    };
    
    localStorage.setItem('verificacionEmail', JSON.stringify(verificacion));
    
    console.log('🔐 Código de verificación generado:', code);
    console.log('📧 Para email:', email);
    
    return code;
}

/**
 * Verificar email con código
 * @param {string} email - Email del usuario
 * @param {string} code - Código ingresado
 * @returns {Object} - Resultado de la verificación
 */
function verificarEmail(email, code) {
    const verificacion = JSON.parse(localStorage.getItem('verificacionEmail') || '{}');
    
    if (!verificacion.email || verificacion.email !== email) {
        return {
            success: false,
            message: 'No hay código de verificación pendiente para este email'
        };
    }
    
    // Verificar expiración
    if (Date.now() > verificacion.expiracion) {
        return {
            success: false,
            message: 'El código ha expirado. Por favor, solicita uno nuevo'
        };
    }
    
    // Verificar código
    if (verificacion.code !== code) {
        return {
            success: false,
            message: 'Código incorrecto. Por favor, verifica e intenta nuevamente'
        };
    }
    
    // Actualizar usuario como verificado
    const usuario = buscarUsuario(email);
    if (!usuario) {
        return {
            success: false,
            message: 'Usuario no encontrado'
        };
    }
    
    // Actualizar estado de verificación
    usuario.verificado = true;
    guardarUsuarioRegistrado(usuario);
    
    // Limpiar código de verificación
    localStorage.removeItem('verificacionEmail');
    
    console.log('✅ Email verificado exitosamente:', email);
    
    return {
        success: true,
        message: 'Email verificado exitosamente'
    };
}

/**
 * Iniciar proceso de recuperación de contraseña
 * @param {string} identificador - Username o email
 * @returns {Object} - Resultado con código de recuperación
 */
function iniciarRecuperacion(identificador) {
    const usuario = buscarUsuario(identificador);
    
    if (!usuario) {
        return {
            success: false,
            message: 'Usuario no encontrado'
        };
    }
    
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código de recuperación (válido por 15 minutos)
    const recuperacion = {
        username: usuario.username,
        code: code,
        expiracion: Date.now() + (15 * 60 * 1000) // 15 minutos
    };
    
    localStorage.setItem('recuperacionPassword', JSON.stringify(recuperacion));
    
    console.log('🔑 Código de recuperación generado:', code);
    console.log('📧 En producción se enviaría a:', usuario.email);
    
    return {
        success: true,
        code: code, // En producción NO se devolvería, se enviaría por email
        email: usuario.email,
        message: 'Código enviado al email registrado'
    };
}

/**
 * Cambiar contraseña del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} nuevaPassword - Nueva contraseña
 * @returns {Object} - Resultado del cambio
 */
function cambiarPassword(username, nuevaPassword) {
    const usuarios = obtenerTodosLosUsuarios();
    const usuario = usuarios[username];
    
    if (!usuario) {
        return {
            success: false,
            message: 'Usuario no encontrado'
        };
    }
    
    // Actualizar contraseña
    usuario.password = nuevaPassword;
    
    // Si es usuario registrado, actualizar en localStorage
    if (!USUARIOS_PREDETERMINADOS[username]) {
        guardarUsuarioRegistrado(usuario);
    } else {
        // Si es usuario predeterminado, guardarlo como registrado con nueva contraseña
        guardarUsuarioRegistrado(usuario);
    }
    
    // Limpiar datos de recuperación
    localStorage.removeItem('recuperacionPassword');
    
    console.log('✅ Contraseña cambiada para:', username);
    
    return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
    };
}

/**
 * Obtener perfil del usuario actual
 * @returns {Object|null} - Datos del perfil
 */
function obtenerPerfil() {
    const sesion = obtenerSesion();
    if (!sesion) return null;
    
    const usuario = buscarUsuario(sesion.username);
    if (!usuario) return null;
    
    // No devolver la contraseña
    const { password, ...perfilSinPassword } = usuario;
    return perfilSinPassword;
}

/**
 * Actualizar perfil del usuario
 * @param {Object} nuevosDatos - Nuevos datos del perfil
 * @returns {Object} - Resultado de la actualización
 */
function actualizarPerfil(nuevosDatos) {
    const sesion = obtenerSesion();
    if (!sesion) {
        return {
            success: false,
            message: 'No hay sesión activa'
        };
    }
    
    const usuario = buscarUsuario(sesion.username);
    if (!usuario) {
        return {
            success: false,
            message: 'Usuario no encontrado'
        };
    }
    
    // Actualizar datos permitidos
    if (nuevosDatos.nombre) usuario.nombre = nuevosDatos.nombre;
    if (nuevosDatos.email) usuario.email = nuevosDatos.email;
    if (nuevosDatos.telefono) usuario.telefono = nuevosDatos.telefono;
    if (nuevosDatos.direccion !== undefined) usuario.direccion = nuevosDatos.direccion;
    
    // Guardar cambios
    guardarUsuarioRegistrado(usuario);
    
    // Actualizar sesión con nuevo nombre
    sesion.nombre = usuario.nombre;
    sesion.email = usuario.email;
    localStorage.setItem('sesionPhoneSpot', JSON.stringify(sesion));
    
    return {
        success: true,
        message: 'Perfil actualizado exitosamente'
    };
}

/**
 * Generar código de verificación de email
 * @param {string} email - Email del usuario
 * @returns {string} - Código de 6 dígitos
 */
function generarCodigoVerificacion(email) {
    // Generar código aleatorio de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar en localStorage con expiración de 15 minutos
    const verificacion = {
        email: email,
        code: code,
        expiracion: Date.now() + (15 * 60 * 1000) // 15 minutos
    };
    
    localStorage.setItem('verificacionEmail', JSON.stringify(verificacion));
    
    console.log('📧 Código de verificación generado:', code);
    console.log('📧 Para:', email);
    console.log('⏰ Expira en 15 minutos');
    
    return code;
}

/**
 * Verificar email con código
 * @param {string} email - Email del usuario
 * @param {string} code - Código de verificación
 * @returns {Object} - Resultado de la verificación
 */
function verificarEmail(email, code) {
    const verificacion = JSON.parse(localStorage.getItem('verificacionEmail') || '{}');
    
    // Verificar que exista verificación pendiente
    if (!verificacion.email || !verificacion.code) {
        return {
            success: false,
            message: 'No hay verificación pendiente. Por favor, registra una cuenta primero.'
        };
    }
    
    // Verificar que el email coincida
    if (verificacion.email !== email) {
        return {
            success: false,
            message: 'El email no coincide con la verificación pendiente.'
        };
    }
    
    // Verificar expiración
    if (Date.now() > verificacion.expiracion) {
        localStorage.removeItem('verificacionEmail');
        return {
            success: false,
            message: 'El código ha expirado. Por favor, solicita uno nuevo.'
        };
    }
    
    // Verificar código
    if (verificacion.code !== code) {
        return {
            success: false,
            message: 'Código incorrecto. Por favor, verifica el código e intenta nuevamente.'
        };
    }
    
    // Código correcto - marcar usuario como verificado
    const usuario = buscarUsuario(email);
    if (!usuario) {
        return {
            success: false,
            message: 'Usuario no encontrado.'
        };
    }
    
    usuario.verificado = true;
    guardarUsuarioRegistrado(usuario);
    
    // Limpiar verificación
    localStorage.removeItem('verificacionEmail');
    
    console.log('✅ Email verificado exitosamente para:', email);
    
    return {
        success: true,
        message: 'Email verificado exitosamente'
    };
}

// ============================================================
// EXPORTAR FUNCIONES (para uso global)
// ============================================================
window.Auth = {
    login,
    logout,
    obtenerSesion,
    estaAutenticado,
    esAdministrador,
    protegerPagina,
    protegerPaginaAdmin,
    actualizarUISegunRol,
    registrarNuevoUsuario,
    iniciarRecuperacion,
    cambiarPassword,
    obtenerPerfil,
    actualizarPerfil,
    buscarUsuario,
    obtenerTodosLosUsuarios,
    generarCodigoVerificacion,
    verificarEmail
};

console.log('🔐 Sistema de autenticación PhoneSpot cargado');

