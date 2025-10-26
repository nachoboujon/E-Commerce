/* =================================================================
   GESTIÓN DE PRODUCTOS - PHONESPOT
   ================================================================= */

// Base de datos de productos en localStorage
const DB_KEY = 'productosPhoneSpot';

// ============================================================
// FUNCIONES DE GESTIÓN DE PRODUCTOS
// ============================================================

/**
 * Obtener todos los productos
 * Intenta cargar desde backend primero, sino usa localStorage
 * @returns {Array} - Array de productos
 */
function obtenerProductos() {
    const productosStr = localStorage.getItem(DB_KEY);
    if (productosStr) {
        return JSON.parse(productosStr);
    }
    return obtenerProductosIniciales();
}

/**
 * Cargar productos desde el backend de forma asíncrona
 * @returns {Promise<Array>}
 */
async function cargarProductosDesdeBackend() {
    if (window.BACKEND_DISPONIBLE && window.APIService) {
        try {
            console.log('🔄 Cargando productos desde MongoDB...');
            const productos = await window.APIService.obtenerProductos();
            
            if (productos && productos.length > 0) {
                // Guardar en localStorage como cache
                localStorage.setItem(DB_KEY, JSON.stringify(productos));
                console.log('✅ Productos cargados desde backend:', productos.length);
                return productos;
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar desde backend, usando localStorage:', error);
        }
    }
    
    // Fallback: usar productos locales
    return obtenerProductos();
}

/**
 * Productos iniciales del sistema (CON FILTROS)
 */
function obtenerProductosIniciales() {
    return [
        // ========== CELULARES - SAMSUNG ==========
        {
            id: 'prod-1',
            nombre: 'Samsung Galaxy S24 Ultra',
            categoria: 'Celulares',
            marca: 'Samsung',
            precio: 899,
            precioAnterior: 1199,
            stock: 12,
            descripcion: 'Snapdragon 8 Gen 3, 12GB RAM, S-Pen incluido. Cámara 200MP.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.9,
            esNuevo: true,
            enOferta: true,
            // ✨ VARIANTES: Color y Memoria
            colores: ['Negro', 'Titanio', 'Violeta'],
            memorias: ['256GB', '512GB', '1TB']
        },
        {
            id: 'prod-2',
            nombre: 'Samsung Galaxy A54',
            categoria: 'Celulares',
            marca: 'Samsung',
            precio: 349,
            precioAnterior: null,
            stock: 20,
            descripcion: 'Exynos 1380, cámara 50MP, batería 5000mAh. Gama media premium.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.0,
            esNuevo: false,
            enOferta: true,
            colores: ['Negro', 'Blanco', 'Verde', 'Violeta'],
            memorias: ['128GB', '256GB']
        },
        {
            id: 'prod-3',
            nombre: 'iPhone 14',
            categoria: 'Celulares',
            precio: 450000,
            precioAnterior: null,
            stock: 3,
            descripcion: 'Chip A15 Bionic, Pantalla 6.1", Cámara dual 12MP, 5G. iOS 16.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 5.0,
            esNuevo: false,
            enOferta: false,
            colores: ['Azul', 'Morado', 'Medianoche', 'Starlight', 'Rojo'],
            memorias: ['128GB', '256GB', '512GB']
        },
        {
            id: 'prod-4',
            nombre: 'Motorola Edge 40',
            categoria: 'Celulares',
            precio: 48750,
            precioAnterior: 75000,
            stock: 15,
            descripcion: 'MediaTek Dimensity 8020, Pantalla pOLED 6.55", 8GB RAM, Carga 68W.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.2,
            esNuevo: false,
            enOferta: true
        },
        {
            id: 'prod-5',
            nombre: 'Google Pixel 8',
            categoria: 'Celulares',
            precio: 380000,
            precioAnterior: null,
            stock: 7,
            descripcion: 'Tensor G3, OLED 6.2", 8GB RAM, 128GB. Cámara 50MP con IA.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.8,
            esNuevo: true,
            enOferta: false
        },
        {
            id: 'prod-6',
            nombre: 'OnePlus 11',
            categoria: 'Celulares',
            precio: 320000,
            precioAnterior: null,
            stock: 6,
            descripcion: 'Snapdragon 8 Gen 2, AMOLED 120Hz 6.7", 12GB RAM, Carga rápida 100W.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.6,
            esNuevo: false,
            enOferta: false
        },
        
        // ========== TABLETS ==========
        {
            id: 'prod-7',
            nombre: 'iPad Pro 12.9" M2',
            categoria: 'Tablets',
            precio: 850000,
            precioAnterior: null,
            stock: 4,
            descripcion: 'Chip M2, Liquid Retina XDR, 128GB, Wi-Fi 6E. Compatible con Apple Pencil.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 5.0,
            esNuevo: true,
            enOferta: false
        },
        {
            id: 'prod-8',
            nombre: 'Samsung Galaxy Tab S9',
            categoria: 'Tablets',
            precio: 420000,
            precioAnterior: null,
            stock: 8,
            descripcion: 'Snapdragon 8 Gen 2, Dynamic AMOLED 11", 8GB RAM, S Pen incluido.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.6,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-9',
            nombre: 'Lenovo Tab P11 Pro Gen 2',
            categoria: 'Tablets',
            precio: 180000,
            precioAnterior: 220000,
            stock: 15,
            descripcion: 'MediaTek Kompanio 1300T, OLED 11.5", 6GB RAM, Dolby Atmos.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.1,
            esNuevo: false,
            enOferta: true
        },
        {
            id: 'prod-10',
            nombre: 'iPad Air 5ta Gen',
            categoria: 'Tablets',
            precio: 520000,
            precioAnterior: null,
            stock: 10,
            descripcion: 'Chip M1, Liquid Retina 10.9", 64GB, Touch ID, Cámara frontal 12MP.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.8,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-11',
            nombre: 'Samsung Galaxy Tab A8',
            categoria: 'Tablets',
            precio: 95000,
            precioAnterior: null,
            stock: 20,
            descripcion: 'Unisoc Tiger T618, LCD 10.5", 4GB RAM, Quad Speakers.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 3.9,
            esNuevo: false,
            enOferta: false
        },
        
        // ========== NOTEBOOKS ==========
        {
            id: 'prod-12',
            nombre: 'MacBook Pro 14" M3',
            categoria: 'Notebooks',
            precio: 1450000,
            precioAnterior: null,
            stock: 3,
            descripcion: 'Chip M3, 16GB RAM, SSD 512GB, Pantalla Liquid Retina XDR, macOS Sonoma.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 5.0,
            esNuevo: true,
            enOferta: false
        },
        {
            id: 'prod-13',
            nombre: 'Dell XPS 13 Plus',
            categoria: 'Notebooks',
            precio: 920000,
            precioAnterior: null,
            stock: 5,
            descripcion: 'Intel Core i7 13th Gen, 16GB RAM, SSD 512GB, Pantalla OLED 13.4", Win 11.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.7,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-14',
            nombre: 'Lenovo ThinkPad X1 Carbon',
            categoria: 'Notebooks',
            precio: 680000,
            precioAnterior: 780000,
            stock: 8,
            descripcion: 'Intel Core i5 12th Gen, 16GB RAM, SSD 256GB, 14" FHD, Ultraliviana.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.3,
            esNuevo: false,
            enOferta: true
        },
        {
            id: 'prod-15',
            nombre: 'ASUS ROG Strix G16',
            categoria: 'Notebooks',
            precio: 1280000,
            precioAnterior: null,
            stock: 4,
            descripcion: 'Intel Core i9, RTX 4060, 16GB RAM, SSD 1TB, 16" 165Hz. Gaming Pro.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.6,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-16',
            nombre: 'HP Pavilion 15',
            categoria: 'Notebooks',
            precio: 380000,
            precioAnterior: null,
            stock: 12,
            descripcion: 'Intel Core i5 11th Gen, 8GB RAM, SSD 256GB, 15.6" FHD.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.0,
            esNuevo: false,
            enOferta: false
        },
        
        // ========== ACCESORIOS ==========
        {
            id: 'prod-17',
            nombre: 'AirPods Pro 2da Gen',
            categoria: 'Accesorios',
            precio: 145000,
            precioAnterior: null,
            stock: 20,
            descripcion: 'Cancelación activa de ruido, Audio espacial, Estuche MagSafe, USB-C.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 5.0,
            esNuevo: true,
            enOferta: false
        },
        {
            id: 'prod-18',
            nombre: 'Samsung Galaxy Buds2 Pro',
            categoria: 'Accesorios',
            precio: 85000,
            precioAnterior: null,
            stock: 15,
            descripcion: 'ANC inteligente, Audio 360, Resistencia al agua IPX7, Carga inalámbrica.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.5,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-19',
            nombre: 'Funda Spigen Ultra Hybrid',
            categoria: 'Accesorios',
            precio: 8500,
            precioAnterior: 12000,
            stock: 50,
            descripcion: 'Protección militar, Transparente, Anti-amarilleo, Compatible con MagSafe.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.2,
            esNuevo: false,
            enOferta: true
        },
        {
            id: 'prod-20',
            nombre: 'Cargador Rápido 65W GaN',
            categoria: 'Accesorios',
            precio: 28000,
            precioAnterior: null,
            stock: 30,
            descripcion: '3 puertos USB-C, Tecnología GaN, Compacto, Compatible con laptops y celulares.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.7,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-21',
            nombre: 'Apple Watch Series 9',
            categoria: 'Accesorios',
            precio: 320000,
            precioAnterior: null,
            stock: 12,
            descripcion: 'GPS + Cellular, Pantalla Always-On, Sensor de temperatura, S9 SiP.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.9,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-22',
            nombre: 'Anker PowerBank 20000mAh',
            categoria: 'Accesorios',
            precio: 45000,
            precioAnterior: null,
            stock: 25,
            descripcion: 'Carga rápida 30W, 2 puertos USB-C, Pantalla LED, Ultra compacto.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.6,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-23',
            nombre: 'Teclado Logitech MX Keys',
            categoria: 'Accesorios',
            precio: 68000,
            precioAnterior: null,
            stock: 18,
            descripcion: 'Mecánico, Retroiluminado, Multi-dispositivo, USB-C, Wireless.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.8,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-24',
            nombre: 'Mouse Logitech MX Master 3S',
            categoria: 'Accesorios',
            precio: 52000,
            precioAnterior: null,
            stock: 22,
            descripcion: 'Ergonómico, 8000 DPI, Silencioso, Multi-dispositivo, Carga USB-C.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.9,
            esNuevo: false,
            enOferta: false
        },
        {
            id: 'prod-25',
            nombre: 'Auriculares Bluetooth Pro',
            categoria: 'Accesorios',
            precio: 22000,
            precioAnterior: 40000,
            stock: 35,
            descripcion: 'Cancelación de ruido, 30h batería, Bluetooth 5.3, Sonido Hi-Fi.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.0,
            esNuevo: false,
            enOferta: true
        },
        {
            id: 'prod-26',
            nombre: 'Pack 3 Fundas Premium',
            categoria: 'Accesorios',
            precio: 14000,
            precioAnterior: 20000,
            stock: 40,
            descripcion: '3 Fundas de silicona premium, colores variados, protección completa.',
            imagen: 'IMG/Note 14 Pro.png',
            rating: 4.5,
            esNuevo: false,
            enOferta: true
        }
    ];
}

/**
 * Guardar productos en localStorage
 * @param {Array} productos - Array de productos
 */
function guardarProductos(productos) {
    localStorage.setItem(DB_KEY, JSON.stringify(productos));
}

/**
 * Agregar nuevo producto (solo admin)
 * @param {Object} producto - Objeto del producto
 * @returns {boolean} - true si se agregó correctamente
 */
function agregarProducto(producto) {
    if (!window.Auth || !window.Auth.esAdministrador()) {
        console.error('Solo administradores pueden agregar productos');
        return false;
    }
    
    const productos = obtenerProductos();
    
    // Generar ID único
    producto.id = 'prod-' + Date.now();
    
    // Validar datos
    if (!producto.nombre || !producto.precio || !producto.categoria) {
        console.error('Datos incompletos del producto');
        return false;
    }
    
    productos.push(producto);
    guardarProductos(productos);
    
    console.log('✅ Producto agregado:', producto.nombre);
    return true;
}

/**
 * Actualizar producto existente
 * @param {string} id - ID del producto
 * @param {Object} datosActualizados - Nuevos datos
 * @returns {boolean}
 */
function actualizarProducto(id, datosActualizados) {
    if (!window.Auth || !window.Auth.esAdministrador()) {
        console.error('Solo administradores pueden actualizar productos');
        return false;
    }
    
    const productos = obtenerProductos();
    const index = productos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        productos[index] = { ...productos[index], ...datosActualizados };
        guardarProductos(productos);
        console.log('✅ Producto actualizado:', id);
        return true;
    }
    
    return false;
}

