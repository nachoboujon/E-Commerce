# 🚀 Guía de Despliegue - PhoneSpot E-Commerce

## ⚠️ Problema Actual
El proyecto tiene dos partes:
1. **Frontend** (HTML/CSS/JS) - Se despliega en Netlify ✅
2. **Backend** (Node.js + MongoDB) - NO se puede desplegar en Netlify ❌

**Netlify solo sirve archivos estáticos**, por lo que el backend con MongoDB debe desplegarse por separado.

---

## 📋 Solución: Desplegar Backend y Frontend Por Separado

### Opción 1: Backend en Render (RECOMENDADO - Gratis)

#### Paso 1: Crear cuenta en Render
1. Ve a https://render.com
2. Regístrate con tu cuenta de GitHub

#### Paso 2: Preparar el Backend
1. Crea una carpeta `backend-deploy` con estos archivos:
   - `server.js`
   - `package.json`
   - Carpeta `backend/` completa

2. Crea un archivo `.env` en la raíz:
```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/phonespot_db
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
```

#### Paso 3: Crear Servicio en Render
1. En Render, click en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `phonespot-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

4. En "Environment Variables", agrega:
   - `MONGODB_URI`: Tu URL de MongoDB Atlas
   - `JWT_SECRET`: Una clave secreta
   - `NODE_VERSION`: `18`

5. Click en "Create Web Service"

#### Paso 4: Obtener URL del Backend
- Una vez desplegado, Render te dará una URL como:
  `https://phonespot-backend.onrender.com`

---

### Opción 2: Backend en Railway (Alternativa)

1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Conecta tu repositorio
4. Railway detectará automáticamente Node.js
5. Agrega las variables de entorno (MONGODB_URI, JWT_SECRET)
6. Obtendrás una URL como: `https://phonespot-backend.up.railway.app`

---

### Opción 3: MongoDB Atlas (Base de Datos en la Nube)

Si no tienes MongoDB en la nube:

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster gratuito (M0)
4. Click en "Connect" → "Connect your application"
5. Copia la URL de conexión:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/phonespot_db
   ```
6. Usa esta URL como `MONGODB_URI` en Render/Railway

---

## 🔧 Configurar Frontend (Netlify)

### Paso 1: Actualizar configuración
Abre `JavaScript/config.js` y actualiza la línea 27 con tu URL de backend:

```javascript
production: {
    BACKEND_URL: 'https://phonespot-backend.onrender.com/api', // Tu URL de Render/Railway
    USE_LOCAL_STORAGE: true,
    DEBUG: false
}
```

### Paso 2: Desplegar en Netlify

**Opción A: Desde Git (Recomendado)**
1. Sube tus cambios a GitHub:
   ```bash
   git add .
   git commit -m "Fix: Configurar backend para producción"
   git push origin master
   ```

2. En Netlify, el deploy se hará automáticamente

**Opción B: Drag & Drop Manual**
1. En Netlify, ve a "Deploys"
2. Arrastra toda la carpeta del proyecto
3. Netlify subirá los archivos nuevos

### Paso 3: Limpiar caché de Netlify
1. En Netlify, ve a tu sitio
2. Click en "Deploys" → "Trigger deploy" → "Clear cache and deploy"

---

## 🧹 Limpiar Caché del Navegador

Para ver los cambios en producción:

**Chrome/Edge:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Todo el tiempo"
3. Marca "Imágenes y archivos en caché"
4. Click en "Borrar datos"

**O Forzar recarga:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## ✅ Verificar que Todo Funciona

### 1. Verificar Backend
Abre en tu navegador:
```
https://phonespot-backend.onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor PhoneSpot funcionando correctamente",
  "database": "Conectada"
}
```

### 2. Verificar Frontend
1. Abre tu sitio de Netlify
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   ✅ Conectado al backend - Usando MongoDB
   ✅ Productos cargados desde backend: XX
   ```

---

## 🐛 Problemas Comunes

### "No se ven los cambios"
- Limpia el caché del navegador (Ctrl + Shift + R)
- En Netlify: "Clear cache and deploy"
- Verifica que subiste los cambios a GitHub

### "No se cargan los productos"
- Verifica que el backend está funcionando: `/api/health`
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que `JavaScript/config.js` tiene la URL correcta del backend

### "CORS error"
En tu backend (`server.js`), asegúrate de tener:
```javascript
const cors = require('cors');
app.use(cors({
    origin: ['https://tu-sitio.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
```

### "Backend dormido" (Render Free Tier)
El plan gratuito de Render pone tu backend a dormir después de 15 min de inactividad.
La primera carga puede tardar 30-60 segundos en despertar.

---

## 📝 Variables de Entorno en Netlify (Opcional)

Si quieres usar variables de entorno en Netlify:

1. En Netlify, ve a "Site settings" → "Environment variables"
2. Agrega:
   - Key: `BACKEND_URL`
   - Value: `https://phonespot-backend.onrender.com/api`

3. Crea un archivo `netlify/functions/config.js`:
```javascript
exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            backendUrl: process.env.BACKEND_URL
        })
    };
};
```

---

## 🎯 Resumen

1. ✅ **Backend**: Despliega en Render/Railway con MongoDB Atlas
2. ✅ **Frontend**: Actualiza `config.js` con la URL del backend
3. ✅ **Netlify**: Sube cambios y limpia caché
4. ✅ **Navegador**: Limpia caché (Ctrl + Shift + R)

---

## 📞 Soporte

Si sigues teniendo problemas:
1. Abre la consola del navegador (F12)
2. Copia los errores que aparecen
3. Revisa los logs del backend en Render/Railway

---

**Última actualización:** ${new Date().toLocaleDateString()}

