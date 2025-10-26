# 🐍 SCRIPTS DE PYTHON PARA PHONESPOT

## 📋 Descripción

Este directorio contiene scripts en Python para interactuar con tu backend de PhoneSpot desde línea de comandos o automatizaciones.

---

## 🚀 INSTALACIÓN

### 1. Instalar Python

Si no tienes Python instalado:
- **Windows:** Descarga desde [python.org](https://www.python.org/downloads/)
- **Mac/Linux:** Generalmente ya viene instalado

### 2. Instalar dependencias

```bash
# Navegar a la carpeta del proyecto
cd C:\Users\Nacho\OneDrive\Escritorio\E-Commerce

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install requests python-dotenv
```

---

## 📝 SCRIPTS DISPONIBLES

### `ejemplo_python.py`

Script de demostración que muestra cómo:
- ✅ Conectarse a la API
- ✅ Hacer login como administrador
- ✅ Obtener productos
- ✅ Obtener órdenes
- ✅ Ver estadísticas
- ✅ Actualizar stock
- ✅ Cambiar estado de órdenes
- ✅ Exportar datos a CSV

---

## 🎯 USO BÁSICO

### Ejecutar el script de ejemplo:

```bash
python scripts/ejemplo_python.py
```

**Salida esperada:**
```
🚀 PhoneSpot E-Commerce - Script Python
============================================================

1️⃣ Iniciando sesión como administrador...
✅ Login exitoso como: Administrador

2️⃣ Obteniendo productos...
📦 Productos obtenidos: 26

============================================================
📊 REPORTE DE PRODUCTOS
============================================================

📦 Celulares: 6 productos
   Stock total: 63 unidades
   Valor inventario: USD $2,047,750.00

📦 Tablets: 5 productos
   Stock total: 57 unidades
   Valor inventario: USD $11,575,000.00

...

✅ Script completado
```

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

Puedes configurar las credenciales en el archivo `.env`:

```env
BACKEND_URL=http://localhost:3000/api
ADMIN_EMAIL=admin@phonespot.com
ADMIN_PASSWORD=admin123
```

---

## 💡 EJEMPLOS DE USO

### 1. Crear tu propio script

```python
from scripts.ejemplo_python import PhoneSpotAPI

# Conectar a la API
api = PhoneSpotAPI()

# Login
api.login('admin@phonespot.com', 'admin123')

# Obtener productos de una categoría
celulares = api.obtener_productos(categoria='Celulares')

# Ver stock bajo
for producto in celulares:
    if producto['stock'] < 5:
        print(f"⚠️ Stock bajo: {producto['nombre']} - {producto['stock']} unidades")
```

### 2. Script de actualización masiva de stock

```python
from scripts.ejemplo_python import PhoneSpotAPI

api = PhoneSpotAPI()
api.login('admin@phonespot.com', 'admin123')

# Aumentar stock de todos los productos en 10 unidades
productos = api.obtener_productos()

for producto in productos:
    producto_id = producto['id']
    stock_actual = producto['stock']
    nuevo_stock = stock_actual + 10
    
    api.actualizar_stock(producto_id, nuevo_stock)
    print(f"✅ {producto['nombre']}: {stock_actual} → {nuevo_stock}")
```

### 3. Script de reporte diario

```python
from scripts.ejemplo_python import PhoneSpotAPI
from datetime import datetime

api = PhoneSpotAPI()
api.login('admin@phonespot.com', 'admin123')

# Obtener estadísticas
stats = api.obtener_estadisticas()

# Obtener órdenes pendientes
ordenes_pendientes = api.obtener_ordenes(estado='pendiente')

# Generar reporte
print(f"\n📊 REPORTE DIARIO - {datetime.now().strftime('%d/%m/%Y')}")
print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print(f"Órdenes pendientes: {len(ordenes_pendientes)}")
print(f"Ventas del mes: USD ${stats['ventasMensuales']:,.2f}")
print(f"Total órdenes: {stats['totalOrdenes']}")
```

### 4. Exportar inventario a CSV

```python
from scripts.ejemplo_python import PhoneSpotAPI, exportar_productos_csv

api = PhoneSpotAPI()
api.login('admin@phonespot.com', 'admin123')

productos = api.obtener_productos()
exportar_productos_csv(productos, 'inventario_actual.csv')
```

---

## 🔌 INTEGRACIÓN CON OTRAS HERRAMIENTAS

### Excel / Google Sheets

Puedes usar Python para:
- Exportar datos a Excel
- Leer planillas de stock
- Generar reportes automáticos

```python
import pandas as pd
from scripts.ejemplo_python import PhoneSpotAPI

api = PhoneSpotAPI()
api.login('admin@phonespot.com', 'admin123')

productos = api.obtener_productos()

# Convertir a DataFrame de pandas
df = pd.DataFrame(productos)

# Exportar a Excel
df.to_excel('productos.xlsx', index=False)
```

### Automatización con Cron/Task Scheduler

**Linux/Mac (cron):**
```bash
# Ejecutar reporte diario a las 9 AM
0 9 * * * python /ruta/al/proyecto/scripts/ejemplo_python.py
```

**Windows (Task Scheduler):**
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Configurar trigger (diario/semanal)
4. Acción: Ejecutar `python scripts/ejemplo_python.py`

---

## 📚 API REFERENCE

### Clase `PhoneSpotAPI`

#### `login(email, password)`
Iniciar sesión y obtener token JWT

#### `obtener_productos(categoria=None)`
Obtener lista de productos, opcionalmente filtrados por categoría

#### `obtener_ordenes(estado=None)`
Obtener órdenes (requiere permisos de admin)

#### `obtener_estadisticas()`
Obtener estadísticas de ventas

#### `actualizar_stock(producto_id, nuevo_stock)`
Actualizar stock de un producto

#### `actualizar_estado_orden(orden_id, nuevo_estado)`
Actualizar estado de una orden

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: `ModuleNotFoundError: No module named 'requests'`
```bash
pip install requests python-dotenv
```

### Error: `Connection refused`
- Verifica que el servidor Node.js esté corriendo
- Confirma que el puerto sea el correcto (3000)

### Error: `401 Unauthorized`
- Verifica las credenciales en `.env`
- Asegúrate de hacer login antes de otras operaciones

---

## 💡 IDEAS DE SCRIPTS

1. **Alertas de stock bajo:** Enviar email cuando un producto tenga menos de 5 unidades
2. **Backup automático:** Exportar productos y órdenes diariamente
3. **Actualización de precios:** Aplicar descuentos o aumentos masivos
4. **Reportes automáticos:** Enviar estadísticas diarias por email
5. **Integración con otros sistemas:** Sincronizar con ERP o CRM

---

## 🤝 CONTRIBUIR

Si creas scripts útiles, compártelos con el equipo!

---

**¡Ahora tienes el poder de Python + Node.js para tu e-commerce!** 🚀

