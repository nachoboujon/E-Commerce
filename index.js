/* =================================================================
   JAVASCRIPT PRINCIPAL - CELL HEALT E-COMMERCE
   ================================================================= */

// Variable global para el carrito
let carrito = [];

// ============================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    cargarCarritoDesdeStorage();
    
    // Inicializar event listeners
    inicializarEventos();
    
    // Actualizar badge del carrito
    actualizarBadgeCarrito();
});


// ============================================================
// FUNCIONES DE CARRITO
// ============================================================

/**
 * Agregar producto al carrito
 * @param {Object} producto - Objeto con datos del producto
 */
function agregarAlCarrito(producto) {
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si existe, aumentar cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregar nuevo producto
        producto.cantidad = 1;
        carrito.push(producto);
    }
    
    // Guardar en localStorage
    guardarCarritoEnStorage();
    
    // Actualizar interfaz
    actualizarBadgeCarrito();
    
    // Mostrar notificación
    mostrarNotificacion('Producto agregado al carrito ✓');
}

/**
 * Actualizar el badge del carrito con la cantidad total de productos
 */
function actualizarBadgeCarrito() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        badge.textContent = totalProductos;
        
        // Animar el badge
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Guardar carrito en localStorage
 */
function guardarCarritoEnStorage() {
    localStorage.setItem('carritoCell', JSON.stringify(carrito));
}

/**
 * Cargar carrito desde localStorage
 */
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carritoCell');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}


// ============================================================
// FUNCIONES DE INTERFAZ
// ============================================================

/**
 * Mostrar notificación temporal
 * @param {String} mensaje - Mensaje a mostrar
 * @param {String} tipo - Tipo de notificación: 'success', 'warning', 'error'
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Colores según tipo
    const colores = {
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        warning: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        error: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
    };
    
    const iconos = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar estilos inline (se pueden mover al CSS)
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}


// ============================================================
// EVENT LISTENERS
// ============================================================

/**
 * Inicializar todos los event listeners
 */
function inicializarEventos() {
    // Event listeners para botones "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll('.botonAddCart');
    
    botonesAgregar.forEach((boton) => {
        // Remover listeners previos para evitar duplicados
        boton.replaceWith(boton.cloneNode(true));
    });
    
    // Re-seleccionar después de reemplazar
    document.querySelectorAll('.botonAddCart').forEach((boton) => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener información del producto desde el DOM
            const productoCard = this.closest('.Product');
            const productId = productoCard.dataset.id;
            
            // Si hay ID, buscar el producto completo
            let producto;
            if (productId && window.Productos) {
                producto = window.Productos.obtenerProductoPorId(productId);
            } else {
                // Fallback: obtener desde DOM
                const nombre = productoCard.querySelector('h3').textContent;
                const precioTexto = productoCard.querySelector('.ProductPrice').textContent;
                const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));
                const imagen = productoCard.querySelector('img').src;
                
                producto = {
                    id: productId || `prod-${Date.now()}`,
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen,
                    categoria: 'General'
                };
            }
            
            // Validar stock
            if (window.Productos && producto.stock !== undefined) {
                if (producto.stock <= 0) {
                    mostrarNotificacion('⚠️ Producto sin stock', 'warning');
                    return;
                }
            }
            
            // Agregar al carrito
            agregarAlCarrito(producto);
            
            // Efecto visual en el botón
            this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar';
            }, 2000);
        });
    });
    
    // Event listener para la barra de búsqueda
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filtrarProductos(e.target.value);
        });
    }
    
    // Event listeners para botones de categoría
    const botonesCategorias = document.querySelectorAll('.botonCategory');
    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', function() {
            // Remover clase active de todos
            botonesCategorias.forEach(b => b.classList.remove('active'));
            // Agregar clase active al clickeado
            this.classList.add('active');
        });
    });
}


// ============================================================
// FUNCIÓN DE BÚSQUEDA/FILTRADO
// ============================================================

/**
 * Filtrar productos por texto de búsqueda
 * @param {String} textoBusqueda - Texto a buscar
 */
function filtrarProductos(textoBusqueda) {
    const productos = document.querySelectorAll('.Product');
    const textoMinuscula = textoBusqueda.toLowerCase();
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const descripcion = producto.querySelector('.ProductDescription').textContent.toLowerCase();
        
        // Mostrar u ocultar según coincidencia
        if (nombre.includes(textoMinuscula) || descripcion.includes(textoMinuscula)) {
            producto.style.display = 'flex';
            producto.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            producto.style.display = 'none';
        }
    });
}


// ============================================================
// ANIMACIONES CSS (agregar al style.css si no existen)
// ============================================================

// Agregar estilos de animación al head
const estilosAnimacion = document.createElement('style');
estilosAnimacion.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .cart-badge {
        transition: transform 0.2s ease-out;
    }
`;

document.head.appendChild(estilosAnimacion);


// ============================================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================================
window.inicializarEventos = inicializarEventos;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarBadgeCarrito = actualizarBadgeCarrito;

// ============================================================
// CONSOLA DE DESARROLLO
// ============================================================
console.log('🛍️ PhoneSpot E-Commerce cargado correctamente');
console.log('📦 Productos en carrito:', carrito.length);
