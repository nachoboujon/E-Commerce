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
    // ✅ SIEMPRE intentar cargar desde MongoDB primero
    if (window.BACKEND_DISPONIBLE && window.APIService) {
        try {
            console.log('🔄 Cargando productos desde MongoDB (prioridad alta)...');
            const productos = await window.APIService.obtenerProductos();
            
            if (productos && productos.length > 0) {
                // Guardar en localStorage como cache
                localStorage.setItem(DB_KEY, JSON.stringify(productos));
                console.log('✅ Productos cargados desde MongoDB:', productos.length);
                console.log('💾 Cache actualizado en localStorage');
                return productos;
            } else {
                console.warn('⚠️ MongoDB retornó 0 productos, usando localStorage como fallback');
            }
        } catch (error) {
            console.error('❌ Error al cargar desde MongoDB:', error.message);
            console.log('📦 Usando localStorage como fallback...');
        }
    } else {
        console.warn('⚠️ Backend no disponible o APIService no cargado');
        console.log('📦 Usando productos locales...');
    }
    
    // Fallback: usar productos locales
    const productosLocales = obtenerProductos();
    console.log(`📦 Productos cargados desde localStorage/iniciales: ${productosLocales.length}`);
    return productosLocales;
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
    
    // ⚠️ IMPORTANTE: Usar setTimeout para asegurar que el DOM se actualice ANTES de agregar listeners
    setTimeout(() => {
        // Inicializar cambio de precio dinámico para variantes
        inicializarCambioPrecio();
        
        // Reinicializar event listeners
        if (window.inicializarEventos) {
            window.inicializarEventos();
        }
    }, 100);
}

/**
 * Inicializar event listeners para cambio de precio dinámico
 * NOTA: Los onchange ahora están INLINE en el HTML, esta función inicializa precios y filtros
 */
function inicializarCambioPrecio() {
    console.log('🎯 INICIALIZANDO PRECIOS Y FILTROS DE VARIANTES');
    
    // Solo inicializar precios de productos con variantes
    const productosConVariantes = new Set();
    document.querySelectorAll('.variant-selector').forEach(selector => {
        productosConVariantes.add(selector.dataset.productId);
    });
    
    console.log(`📦 Productos con variantes: ${productosConVariantes.size}`);
    
    productosConVariantes.forEach(productoId => {
        console.log(`⚙️ Inicializando: ${productoId}`);
        
        // ✅ IMPORTANTE: Aplicar filtrado inicial basado en el color por defecto
        const producto = obtenerProductoPorId(productoId);
        if (producto && producto.variantes && producto.variantes.length > 0) {
            // Verificar si tiene variantes completas (con color Y memoria)
            const variantesCompletas = producto.variantes.filter(v => 
                v.color && v.color.trim() !== '' && 
                v.memoria && v.memoria.trim() !== ''
            );
            
            if (variantesCompletas.length > 0) {
                console.log(`🔄 Aplicando filtrado inicial para ${productoId}`);
                actualizarSelectoresDinamicos(productoId, 'color');
            }
        }
        
        // Actualizar precio inicial
        actualizarPrecioProducto(productoId);
    });
    
    console.log('✅ PRECIOS Y FILTROS INICIALES LISTOS');
}

/**
 * Actualizar selectores dinámicamente según selección actual
 * @param {string} productoId - ID del producto
 * @param {string} selectorCambiado - Qué selector cambió ('color' o 'memoria')
 */
