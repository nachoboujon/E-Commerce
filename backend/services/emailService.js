/* =================================================================
   SERVICIO DE EMAILS - NODEMAILER
   ================================================================= */

const nodemailer = require('nodemailer');

// Configuración del transportador de emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificar la conexión solo si hay credenciales configuradas
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Error en la configuración de email:', error);
        } else {
            console.log('✅ Servidor de email listo para enviar mensajes');
        }
    });
} else {
    console.log('⚠️  Nodemailer: No hay credenciales de email configuradas en .env');
    console.log('💡 El sistema usa EmailJS en el frontend, esto es opcional.');
}

/* =================================================================
   EMAIL DE VERIFICACIÓN DE CUENTA
   ================================================================= */
async function enviarEmailVerificacion(usuario, codigo) {
    const mailOptions = {
        from: `"PhoneSpot E-Commerce" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: '🔐 Verifica tu cuenta en PhoneSpot',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background-color: #000000; color: #ffffff; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; color: #333333; }
                .code-box { background-color: #f8f8f8; border: 2px dashed #000000; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px; }
                .code { font-size: 36px; font-weight: bold; color: #000000; letter-spacing: 5px; }
                .button { display: inline-block; padding: 15px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
                .warning { color: #d9534f; font-size: 14px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📱 PhoneSpot</h1>
                    <p style="margin: 10px 0 0 0;">¡Bienvenido a tu tienda de tecnología!</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #000000;">¡Hola, ${usuario.nombre}! 👋</h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                        Gracias por registrarte en <strong>PhoneSpot</strong>. Para completar tu registro, 
                        por favor verifica tu dirección de email.
                    </p>
                    
                    <p style="font-size: 16px;">
                        Tu código de verificación es:
                    </p>
                    
                    <div class="code-box">
                        <div class="code">${codigo}</div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666;">
                        Ingresa este código en la página de verificación para activar tu cuenta.
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/HTML/verificar-email.html" class="button">
                            VERIFICAR CUENTA
                        </a>
                    </div>
                    
                    <div class="warning">
                        ⚠️ Este código expira en 24 horas.<br>
                        Si no solicitaste esta verificación, ignora este email.
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>PhoneSpot E-Commerce</strong></p>
                    <p>San José, Entre Ríos | Argentina</p>
                    <p>📧 ${process.env.EMAIL_USER}</p>
                    <p style="margin-top: 15px;">© 2025 PhoneSpot. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de verificación enviado a ${usuario.email}`);
        return { success: true, message: 'Email enviado' };
    } catch (error) {
        console.error('❌ Error al enviar email de verificación:', error);
        return { success: false, message: error.message };
    }
}

/* =================================================================
   EMAIL DE CONFIRMACIÓN DE COMPRA (CLIENTE)
   ================================================================= */