/**
 * Eliminar producto
 * @param {string} id - ID del producto
 * @returns {boolean}
 */
function eliminarProducto(id) {
    if (!window.Auth || !window.Auth.esAdministrador()) {
        console.error('Solo administradores pueden eliminar productos');
        return false;
    }
    
    const productos = obtenerProductos();
    const productosFiltrados = productos.filter(p => p.id !== id);
    
    if (productosFiltrados.length < productos.length) {
        guardarProductos(productosFiltrados);
        console.log('✅ Producto eliminado:', id);
        return true;
    }
    
    return false;
}

/**
 * Obtener productos por categoría
 * @param {string} categoria - Nombre de la categoría
 * @returns {Array}
 */
function obtenerProductosPorCategoria(categoria) {
    const productos = obtenerProductos();
    return productos.filter(p => p.categoria === categoria);
}

/**
 * Buscar productos
 * @param {string} termino - Término de búsqueda
 * @returns {Array}
 */
function buscarProductos(termino) {
    const productos = obtenerProductos();
    const terminoLower = termino.toLowerCase();
    
    return productos.filter(p => 
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.descripcion.toLowerCase().includes(terminoLower) ||
        p.categoria.toLowerCase().includes(terminoLower)
    );
}

/**
 * Obtener producto por ID
 * @param {string} id - ID del producto
 * @returns {Object|null}
 */