function actualizarSelectoresDinamicos(productoId, selectorCambiado = 'color') {
    console.log(`🔄 Actualizando selectores dinámicos para ${productoId} (cambió: ${selectorCambiado})`);
    
    const producto = obtenerProductoPorId(productoId);
    if (!producto || !producto.variantes || producto.variantes.length === 0) {
        console.log(`ℹ️ Producto sin variantes configuradas, no se filtran selectores`);
        return;
    }
    
    const colorSelector = document.querySelector(`.color-selector[data-product-id="${productoId}"]`);
    const memoriaSelector = document.querySelector(`.memory-selector[data-product-id="${productoId}"]`);
    
    if (!colorSelector && !memoriaSelector) {
        console.log(`⚠️ No se encontraron selectores para el producto ${productoId}`);
        return;
    }
    
    // ✅ VALIDACIÓN: Solo filtrar si las variantes tienen TANTO color COMO memoria
    // Verificar que al menos una variante tenga ambos campos completos
    const variantesCompletas = producto.variantes.filter(v => 
        v.color && v.color.trim() !== '' && 
        v.memoria && v.memoria.trim() !== ''
    );
    
    if (variantesCompletas.length === 0) {
        console.log(`ℹ️ No hay variantes con color Y memoria definidos, no se filtran selectores`);
        return;
    }
    
    // ✅ Si llegamos aquí, tenemos variantes válidas para filtrar
    console.log(`✅ ${variantesCompletas.length} variantes completas encontradas, aplicando filtrado dinámico`);
    
    // Verificar que tenemos ambos selectores
    if (!colorSelector || !memoriaSelector) {
        console.log(`⚠️ Falta algún selector (color o memoria) para aplicar filtrado`);
        return;
    }
    
    // Si cambió el color, actualizar las opciones de memoria disponibles
    if (selectorCambiado === 'color' && colorSelector && memoriaSelector) {
        const colorSeleccionado = colorSelector.value.trim();
        console.log(`🎨 Color seleccionado: "${colorSeleccionado}"`);
        
        // Filtrar variantes que coincidan con el color seleccionado (con trim)
        const variantesDelColor = producto.variantes.filter(v => {
            const colorVariante = v.color ? v.color.trim() : '';
            const coincide = colorVariante === colorSeleccionado;
            console.log(`  Comparando: "${colorVariante}" === "${colorSeleccionado}" → ${coincide}`);
            return coincide;
        });
        
        console.log(`🔍 Variantes encontradas para color "${colorSeleccionado}":`, variantesDelColor.length);
        
        // Obtener memorias únicas disponibles para este color
        let memoriasDisponibles = [...new Set(variantesDelColor.map(v => v.memoria).filter(m => m && m.trim() !== ''))];
        
        console.log(`📋 Memorias filtradas para "${colorSeleccionado}":`, memoriasDisponibles);
        
        // ✅ VALIDACIÓN: Si no hay memorias filtradas, restaurar TODAS las del array base
        if (memoriasDisponibles.length === 0) {
            console.log(`⚠️ No hay variantes para el color "${colorSeleccionado}"`);
            
            // Restaurar todas las memorias del array base del producto
            const memoriasBase = producto.memorias || [];
            
            if (memoriasBase.length > 0) {
                console.log(`🔄 Restaurando memorias del array base:`, memoriasBase);
                memoriasDisponibles = memoriasBase;
            } else {
                console.log(`⚠️ No hay memorias base, extrayendo de todas las variantes`);
                memoriasDisponibles = [...new Set(producto.variantes.map(v => v.memoria).filter(m => m && m.trim() !== ''))];
            }
        }
        
        console.log(`📋 Memorias FINALES a mostrar:`, memoriasDisponibles);
        
        // Guardar la memoria actualmente seleccionada
        const memoriaActual = memoriaSelector.value;
        
        // Actualizar opciones del selector de memoria
        memoriaSelector.innerHTML = memoriasDisponibles.map(memoria => 
            `<option value="${memoria}">${memoria}</option>`
        ).join('');
        
        // Restaurar la selección si sigue disponible, sino seleccionar la primera
        if (memoriasDisponibles.includes(memoriaActual)) {
            memoriaSelector.value = memoriaActual;
        } else {
            memoriaSelector.value = memoriasDisponibles[0];
            console.log(`⚠️ Memoria "${memoriaActual}" no disponible para color "${colorSeleccionado}", cambiando a "${memoriasDisponibles[0]}"`);
        }
    }
    
    // Si cambió la memoria, actualizar las opciones de color disponibles
    if (selectorCambiado === 'memoria' && colorSelector && memoriaSelector) {
        const memoriaSeleccionada = memoriaSelector.value.trim();
        console.log(`💾 Memoria seleccionada: "${memoriaSeleccionada}"`);
        
        // Filtrar variantes que coincidan con la memoria seleccionada (con trim)
        const variantesDeLaMemoria = producto.variantes.filter(v => {
            const memoriaVariante = v.memoria ? v.memoria.trim() : '';
            const coincide = memoriaVariante === memoriaSeleccionada;
            console.log(`  Comparando: "${memoriaVariante}" === "${memoriaSeleccionada}" → ${coincide}`);
            return coincide;
        });
        
        console.log(`🔍 Variantes encontradas para memoria "${memoriaSeleccionada}":`, variantesDeLaMemoria.length);
        
        // Obtener colores únicos disponibles para esta memoria
        let coloresDisponibles = [...new Set(variantesDeLaMemoria.map(v => v.color).filter(c => c && c.trim() !== ''))];
        
        console.log(`📋 Colores filtrados para "${memoriaSeleccionada}":`, coloresDisponibles);
        
        // ✅ VALIDACIÓN: Si no hay colores filtrados, restaurar TODOS los del array base
        if (coloresDisponibles.length === 0) {
            console.log(`⚠️ No hay variantes para la memoria "${memoriaSeleccionada}"`);
            
            // Restaurar todos los colores del array base del producto
            const coloresBase = producto.colores || [];
            
            if (coloresBase.length > 0) {
                console.log(`🔄 Restaurando colores del array base:`, coloresBase);
                coloresDisponibles = coloresBase;
            } else {
                console.log(`⚠️ No hay colores base, extrayendo de todas las variantes`);
                coloresDisponibles = [...new Set(producto.variantes.map(v => v.color).filter(c => c && c.trim() !== ''))];
            }
        }
        
        console.log(`📋 Colores FINALES a mostrar:`, coloresDisponibles);
        
        // Guardar el color actualmente seleccionado
        const colorActual = colorSelector.value;
        
        // Actualizar opciones del selector de color
        colorSelector.innerHTML = coloresDisponibles.map(color => 
            `<option value="${color}">${color}</option>`
        ).join('');
        
        // Restaurar la selección si sigue disponible, sino seleccionar el primero
        if (coloresDisponibles.includes(colorActual)) {
            colorSelector.value = colorActual;
        } else {
            colorSelector.value = coloresDisponibles[0];
            console.log(`⚠️ Color "${colorActual}" no disponible para memoria "${memoriaSeleccionada}", cambiando a "${coloresDisponibles[0]}"`);
        }
    }
    
    console.log(`✅ Selectores actualizados`);
}