async function enviarEmailConfirmacionCompra(orden, usuario) {
    const productosHTML = orden.productos.map(item => {
        // Construir nombre del producto con variantes
        let nombreCompleto = `<strong>${item.nombre}</strong>`;
        const variantes = [];
        
        if (item.color) variantes.push(`Color: ${item.color}`);
        if (item.memoria) variantes.push(`Memoria: ${item.memoria}`);
        
        if (variantes.length > 0) {
            nombreCompleto += `<br><small style="color: #666;">${variantes.join(' | ')}</small>`;
        }
        
        return `
        <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 15px 10px;">
                ${nombreCompleto}
            </td>
            <td style="padding: 15px 10px; text-align: center;">${item.cantidad}</td>
            <td style="padding: 15px 10px; text-align: right;">USD $${item.precio.toLocaleString('es-AR')}</td>
            <td style="padding: 15px 10px; text-align: right;"><strong>USD $${(item.precio * item.cantidad).toLocaleString('es-AR')}</strong></td>
        </tr>
        `;
    }).join('');

    const mailOptions = {
        from: `"PhoneSpot E-Commerce" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: `✅ Confirmación de Compra - Orden #${orden.numeroOrden}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background-color: #28a745; color: #ffffff; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 30px; color: #333333; }
                .order-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #dee2e6; }
                .info-row:last-child { border-bottom: none; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background-color: #000000; color: #ffffff; padding: 15px 10px; text-align: left; }
                .total-row { background-color: #000000; color: #ffffff; font-size: 18px; }
                .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ ¡Compra Confirmada!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">Tu pedido ha sido recibido exitosamente</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #28a745;">¡Gracias por tu compra, ${usuario.nombre}! 🎉</h2>
                    
                    <div class="order-info">
                        <div class="info-row">
                            <strong>Número de Orden:</strong>
                            <span>#${orden.numeroOrden}</span>
                        </div>
                        <div class="info-row">
                            <strong>Fecha:</strong>
                            <span>${new Date().toLocaleDateString('es-AR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                        <div class="info-row">
                            <strong>Estado:</strong>
                            <span style="color: #28a745; font-weight: bold;">${orden.estado}</span>
                        </div>
                    </div>
                    
                    <h3>📦 Detalle de tu pedido:</h3>
                    
                    ${orden.productos.length < 3 ? `
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 13px; color: #856404;">
                            ⚠️ <strong>Compra minorista:</strong> Se aplicó un cargo de $10 USD por producto (menos de 3 productos). 
                            Compra 3 o más productos para obtener precio mayorista.
                        </p>
                    </div>
                    ` : ''}
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th style="text-align: center;">Cantidad</th>
                                <th style="text-align: right;">Precio Unit.</th>
                                <th style="text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHTML}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="3" style="padding: 15px 10px; text-align: right;">TOTAL:</td>
                                <td style="padding: 15px 10px; text-align: right;"><strong>USD $${orden.total.toLocaleString('es-AR')}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>📦 Método de Envío:</strong><br>
                            ${orden.metodoEnvio === 'retiro' ? '🏪 Retiro en tienda - GRATIS' : 
                              `🚚 Envío a domicilio - ${orden.costoEnvio === 0 ? 'GRATIS' : `ARS $${orden.costoEnvio.toLocaleString()}`}`}
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 14px;">
                            <strong>📍 ${orden.metodoEnvio === 'retiro' ? 'Retiro en:' : 'Dirección de Envío:'}</strong><br>
                            ${orden.direccionEnvio || usuario.direccion || 'No especificada'}
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666;">
                        Recibirás una notificación cuando tu pedido sea despachado. 
                        Puedes seguir el estado de tu compra en tu perfil.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/HTML/perfil.html" 
                           style="display: inline-block; padding: 15px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            VER MIS PEDIDOS
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>PhoneSpot E-Commerce</strong></p>
                    <p>📧 ${process.env.EMAIL_USER} | 📱 WhatsApp: +54 9 3456 123456</p>
                    <p style="margin-top: 15px;">© 2025 PhoneSpot. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de confirmación enviado a ${usuario.email}`);
        return { success: true, message: 'Email enviado' };
    } catch (error) {
        console.error('❌ Error al enviar email de confirmación:', error);
        return { success: false, message: error.message };
    }
}

/* =================================================================
   EMAIL DE NOTIFICACIÓN AL ADMINISTRADOR
   ================================================================= */
async function enviarEmailNotificacionAdmin(orden, usuario) {
    const productosHTML = orden.productos.map(item => {
        // Construir detalles del producto con color y memoria si existen
        let detallesProducto = `<strong>${item.nombre}</strong>`;
        
        // Agregar color si existe
        if (item.color) {
            detallesProducto += `<br><span style="color: #666; font-size: 14px;">📱 Color: ${item.color}</span>`;
        }
        
        // Agregar memoria si existe
        if (item.memoria) {
            detallesProducto += `<br><span style="color: #666; font-size: 14px;">💾 Memoria: ${item.memoria}</span>`;
        }
        
        return `
        <li style="margin-bottom: 15px; padding: 10px; background-color: #ffffff; border-radius: 5px;">
            ${detallesProducto}
            <br><span style="color: #333;">Cantidad: <strong>${item.cantidad}</strong></span>
            <br><span style="color: #333;">Precio unitario: <strong>USD $${item.precio.toLocaleString('es-AR')}</strong></span>
            <br><span style="color: #28a745; font-weight: bold;">Subtotal: USD $${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
        </li>
        `;
    }).join('');

    const mailOptions = {
        from: `"PhoneSpot Sistema" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
        subject: `🛒 Nueva Compra - Orden #${orden.numeroOrden}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background-color: #dc3545; color: #ffffff; padding: 30px; text-align: center; }
                .content { padding: 30px; color: #333333; }
                .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                ul { background-color: #f8f9fa; padding: 20px 40px; border-radius: 5px; }
                li { margin: 10px 0; }
                .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛒 Nueva Compra Recibida</h1>
                    <p style="margin: 10px 0 0 0;">Panel de Administración</p>
                </div>
                
                <div class="content">
                    <div class="alert-box">
                        <strong>⚡ ATENCIÓN:</strong> Se ha registrado una nueva compra en el sistema.
                    </div>
                    
                    <h3>📋 Información de la Orden:</h3>
                    <div class="info-box">
                        <p><strong>Número de Orden:</strong> #${orden.numeroOrden}</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
                        <p><strong>Total:</strong> <span style="color: #28a745; font-size: 20px; font-weight: bold;">$${orden.total.toLocaleString('es-AR')}</span></p>
                    </div>
                    
                    <h3>👤 Datos del Cliente:</h3>
                    <div class="info-box">
                        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                        <p><strong>Email:</strong> ${usuario.email}</p>
                        <p><strong>Teléfono:</strong> ${usuario.telefono || 'No especificado'}</p>
                    </div>
                    
                    <h3>📦 Información de Envío:</h3>
                    <div class="info-box" style="${orden.metodoEnvio === 'retiro' ? 'background-color: #e8f5e9; border-left: 4px solid #4caf50;' : 'background-color: #e7f3ff; border-left: 4px solid #0066cc;'}">
                        <p><strong>Método:</strong> ${
                            orden.metodoEnvio === 'retiro' ? '🏪 Retiro en tienda - GRATIS' : 
                            `🚚 Envío a domicilio - ${orden.costoEnvio === 0 ? 'GRATIS' : `ARS $${orden.costoEnvio.toLocaleString()}`}`
                        }</p>
                        <p><strong>${orden.metodoEnvio === 'retiro' ? 'Retiro en:' : 'Dirección de Envío:'}</strong><br>
                        ${orden.direccionEnvio || usuario.direccion || 'No especificada'}</p>
                    </div>
                    
                    <h3>📦 Productos del Pedido:</h3>
                    
                    ${orden.productos.length < 3 ? `
                    <div class="alert-box">
                        <p style="margin: 0; font-size: 13px;">
                            ⚠️ <strong>Compra minorista:</strong> Se aplicó cargo de $10 USD por producto (menos de 3 productos)
                        </p>
                    </div>
                    ` : ''}
                    
                    <ul>
                        ${productosHTML}
                    </ul>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/HTML/admin.html" 
                           style="display: inline-block; padding: 15px 40px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            IR AL PANEL DE ADMIN
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>PhoneSpot - Sistema de Administración</strong></p>
                    <p>Este es un email automático del sistema.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email de notificación enviado al administrador');
        return { success: true, message: 'Email enviado' };
    } catch (error) {
        console.error('❌ Error al enviar email al administrador:', error);
        return { success: false, message: error.message };
    }
}

/* =================================================================
   GENERAR CÓDIGO DE VERIFICACIÓN
   ================================================================= */
function generarCodigoVerificacion() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
}

module.exports = {
    enviarEmailVerificacion,
    enviarEmailConfirmacionCompra,
    enviarEmailNotificacionAdmin,
    generarCodigoVerificacion
};