function obtenerProductoPorId(id) {
    const productos = obtenerProductos();
    return productos.find(p => p.id === id) || null;
}

/**
 * Actualizar stock de un producto
 * @param {string} id - ID del producto
 * @param {number} cantidad - Cantidad a reducir (negativo para aumentar)
 * @returns {boolean}
 */
function actualizarStock(id, cantidad) {
    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        console.error('Producto no encontrado:', id);
        return false;
    }
    
    const nuevoStock = producto.stock - cantidad;
    
    if (nuevoStock < 0) {
        console.error('Stock insuficiente para:', producto.nombre);
        return false;
    }
    
    producto.stock = nuevoStock;
    guardarProductos(productos);
    
    console.log(`✅ Stock actualizado: ${producto.nombre} - Nuevo stock: ${nuevoStock}`);
    
    // Registrar movimiento de stock
    registrarMovimientoStock(id, producto.nombre, -cantidad, 'venta');
    
    return true;
}

/**
 * Validar stock disponible
 * @param {Array} carrito - Array de productos del carrito
 * @returns {Object} - {valido: boolean, errores: Array}
 */
function validarStockCarrito(carrito) {
    const productos = obtenerProductos();
    const errores = [];
    
    carrito.forEach(itemCarrito => {
        const producto = productos.find(p => p.id === itemCarrito.id);
        
        if (!producto) {
            errores.push(`Producto "${itemCarrito.nombre}" no encontrado`);
        } else if (producto.stock < itemCarrito.cantidad) {
            errores.push(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${itemCarrito.cantidad}`);
        }
    });
    
    return {
        valido: errores.length === 0,
        errores: errores
    };
}

/**
 * Procesar compra (actualiza stock de todos los productos)
 * @param {Array} carrito - Array de productos del carrito
 * @returns {boolean}
 */
function procesarCompra(carrito) {
    // Primero validar stock
    const validacion = validarStockCarrito(carrito);
    
    if (!validacion.valido) {
        console.error('Errores de stock:', validacion.errores);
        alert('Error en el stock:\n\n' + validacion.errores.join('\n'));
        return false;
    }
    
    // Actualizar stock de cada producto
    let todoOk = true;
    carrito.forEach(item => {
        if (!actualizarStock(item.id, item.cantidad)) {
            todoOk = false;
        }
    });
    
    if (todoOk) {
        console.log('✅ Compra procesada correctamente');
        
        // Guardar historial de compra
        guardarHistorialCompra(carrito);
    }
    
    return todoOk;
}

/**
 * Registrar movimiento de stock
 */
function registrarMovimientoStock(productoId, productoNombre, cantidad, tipo) {
    const movimientos = JSON.parse(localStorage.getItem('movimientosStock') || '[]');
    
    movimientos.push({
        id: 'mov-' + Date.now(),
        productoId: productoId,
        productoNombre: productoNombre,
        cantidad: cantidad,
        tipo: tipo, // 'venta', 'devolucion', 'ajuste'
        fecha: new Date().toISOString(),
        usuario: window.Auth ? (Auth.obtenerSesion()?.nombre || 'Sistema') : 'Sistema'
    });
    
    // Mantener solo los últimos 100 movimientos
    if (movimientos.length > 100) {
        movimientos.splice(0, movimientos.length - 100);
    }
    
    localStorage.setItem('movimientosStock', JSON.stringify(movimientos));
}

/**
 * Obtener movimientos de stock
 */
function obtenerMovimientosStock() {
    return JSON.parse(localStorage.getItem('movimientosStock') || '[]');
}

/**
 * Guardar historial de compra
 */
function guardarHistorialCompra(carrito) {
    const historial = JSON.parse(localStorage.getItem('historialCompras') || '[]');
    const sesion = window.Auth ? Auth.obtenerSesion() : null;
    
    const compra = {
        id: 'compra-' + Date.now(),
        fecha: new Date().toISOString(),
        usuario: sesion ? sesion.nombre : 'Invitado',
        productos: carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.precio * item.cantidad
        })),
        total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    };
    
    historial.push(compra);
    
    // Mantener solo las últimas 50 compras
    if (historial.length > 50) {
        historial.splice(0, historial.length - 50);
    }
    
    localStorage.setItem('historialCompras', JSON.stringify(historial));
}

/**
 * Obtener historial de compras
 */
function obtenerHistorialCompras() {
    return JSON.parse(localStorage.getItem('historialCompras') || '[]');
}

/**
 * Renderizar productos en HTML
 * @param {Array} productos - Array de productos
 * @param {string} contenedorId - ID del contenedor HTML
 */
function renderizarProductos(productos, contenedorId = 'ContentProducts') {
    const contenedor = document.querySelector('.' + contenedorId) || document.getElementById(contenedorId);
    
    if (!contenedor) {
        console.error('Contenedor no encontrado:', contenedorId);
        return;
    }
    
    contenedor.innerHTML = '';
    
    productos.forEach(producto => {
        const productoHTML = crearTarjetaProducto(producto);
        contenedor.innerHTML += productoHTML;
    });
    
    // Reinicializar event listeners
    if (window.inicializarEventos) {
        window.inicializarEventos();
    }
}

/**
 * Crear HTML de tarjeta de producto
 * @param {Object} producto - Datos del producto
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
    const badge = producto.esNuevo ? '<div class="product-badge">Nuevo</div>' :
                  producto.enOferta ? '<div class="product-badge sale">Oferta</div>' : '';
    
    const precioAnterior = producto.precioAnterior ? 
        `<span class="old-price">$${producto.precioAnterior.toLocaleString()}</span>` : '';
    
    const estrellas = generarEstrellas(producto.rating);
    
    // Ajustar ruta de imagen según ubicación del HTML
    let rutaImagen = producto.imagen;
    
    // Si la imagen no es Base64 y no empieza con http, ajustar ruta
    if (!rutaImagen.startsWith('data:') && !rutaImagen.startsWith('http')) {
        // Detectar si estamos en una subcarpeta (HTML/)
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/HTML/');
        
        // Si estamos en subcarpeta y la ruta no tiene ../, agregarla
        if (isInSubfolder && !rutaImagen.startsWith('../')) {
            rutaImagen = '../' + rutaImagen;
        }
    }
    
    // ✨ SELECTORES DE VARIANTES (Color y Memoria)
    const selectorColor = producto.colores && producto.colores.length > 0 ? `
        <div class="product-variant">
            <label><i class="fas fa-palette"></i> Color:</label>
            <select class="variant-selector color-selector" data-product-id="${producto.id}">
                ${producto.colores.map((color, index) => 
                    `<option value="${color}" ${index === 0 ? 'selected' : ''}>${color}</option>`
                ).join('')}
            </select>
        </div>
    ` : '';
    
    const selectorMemoria = producto.memorias && producto.memorias.length > 0 ? `
        <div class="product-variant">
            <label><i class="fas fa-memory"></i> Memoria:</label>
            <select class="variant-selector memory-selector" data-product-id="${producto.id}">
                ${producto.memorias.map((memoria, index) => 
                    `<option value="${memoria}" ${index === 0 ? 'selected' : ''}>${memoria}</option>`
                ).join('')}
            </select>
        </div>
    ` : '';
    
    const botonesAdmin = window.Auth && window.Auth.esAdministrador() ? `
        <button class="btn-editar-producto admin-only" data-id="${producto.id}" 
                style="background: #ff9800; color: white; padding: 8px 12px; border: none; border-radius: 6px; margin-top: 10px; cursor: pointer; width: 48%; display: inline-block;">
            <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-eliminar-producto admin-only" data-id="${producto.id}"
                style="background: #f44336; color: white; padding: 8px 12px; border: none; border-radius: 6px; margin-top: 10px; cursor: pointer; width: 48%; display: inline-block;">
            <i class="fas fa-trash"></i> Eliminar
        </button>
    ` : '';
    
    return `
        <div class="Product" data-id="${producto.id}">
            ${badge}
            <div class="product-image-container">
                <img src="${rutaImagen}" 
                     alt="${producto.nombre}"
                     onerror="this.src='https://via.placeholder.com/300x300/000000/FFFFFF/?text=${encodeURIComponent(producto.nombre.substring(0, 20))}'; this.style.objectFit='contain';">
                <div class="quick-view"><i class="fas fa-eye"></i> Vista Rápida</div>
            </div>
            <div class="ProductInfo">
                <h3>${producto.nombre}</h3>
                <div class="product-rating">
                    ${estrellas}
                    <span>(${producto.rating})</span>
                </div>
                <p class="ProductDescription" style="white-space: pre-line;">${producto.descripcion}</p>
                
                ${selectorColor}
                ${selectorMemoria}
                
                <div class="product-footer">
                    <div class="price-stock">
                        <p class="ProductPrice">$${producto.precio.toLocaleString()} ${precioAnterior}</p>
                        <span class="ProductStock"><i class="fas fa-check-circle"></i> Stock: ${producto.stock}</span>
                    </div>
                    <button class="botonAddCart" data-product-id="${producto.id}"><i class="fas fa-cart-plus"></i> Agregar</button>
                    ${botonesAdmin}
                </div>
            </div>
        </div>
    `;
}

/**
 * Generar estrellas de rating
 * @param {number} rating - Rating del producto
 * @returns {string} - HTML de estrellas
 */
function generarEstrellas(rating) {
    let estrellas = '';
    const ratingEntero = Math.floor(rating);
    const tieneMedia = rating % 1 !== 0;
    
    for (let i = 0; i < ratingEntero; i++) {
        estrellas += '<i class="fas fa-star"></i>';
    }
    
    if (tieneMedia) {
        estrellas += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const estrellasVacias = 5 - Math.ceil(rating);
    for (let i = 0; i < estrellasVacias; i++) {
        estrellas += '<i class="far fa-star"></i>';
    }
    
    return estrellas;
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

// Sistema de versiones para forzar actualización de imágenes
const VERSION_IMAGENES = '5.0';
const VERSION_KEY = 'versionImagenesPhoneSpot';

// Verificar si necesitamos actualizar por nueva versión
const versionActual = localStorage.getItem(VERSION_KEY);
if (versionActual !== VERSION_IMAGENES) {
    console.log('🔄 Detectada nueva versión de imágenes. Actualizando productos...');
    localStorage.removeItem(DB_KEY);
    localStorage.setItem(VERSION_KEY, VERSION_IMAGENES);
}

// Asegurar que existan productos iniciales
if (!localStorage.getItem(DB_KEY)) {
    guardarProductos(obtenerProductosIniciales());
    console.log('📦 Productos iniciales cargados con imágenes actualizadas');
}

// ============================================================
// EXPORTAR FUNCIONES
// ============================================================
window.Productos = {
    obtenerProductos,
    cargarProductosDesdeBackend,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosPorCategoria,
    buscarProductos,
    obtenerProductoPorId,
    renderizarProductos,
    crearTarjetaProducto,
    actualizarStock,
    validarStockCarrito,
    procesarCompra,
    obtenerMovimientosStock,
    obtenerHistorialCompras
};

console.log('📦 Sistema de gestión de productos cargado');

