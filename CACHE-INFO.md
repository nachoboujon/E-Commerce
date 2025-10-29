# 📦 Sistema de Cache de Productos - PhoneSpot

## 🔄 Actualización Automática (Versión 6.0)

El sistema ahora incluye un mecanismo automático de actualización de cache:

- **Versión actual**: 6.0
- Cuando se incrementa la versión, el cache se limpia automáticamente
- Los productos se recargan desde MongoDB en cada visita

## 🎯 Prioridad de Carga

El sistema sigue este orden para cargar productos:

1. **MongoDB (Prioridad Alta)** ⭐
   - Intenta cargar siempre desde la base de datos primero
   - Los datos más actualizados

2. **localStorage (Fallback)** 💾
   - Solo se usa si MongoDB no está disponible
   - Sirve como cache para mejorar rendimiento

## 🛠️ Utilidades de Cache

### Comandos disponibles en la consola del navegador:

```javascript
// Ver información del cache actual
CacheUtils.ver()

// Limpiar cache y recargar desde MongoDB
CacheUtils.limpiar()

// Forzar recarga desde MongoDB sin limpiar
CacheUtils.recargar()
```

## 🔍 Debugging

Para ver logs detallados del proceso de carga:

1. Abre la consola del navegador (F12 → Console)
2. Recarga la página
3. Busca mensajes como:
   - ✅ "Productos cargados desde MongoDB"
   - 📦 "Productos cargados desde localStorage"
   - 🔄 "Detectada nueva versión"

## 📝 Logs de Variantes

Cuando cambias color o memoria de un producto, verás logs como:

```
🔍 Buscando variante para: Color="X", Memoria="Y"
🔎 Comparando variante: {...}
✅ VARIANTE ENCONTRADA → Precio: $X, Stock: Y
```

Esto ayuda a diagnosticar si las variantes están configuradas correctamente.

## ⚠️ Solución de Problemas

### Problema: Los cambios en MongoDB no se reflejan

**Solución 1**: Espera a que se incremente la versión automáticamente
**Solución 2**: Ejecuta en consola:
```javascript
CacheUtils.limpiar()
```

### Problema: Los selectores están vacíos

**Causa**: Las variantes no tienen color o memoria definidos
**Solución**: Verifica que las variantes en MongoDB tengan los campos `color` y `memoria` completos

### Problema: El stock no se actualiza

**Causa**: El producto tiene variantes pero la combinación color+memoria no coincide exactamente
**Solución**: Abre consola y revisa los logs de comparación de variantes

## 🚀 Incrementar Versión Manualmente

Si necesitas forzar una actualización para todos los usuarios:

1. Abre `JavaScript/productos.js`
2. Busca `const VERSION_PRODUCTOS`
3. Incrementa el número (ej: de 6.0 a 6.1)
4. Guarda y haz commit

Todos los usuarios limpiarán su cache automáticamente en la próxima visita.

## 📊 Monitoreo

El sistema registra en consola:
- ✅ Cargas exitosas desde MongoDB
- ❌ Errores de conexión
- 📦 Uso de fallback (localStorage)
- 💾 Actualizaciones de cache
- 🔄 Cambios de versión