/**
 * Actualizar precio según variante seleccionada
 * @param {string} productoId - ID del producto
 */
function actualizarPrecioProducto(productoId) {
    console.log(`\n💰 ===== ACTUALIZANDO PRODUCTO ${productoId} =====`);
    
    const producto = obtenerProductoPorId(productoId);
    if (!producto) {
        console.error(`❌ Producto NO encontrado: ${productoId}`);
        return;
    }
    
    console.log(`✅ Producto encontrado: ${producto.nombre}`);
    
    // Obtener selección actual
    const colorSelector = document.querySelector(`.color-selector[data-product-id="${productoId}"]`);
    const memoriaSelector = document.querySelector(`.memory-selector[data-product-id="${productoId}"]`);
    
    const colorSeleccionado = colorSelector ? colorSelector.value : '';
    const memoriaSeleccionada = memoriaSelector ? memoriaSelector.value : '';
    
    console.log(`📋 Seleccionado: Color="${colorSeleccionado}", Memoria="${memoriaSeleccionada}"`);
    
    // Buscar precio y stock de la variante exacta (color + memoria)
    let precioVariante = producto.precio; // Precio base por defecto
    let stockVariante = producto.stock; // Stock base por defecto
    let bateriaVariante = producto.bateria || 'No especificado'; // Batería base
    
    // Si hay variantes configuradas, buscar coincidencia
    if (producto.variantes && producto.variantes.length > 0) {
        console.log(`🔍 Buscando variante para: Color="${colorSeleccionado}", Memoria="${memoriaSeleccionada}"`);
        console.log(`📋 Variantes configuradas (${producto.variantes.length}):`, producto.variantes);
        
        let varianteEncontrada = null;
        
        // SOLO buscar variante si hay selección de color O memoria
        if (colorSeleccionado || memoriaSeleccionada) {
            // Buscar coincidencia EXACTA (con trim para eliminar espacios)
            varianteEncontrada = producto.variantes.find(v => {
                const colorVariante = v.color ? v.color.trim() : '';
                const memoriaVariante = v.memoria ? v.memoria.trim() : '';
                const colorBuscado = colorSeleccionado ? colorSeleccionado.trim() : '';
                const memoriaBuscada = memoriaSeleccionada ? memoriaSeleccionada.trim() : '';
                
                const colorCoincide = !colorBuscado || colorVariante === colorBuscado;
                const memoriaCoincide = !memoriaBuscada || memoriaVariante === memoriaBuscada;
                
                // DEBUG: Log de comparación
                if (colorBuscado || memoriaBuscada) {
                    console.log(`  🔎 Comparando variante:`, {
                        varianteColor: colorVariante,
                        varianteMemoria: memoriaVariante,
                        buscadoColor: colorBuscado,
                        buscadoMemoria: memoriaBuscada,
                        colorCoincide,
                        memoriaCoincide,
                        resultado: colorCoincide && memoriaCoincide
                    });
                }
                
                return colorCoincide && memoriaCoincide;
            });
        }
        
        if (varianteEncontrada) {
            // ✅ SE ENCONTRÓ VARIANTE - Usar sus valores
            precioVariante = varianteEncontrada.precio !== undefined ? varianteEncontrada.precio : producto.precio;
            stockVariante = varianteEncontrada.stock !== undefined ? varianteEncontrada.stock : producto.stock;
            bateriaVariante = varianteEncontrada.bateria || bateriaVariante;
            
            console.log(`✅ VARIANTE ENCONTRADA:`);
            console.log(`   Color: ${varianteEncontrada.color}, Memoria: ${varianteEncontrada.memoria}`);
            console.log(`   → Precio: $${precioVariante}, Stock: ${stockVariante}, Batería: ${bateriaVariante}`);
        } else {
            // ❌ NO SE ENCONTRÓ VARIANTE - Usar valores BASE del producto
            console.log(`⚠️ NO hay variante para: Color="${colorSeleccionado}", Memoria="${memoriaSeleccionada}"`);
            console.log(`   → Usando VALORES BASE del producto:`);
            console.log(`   → Precio: $${precioVariante}, Stock: ${stockVariante}, Batería: ${bateriaVariante}`);
        }
    } else {
        console.log(`ℹ️ Producto sin variantes → Usando valores base: Precio=$${precioVariante}, Stock=${stockVariante}`);
    }
    
    // 🔍 Verificar stock disponible (considerando lo que hay en el carrito)
    const carritoStr = localStorage.getItem('carritoCell');
    const carrito = carritoStr ? JSON.parse(carritoStr) : [];
    const enCarrito = carrito.filter(item => {
        if (item.id !== productoId) return false;
        if (!item.varianteSeleccionada) return true;
        // Comparar variante específica (solo color y memoria, no batería)
        return item.varianteSeleccionada.color === colorSeleccionado &&
               item.varianteSeleccionada.memoria === memoriaSeleccionada;
    });
    const cantidadEnCarrito = enCarrito.reduce((sum, item) => sum + item.cantidad, 0);
    const stockDisponible = stockVariante - cantidadEnCarrito;
    const sinStock = stockDisponible <= 0;
    
    // ===== ACTUALIZAR PRECIO EN LA UI =====
    const precioElement = document.getElementById(`precio-${productoId}`);
    console.log(`Buscando elemento #precio-${productoId}:`, precioElement);
    
    if (precioElement) {
        const precioAnterior = producto.precioAnterior && precioVariante !== producto.precioAnterior
            ? `<span class="old-price">$${producto.precioAnterior.toLocaleString()}</span>`
            : '';
        
        console.log(`⏳ Actualizando precio en DOM: $${precioVariante}`);
        precioElement.innerHTML = `$${precioVariante.toLocaleString()} ${precioAnterior}`;
        precioElement.dataset.precioActual = precioVariante;
        precioElement.dataset.stockActual = stockVariante;
        console.log(`✅ PRECIO ACTUALIZADO: $${precioVariante}`);
    } else {
        console.error(`❌ ELEMENTO DE PRECIO NO ENCONTRADO: #precio-${productoId}`);
    }
    
    // Actualizar stock en la UI
    const productoCard = document.querySelector(`.Product[data-id="${productoId}"]`);
    if (productoCard) {
        const stockElement = productoCard.querySelector('.ProductStock');
        const botonAgregar = productoCard.querySelector('.botonAddCart');
        
        if (stockElement) {
            if (sinStock) {
                stockElement.innerHTML = '<i class="fas fa-times-circle"></i> Sin Stock';
                stockElement.style.color = '#f44336';
            } else {
                stockElement.innerHTML = `<i class="fas fa-check-circle"></i> Stock: ${stockDisponible}`;
                stockElement.style.color = '';
            }
        }
        
        if (botonAgregar) {
            if (sinStock) {
                botonAgregar.disabled = true;
                botonAgregar.innerHTML = '<i class="fas fa-ban"></i> Agotado';
                botonAgregar.style.background = '#ccc';
                botonAgregar.style.cursor = 'not-allowed';
                botonAgregar.style.opacity = '0.6';
            } else {
                botonAgregar.disabled = false;
                botonAgregar.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar';
                botonAgregar.style.background = '';
                botonAgregar.style.cursor = '';
                botonAgregar.style.opacity = '';
            }
        }
        
        // ===== ACTUALIZAR BATERÍA EN LA UI =====
        const bateriaElement = document.getElementById(`bateria-${productoId}`);
        console.log(`Buscando elemento #bateria-${productoId}:`, bateriaElement);
        
        if (bateriaElement) {
            console.log(`⏳ Actualizando batería en DOM: ${bateriaVariante}`);
            bateriaElement.textContent = bateriaVariante;
            console.log(`✅ BATERÍA ACTUALIZADA: ${bateriaVariante}`);
        } else {
            console.warn(`⚠️ Elemento de batería NO encontrado`);
        }
    } else {
        console.error(`❌ Tarjeta de producto NO encontrada con data-id="${productoId}"`);
    }
    
    console.log(`===== FIN ACTUALIZACIÓN ${productoId} =====\n`);
}

