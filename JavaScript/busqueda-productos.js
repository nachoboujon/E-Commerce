/* =================================================================
   SISTEMA DE BÚSQUEDA DE PRODUCTOS - PHONESPOT
   ================================================================= */

/**
 * Inicializar sistema de búsqueda
 */
function inicializarBusqueda() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (!searchInput) return;
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function(e) {
        const termino = e.target.value.trim();
        
        if (termino.length === 0) {
            // Mostrar todos los productos
            if (window.Productos) {
                const productos = Productos.obtenerProductos();
                Productos.renderizarProductos(productos);
            }
        } else if (termino.length >= 2) {
            // Buscar cuando haya al menos 2 caracteres
            buscarProductos(termino);
        }
    });
    
    // Búsqueda al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const termino = e.target.value.trim();
            if (termino.length >= 2) {
                buscarProductos(termino);
            }
        }
    });
}

/**
 * Buscar productos por término
 * @param {string} termino - Término de búsqueda
 */
function buscarProductos(termino) {
    if (!window.Productos) {
        console.error('Sistema de productos no disponible');
        return;
    }
    
    const resultados = Productos.buscarProductos(termino);
    
    // Renderizar resultados
    const contenedor = document.querySelector('.ContentProducts');
    if (!contenedor) return;
    
    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 60px; color: var(--crl-light-gray); margin-bottom: 20px;"></i>
                <h3 style="color: var(--crl-gray); margin-bottom: 10px;">No se encontraron productos</h3>
                <p style="color: var(--crl-gray);">Intenta con otros términos de búsqueda</p>
                <button onclick="limpiarBusqueda()" style="margin-top: 20px; padding: 12px 30px; background: var(--crl-black); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-times"></i> Limpiar búsqueda
                </button>
            </div>
        `;
    } else {
        // Mostrar cantidad de resultados
        const header = document.querySelector('.main-header h2');
        if (header) {
            header.innerHTML = `<i class="fas fa-search"></i> ${resultados.length} resultado(s) para "${termino}"`;
        }
        
        Productos.renderizarProductos(resultados);
        
        // Scroll al inicio de resultados
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Limpiar búsqueda y mostrar todos los productos
 */
function limpiarBusqueda() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const header = document.querySelector('.main-header h2');
    if (header) {
        const pagina = window.location.pathname;
        
        if (pagina.includes('celulares')) {
            header.innerHTML = '<i class="fas fa-mobile-alt"></i> Celulares';
        } else if (pagina.includes('tablets')) {
            header.innerHTML = '<i class="fas fa-tablet-alt"></i> Tablets';
        } else if (pagina.includes('notebooks')) {
            header.innerHTML = '<i class="fas fa-laptop"></i> Notebooks';
        } else if (pagina.includes('accesorios')) {
            header.innerHTML = '<i class="fas fa-headphones"></i> Accesorios';
        } else if (pagina.includes('ofertas')) {
            header.innerHTML = '<i class="fas fa-tag"></i> Ofertas';
        } else {
            header.innerHTML = '<i class="fas fa-box-open"></i> Productos Destacados';
        }
    }
    
    if (window.Productos) {
        const productos = Productos.obtenerProductos();
        Productos.renderizarProductos(productos);
    }
}

/**
 * Búsqueda avanzada con filtros
 * @param {Object} filtros - Filtros de búsqueda
 */
function buscarConFiltros(filtros) {
    if (!window.Productos) return;
    
    let productos = Productos.obtenerProductos();
    
    // Filtrar por término
    if (filtros.termino) {
        productos = productos.filter(p => 
            p.nombre.toLowerCase().includes(filtros.termino.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(filtros.termino.toLowerCase())
        );
    }
    
    // Filtrar por categoría
    if (filtros.categoria) {
        productos = productos.filter(p => p.categoria === filtros.categoria);
    }
    
    // Filtrar por rango de precio
    if (filtros.precioMin !== undefined) {
        productos = productos.filter(p => p.precio >= filtros.precioMin);
    }
    
    if (filtros.precioMax !== undefined) {
        productos = productos.filter(p => p.precio <= filtros.precioMax);
    }
    
    // Filtrar por marca
    if (filtros.marca) {
        productos = productos.filter(p => p.marca === filtros.marca);
    }
    
    // Filtrar por condición
    if (filtros.condicion) {
        productos = productos.filter(p => p.condicion === filtros.condicion);
    }
    
    // Filtrar solo con stock
    if (filtros.soloStock) {
        productos = productos.filter(p => p.stock > 0);
    }
    
    // Ordenar resultados
    if (filtros.ordenar) {
        switch(filtros.ordenar) {
            case 'precio-asc':
                productos.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                productos.sort((a, b) => b.precio - a.precio);
                break;
            case 'nombre':
                productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'rating':
                productos.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'stock':
                productos.sort((a, b) => b.stock - a.stock);
                break;
        }
    }
    
    return productos;
}

// Exportar funciones
window.Busqueda = {
    inicializar: inicializarBusqueda,
    buscar: buscarProductos,
    limpiar: limpiarBusqueda,
    buscarConFiltros: buscarConFiltros
};

// Inicializar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusqueda);
} else {
    inicializarBusqueda();
}

console.log('🔍 Sistema de búsqueda cargado');

