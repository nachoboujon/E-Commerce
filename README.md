# 🛒 PhoneSpot E-Commerce

Sistema completo de e-commerce con frontend HTML/CSS/JS y backend Node.js + Express + MongoDB.

---

## 🚨 ¿Problemas al Desplegar en Netlify?

Si los cambios no se visualizan en Netlify o los productos no se actualizan:

1. **Solución Rápida (5 min):** Lee [README-DEPLOYMENT.md](README-DEPLOYMENT.md)
2. **Guía Completa de Despliegue:** Lee [DEPLOY.md](DEPLOY.md)

**TL;DR:** Netlify solo sirve archivos estáticos. El backend necesita desplegarse por separado en Render/Railway.

---

## 📁 Estructura del Proyecto

```
E-Commerce/
│
├── 📂 HTML/                    # Páginas del sitio
│   ├── index.html (raíz)       # Página principal
│   ├── admin.html              # Panel de administración
│   ├── login.html              # Inicio de sesión
│   ├── registro.html           # Registro de usuarios
│   ├── Carrito.html            # Carrito de compras
│   ├── perfil.html             # Perfil de usuario
│   ├── celulares.html          # Catálogo celulares
│   ├── tablets.html            # Catálogo tablets
│   ├── notebooks.html          # Catálogo notebooks
│   ├── accesorios.html         # Catálogo accesorios
│   ├── ofertas.html            # Productos en oferta
│   └── contacto.html           # Formulario de contacto
│
├── 📂 JavaScript/              # Scripts del frontend
│   ├── auth.js                 # Autenticación
│   ├── productos.js            # Gestión de productos
│   ├── email-service.js        # Servicio de emails
│   └── update-contact-info.js  # Actualización de contacto
│
├── 📂 IMG/                     # Imágenes
│   ├── Phonestpot.jpg          # Logo
│   └── Note 14 Pro.png         # Imagen de productos
│
├── 📂 Style/                   # Estilos CSS
│   ├── style.css (raíz)        # Estilos principales
│   └── styleCarrito.css        # Estilos del carrito
│
├── 📂 backend/                 # Backend Node.js
│   ├── models/                 # Modelos de MongoDB
│   │   ├── Usuario.js          # Modelo de usuarios
│   │   ├── Producto.js         # Modelo de productos
│   │   └── Orden.js            # Modelo de órdenes
│   │
│   ├── routes/                 # Rutas de la API
│   │   ├── auth.js             # Autenticación
│   │   ├── productos.js        # CRUD productos
│   │   ├── ordenes.js          # Gestión órdenes
│   │   └── usuarios.js         # Gestión usuarios
│   │
│   ├── middleware/             # Middlewares
│   │   └── auth.js             # Verificación JWT
│   │
│   └── init-database.js        # Script inicialización
│
├── 📂 docs/                    # Documentación
│   ├── README_DATABASE.md      # Guía completa de BD
│   └── INSTRUCCIONES_RAPIDAS.txt
│
├── 📂 config/                  # Configuración
│   └── .env.example            # Ejemplo de variables
│
├── 📄 server.js                # Servidor principal
├── 📄 index.js                 # JavaScript principal frontend
├── 📄 package.json             # Dependencias Node.js
├── 📄 .env                     # Variables de entorno (no subir a git)
└── 📄 .gitignore               # Archivos ignorados por git
```

---

## 🚀 Inicio Rápido

### 1️⃣ **Instalar MongoDB**
```
🔗 https://www.mongodb.com/try/download/community
```

### 2️⃣ **Instalar dependencias** (ya hecho ✅)
```bash
npm install
```

### 3️⃣ **Inicializar base de datos**
```bash
node backend/init-database.js
```

### 4️⃣ **Iniciar servidor**
```bash
npm start
```

### 5️⃣ **Abrir en el navegador**
```
http://localhost:3000
```

---

## 🔐 Credenciales de Administrador

```
Usuario: admin
Email: nboujon7@gmail.com
Contraseña: Nacho2005
```

---

## 📡 API Endpoints

### Autenticación:
- `POST /api/auth/registro` - Registrar usuario (envía email de verificación)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verificar-email` - Verificar cuenta con código
- `POST /api/auth/reenviar-codigo` - Reenviar código de verificación
- `GET /api/auth/perfil` - Obtener perfil del usuario
- `PUT /api/auth/perfil` - Actualizar perfil

### Productos:
- `GET /api/productos` - Obtener productos (con filtros)
  - `?marca=Apple` - Filtrar por marca
  - `?memoria=256GB` - Filtrar por memoria
  - `?categoria=Celulares` - Filtrar por categoría
  - `?busqueda=iPhone` - Buscar por texto
- `GET /api/productos/:id` - Obtener producto específico
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/:id` - Actualizar producto (admin)
- `DELETE /api/productos/:id` - Eliminar producto (admin)

### Órdenes:
- `POST /api/ordenes` - Crear orden (envía emails automáticos)
- `GET /api/ordenes/mis-ordenes` - Mis órdenes
- `GET /api/ordenes` - Todas las órdenes (admin)
- `GET /api/ordenes/:id` - Orden específica
- `PATCH /api/ordenes/:id/estado` - Actualizar estado (admin)

### Otros:
- `GET /api/health` - Estado del servidor
- `GET /api/usuarios` - Gestión de usuarios (admin)

📚 **Documentación completa:** 
- [docs/README_DATABASE.md](docs/README_DATABASE.md) - Base de datos
- [docs/NUEVAS_FUNCIONALIDADES.md](docs/NUEVAS_FUNCIONALIDADES.md) - Funcionalidades nuevas
- [docs/CONFIGURACION_EMAIL.md](docs/CONFIGURACION_EMAIL.md) - Configurar emails

---

## 🛠️ Tecnologías

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome, Bootstrap
- Fetch API para consumir la API REST

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (Autenticación con tokens)
- Bcrypt (Encriptación de contraseñas)
- Nodemailer (Sistema de emails)

## ✨ Funcionalidades Destacadas

### 🔍 Filtros Inteligentes de Productos
- Filtrar por **marca** (Apple, Samsung, Google, Xiaomi, etc.)
- Filtrar por **memoria** (128GB, 256GB, 512GB, etc.)
- Filtrar por **categoría** (Celulares, Tablets, Notebooks, Accesorios)
- Búsqueda por **texto** en nombre y descripción
- Productos **sin stock automáticamente al final** del listado

### 📧 Sistema de Emails Automáticos
- **Email de verificación** al registrarse (código de 6 dígitos, válido 24h)
- **Email de confirmación** al cliente con cada compra
- **Email de notificación** al administrador con cada venta
- Templates HTML profesionales y responsive
- Soporte para Gmail SMTP

### 🔐 Verificación de Cuenta
- Código de verificación de 6 dígitos
- Envío automático por email al registrarse
- Opción de reenviar código
- Expiración de 24 horas

### 📦 Gestión de Stock
- Productos sin stock **visualmente diferenciados**
- Ordenamiento automático: stock disponible primero
- Validación de stock antes de comprar
- Reducción automática de stock en cada compra
- Información de stock en respuesta del API

---

## 👨‍💻 Desarrollador

**Nacho Boujon**  
📧 nboujon7@gmail.com  
📍 San José, Entre Ríos

---

## 📝 Licencia

ISC © 2025 PhoneSpot

---

✅ **¡Sistema Completo Listo para Usar!** 🎉