/**
 * Crear HTML de tarjeta de producto
 * @param {Object} producto - Datos del producto
 * @returns {string} - HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
    // 💰 Si hay variantes, usar la primera variante como precio/stock inicial
    let precioInicial = producto.precio;
    let stockInicial = producto.stock;
    
    if (producto.variantes && producto.variantes.length > 0) {
        const primeraVariante = producto.variantes[0];
        precioInicial = primeraVariante.precio || producto.precio;
        stockInicial = primeraVariante.stock || producto.stock;
    }
    
    // 🔍 Verificar stock disponible (considerando lo que hay en el carrito)
    const carritoStr = localStorage.getItem('carritoCell');
    const carrito = carritoStr ? JSON.parse(carritoStr) : [];
    const enCarrito = carrito.find(item => item.id === producto.id);
    const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
    const stockDisponible = stockInicial - cantidadEnCarrito;
    const sinStock = stockDisponible <= 0;
    
    // Crear badges (pueden ser múltiples)
    let badges = '';
    if (sinStock) {
        badges += '<div class="product-badge out-of-stock">⚠️ Agotado</div>';
    }
    if (producto.esNuevo) {
        badges += '<div class="product-badge">Nuevo</div>';
    }
    if (producto.enOferta) {
        badges += '<div class="product-badge sale">Oferta</div>';
    }
    if (producto.esAmericano) {
        badges += '<div class="product-badge americano">🇺🇸 Americano</div>';
    }
    
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
    
    // ✨ SELECTORES DE VARIANTES - Generados dinámicamente desde variantes o arrays base
    
    // Obtener opciones únicas de las variantes si existen
    let coloresDisponibles = [];
    let memoriasDisponibles = [];
    let bateriasDisponibles = [];
    
    // ✅ SIEMPRE usar los arrays base primero (colores y memorias)
    // Esto asegura que los selectores SIEMPRE se muestren si están definidos
    coloresDisponibles = producto.colores || [];
    memoriasDisponibles = producto.memorias || [];
    
    // Si NO hay arrays base pero SÍ hay variantes, extraer de las variantes
    if (coloresDisponibles.length === 0 && producto.variantes && producto.variantes.length > 0) {
        coloresDisponibles = [...new Set(producto.variantes.map(v => v.color).filter(c => c && c.trim() !== ''))];
        console.log(`📦 Producto ${producto.id}: Extrayendo colores desde variantes`);
    }
    if (memoriasDisponibles.length === 0 && producto.variantes && producto.variantes.length > 0) {
        memoriasDisponibles = [...new Set(producto.variantes.map(v => v.memoria).filter(m => m && m.trim() !== ''))];
        console.log(`📦 Producto ${producto.id}: Extrayendo memorias desde variantes`);
    }
    
    // Si hay variantes, también extraer baterías de ellas
    if (producto.variantes && producto.variantes.length > 0) {
        bateriasDisponibles = [...new Set(producto.variantes.map(v => v.bateria).filter(b => b && b.trim() !== ''))];
        console.log(`✅ Producto ${producto.id} tiene ${producto.variantes.length} variantes configuradas`);
    } else {
        bateriasDisponibles = [];
        console.log(`⚠️ Producto ${producto.id} sin variantes de precio`);
    }
    
    console.log(`📦 Selectores del producto ${producto.id}:`);
    console.log(`  - Colores: [${coloresDisponibles.join(', ')}]`);
    console.log(`  - Memorias: [${memoriasDisponibles.join(', ')}]`);
    
    // Generar selector de color con onchange que filtra memorias y actualiza precio
    const selectorColor = coloresDisponibles.length > 0 ? `
        <div class="product-variant">
            <label><i class="fas fa-palette"></i> Color:</label>
            <select class="variant-selector color-selector" 
                    data-product-id="${producto.id}" 
                    onchange="window.Productos.actualizarSelectoresDinamicos('${producto.id}', 'color'); window.Productos.actualizarPrecioProducto('${producto.id}')"
                    ontouchend="setTimeout(() => { window.Productos.actualizarSelectoresDinamicos('${producto.id}', 'color'); window.Productos.actualizarPrecioProducto('${producto.id}'); }, 100)">
                ${coloresDisponibles.map((color, index) => 
                    `<option value="${color}" ${index === 0 ? 'selected' : ''}>${color}</option>`
                ).join('')}
            </select>
        </div>
    ` : '';
    
    // Generar selector de memoria con onchange que filtra colores y actualiza precio
    const selectorMemoria = memoriasDisponibles.length > 0 ? `
        <div class="product-variant">
            <label><i class="fas fa-memory"></i> Memoria:</label>
            <select class="variant-selector memory-selector" 
                    data-product-id="${producto.id}" 
                    onchange="window.Productos.actualizarSelectoresDinamicos('${producto.id}', 'memoria'); window.Productos.actualizarPrecioProducto('${producto.id}')"
                    ontouchend="setTimeout(() => { window.Productos.actualizarSelectoresDinamicos('${producto.id}', 'memoria'); window.Productos.actualizarPrecioProducto('${producto.id}'); }, 100)">
                ${memoriasDisponibles.map((memoria, index) => 
                    `<option value="${memoria}" ${index === 0 ? 'selected' : ''}>${memoria}</option>`
                ).join('')}
            </select>
        </div>
    ` : '';
    
    // Obtener batería inicial de la primera variante
    const bateriaInicial = (producto.variantes && producto.variantes.length > 0) ? 
        (producto.variantes[0].bateria || producto.bateria) : producto.bateria;
    
    // Mostrar batería como texto informativo (NO selector)
    const textoBateria = (bateriaInicial || bateriasDisponibles.length > 0) ? `
        <div class="product-variant">
            <label><i class="fas fa-battery-full" style="color: #28a745;"></i> Batería:</label>
            <p class="battery-info" id="bateria-${producto.id}" style="margin: 8px 0; padding: 8px 12px; background: #f0f9f4; border-left: 3px solid #28a745; border-radius: 4px; font-weight: 600; color: #28a745;">
                ${bateriaInicial || 'No especificado'}
            </p>
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
            ${badges}
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
                ${textoBateria}
                
                <div class="product-footer">
                    <div class="price-stock">
                        <p class="ProductPrice" id="precio-${producto.id}" 
                           data-precio-base="${producto.precio}" 
                           data-precio-actual="${precioInicial}"
                           data-stock-actual="${stockInicial}">
                            $${precioInicial.toLocaleString()} ${precioAnterior}
                        </p>
                        ${sinStock ? 
                            '<span class="ProductStock" style="color: #f44336;"><i class="fas fa-times-circle"></i> Sin Stock</span>' :
                            `<span class="ProductStock"><i class="fas fa-check-circle"></i> Stock: ${stockDisponible}</span>`
                        }
                    </div>
                    ${sinStock ? 
                        '<button class="botonAddCart" disabled style="background: #ccc; cursor: not-allowed; opacity: 0.6;"><i class="fas fa-ban"></i> Agotado</button>' :
                        `<button class="botonAddCart" data-product-id="${producto.id}"><i class="fas fa-cart-plus"></i> Agregar</button>`
                    }
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

// Sistema de versiones para forzar actualización de productos
const VERSION_PRODUCTOS = '6.4'; // ⬆️ Fix CRÍTICO: let en lugar de const para reasignar arrays
const VERSION_KEY = 'versionProductosPhoneSpot';

// Verificar si necesitamos actualizar por nueva versión
const versionActual = localStorage.getItem(VERSION_KEY);
if (versionActual !== VERSION_PRODUCTOS) {
    console.log('🔄 Detectada nueva versión de productos. Limpiando cache...');
    localStorage.removeItem(DB_KEY);
    localStorage.setItem(VERSION_KEY, VERSION_PRODUCTOS);
    console.log('✅ Cache limpiado. Versión actualizada a:', VERSION_PRODUCTOS);
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
    obtenerHistorialCompras,
    actualizarPrecioProducto,  // ✅ EXPORTAR para uso desde HTML inline
    actualizarSelectoresDinamicos  // ✅ EXPORTAR para filtrado dinámico
};

console.log('📦 Sistema de gestión de productos cargado');

