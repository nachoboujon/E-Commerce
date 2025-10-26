/* =================================================================
   SERVICIO DE ENVÍO DE EMAILS - PHONESPOT
   Usando EmailJS para enviar emails desde el cliente
   ================================================================= */

// Configuración de EmailJS
const EMAILJS_CONFIG = {
    serviceId: 'service_9nmh0pn', // Tu Service ID de EmailJS
    templateIdAdmin: 'template_admin',
    templateIdCliente: 'template_cliente',
    templateIdVerificacion: 'template_verificacion', // ✅ NUEVO: Template de verificación
    publicKey: 'IdOzlzdWi-fl3lQCJ' // Tu Public Key de EmailJS
};

/**
 * Inicializar EmailJS
 */
function inicializarEmailJS() {
    // Cargar EmailJS desde CDN si no está cargado
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS inicializado');
        };
        document.head.appendChild(script);
    } else {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

/**
 * Enviar email al administrador cuando hay una nueva compra
 * @param {Object} datosCompra - Información de la compra
 * @returns {Promise}
 */
async function enviarEmailAdmin(datosCompra) {
    const { productos, total, cliente, fecha, numeroCompra } = datosCompra;
    
    const productosHTML = productos.map(p => 
        `${p.nombre} - Cantidad: ${p.cantidad} - Precio: USD $${p.precio.toLocaleString()}`
    ).join('\n');
    
    const templateParams = {
        to_email: 'nboujon7@gmail.com', // Email del administrador
        numero_pedido: numeroCompra || 'N/A',
        cliente_nombre: cliente.nombre,
        cliente_email: cliente.email || 'No proporcionado',
        cliente_telefono: cliente.telefono || 'No proporcionado',
        fecha_compra: new Date(fecha).toLocaleString('es-AR'),
        productos: productosHTML,
        total: `USD $${total.toLocaleString()}`,
        mensaje: `🔔 NUEVA COMPRA - PEDIDO #${numeroCompra}\n\n👤 CLIENTE: ${cliente.nombre}\n📧 Email: ${cliente.email}\n\nPor favor, preparar el pedido lo antes posible.`
    };
    
    try {
        // Si EmailJS está disponible
        if (typeof emailjs !== 'undefined') {
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateIdAdmin,
                templateParams
            );
            console.log('✅ Email enviado al administrador:', response);
            return { success: true, response };
        } else {
            // Modo simulación si EmailJS no está configurado
            console.log('📧 [SIMULACIÓN] Email al administrador:', templateParams);
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('❌ Error al enviar email al admin:', error);
        return { success: false, error };
    }
}

/**
 * Enviar email de confirmación al cliente
 * @param {Object} datosCompra - Información de la compra
 * @returns {Promise}
 */
async function enviarEmailCliente(datosCompra) {
    const { productos, total, cliente, fecha, numeroCompra } = datosCompra;
    
    const productosHTML = productos.map(p => 
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.nombre}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">USD $${p.precio.toLocaleString()}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">USD $${p.subtotal.toLocaleString()}</td>
        </tr>`
    ).join('');
    
    const templateParams = {
        to_email: cliente.email,
        cliente_nombre: cliente.nombre,
        numero_compra: numeroCompra,
        fecha_compra: new Date(fecha).toLocaleString('es-AR'),
        productos_html: productosHTML,
        subtotal: `USD $${total.toLocaleString()}`,
        envio: 'GRATIS 🎁',
        total: `USD $${total.toLocaleString()}`,
        direccion_envio: cliente.direccion || 'A confirmar',
        telefono_tienda: '3447 416011',
        direccion_tienda: 'Moreno 840, CP 3283, San José, Colón, Entre Ríos'
    };
    
    try {
        if (typeof emailjs !== 'undefined') {
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateIdCliente,
                templateParams
            );
            console.log('✅ Email enviado al cliente:', response);
            return { success: true, response };
        } else {
            console.log('📧 [SIMULACIÓN] Email al cliente:', templateParams);
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('❌ Error al enviar email al cliente:', error);
        return { success: false, error };
    }
}

/**
 * Procesar envío de emails para una compra
 * @param {Object} compra - Datos de la compra
 * @param {Object} sesion - Sesión del usuario
 */
async function procesarEmailsCompra(compra, sesion) {
    const datosCompra = {
        numeroCompra: compra.id || compra.numeroOrden || `ORDEN-${Date.now()}`,
        fecha: compra.fecha || compra.fechaOrden || new Date(),
        productos: compra.productos,
        total: compra.total,
        cliente: {
            nombre: sesion.nombre,
            email: sesion.email || 'cliente@ejemplo.com',
            telefono: sesion.telefono || 'No proporcionado',
            direccion: sesion.direccion || 'A coordinar'
        }
    };
    
    // Enviar emails en paralelo
    const [resultadoAdmin, resultadoCliente] = await Promise.all([
        enviarEmailAdmin(datosCompra),
        enviarEmailCliente(datosCompra)
    ]);
    
    if (resultadoAdmin.success && resultadoCliente.success) {
        console.log('✅ Emails enviados correctamente');
        if (resultadoAdmin.simulated) {
            alert('📧 Modo Demo: Los emails se simularían en producción.\n\nPara activar emails reales:\n1. Crea cuenta en EmailJS.com\n2. Configura tus templates\n3. Actualiza las credenciales en email-service.js');
        }
        return true;
    } else {
        console.warn('⚠️ Algunos emails no se enviaron');
        return false;
    }
}

/**
 * Enviar email de bienvenida al registrarse
 * @param {Object} datosUsuario - Información del nuevo usuario
 * @returns {Promise}
 */
async function enviarEmailBienvenida(datosUsuario) {
    const { email, nombre } = datosUsuario;
    
    const templateParams = {
        to_email: email,
        to_name: nombre,
        subject: '¡Bienvenido a PhoneSpot!',
        message: `Hola ${nombre}!\n\nGracias por registrarte en PhoneSpot.\n\nTu cuenta ha sido verificada exitosamente.\nAhora puedes disfrutar de nuestros productos y ofertas exclusivas.\n\n¡Bienvenido a la familia PhoneSpot!\n\nContacto: nboujon@gmail.com\nTeléfono: 3447 416011`
    };
    
    try {
        // Si EmailJS está disponible
        if (typeof emailjs !== 'undefined') {
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                'template_bienvenida', // Template de bienvenida
                templateParams
            );
            console.log('✅ Email de bienvenida enviado:', response);
            return { success: true, response };
        } else {
            // Modo simulación
            console.log('📧 [SIMULACIÓN] Email de bienvenida a:', email);
            console.log('Mensaje:', templateParams.message);
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('❌ Error al enviar email de bienvenida:', error);
        return { success: false, error };
    }
}

/**
 * Enviar email con código de verificación
 * @param {string} email - Email del destinatario
 * @param {string} codigo - Código de verificación
 * @returns {Promise}
 */
async function enviarEmailVerificacion(email, codigo) {
    const templateParams = {
        to_email: email,
        codigo: codigo
    };
    
    try {
        // Si EmailJS está disponible
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.templateIdVerificacion) {
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateIdVerificacion,
                templateParams
            );
            console.log('✅ Email de verificación enviado a:', email);
            console.log('📧 Revisa tu bandeja de entrada (o spam)');
            return { success: true, response };
        } else {
            // Modo simulación (si EmailJS no está configurado)
            console.log('⚠️ EmailJS no configurado - MODO DEMO');
            console.log('📧 Email de verificación para:', email);
            console.log('🔐 Código:', codigo);
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.error('❌ Error al enviar email de verificación:', error);
        console.log('⚠️ Fallback a modo DEMO');
        console.log('🔐 Código:', codigo);
        return { success: false, error, codigo: codigo };
    }
}

// Inicializar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEmailJS);
} else {
    inicializarEmailJS();
}

// Exportar funciones
window.EmailService = {
    enviarEmailAdmin,
    enviarEmailCliente,
    procesarEmailsCompra,
    enviarEmailBienvenida,
    enviarEmailVerificacion
};

console.log('📧 Servicio de emails cargado');

