# 🚀 CÓMO HACER TU TIENDA COMPLETAMENTE DINÁMICA

## ⚠️ PROBLEMA ACTUAL

Netlify **NO ejecuta tu servidor Node.js**, solo sirve archivos estáticos (HTML, CSS, JS).

Por eso los productos no se actualizan automáticamente.

---

## ✅ SOLUCIÓN: Backend + Base de Datos en la Nube

### PASO 1: Crear Base de Datos en MongoDB Atlas (GRATIS)

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un cluster (selecciona el plan GRATIS - M0)
4. Espera 3-5 minutos a que se cree
5. Haz clic en "Connect" → "Connect your application"
6. Copia la cadena de conexión (se verá así):
   ```
   mongodb+srv://usuario:<password>@cluster.mongodb.net/phonespot_db
   ```
7. Reemplaza `<password>` con tu contraseña

### PASO 2: Subir Backend a Render.com (GRATIS)

1. Ve a https://render.com y crea una cuenta
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name:** phonespot-backend
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGODB_URI` = (pega la URL de MongoDB Atlas)
     - `PORT` = 3000
     - `JWT_SECRET` = (inventa una clave secreta)

5. Haz clic en "Create Web Service"
6. Espera 5-10 minutos al deployment
7. Copia la URL de tu backend (ej: `https://phonespot-backend.onrender.com`)

### PASO 3: Actualizar Frontend

Abre el archivo `JavaScript/api-service.js` y cambia esta línea:

**ANTES:**
```javascript
baseURL: 'http://localhost:3000/api',
```

**DESPUÉS:**
```javascript
baseURL: 'https://TU-BACKEND-URL.onrender.com/api',
```

### PASO 4: Subir a Netlify

```bash
git add .
git commit -m "Conectar con backend en la nube"
git push
```

---

## 🎉 RESULTADO FINAL

✅ **Totalmente dinámico y automático**
✅ Agregas productos desde el admin → Aparecen instantáneamente
✅ Funciona en cualquier dispositivo
✅ Base de datos en la nube
✅ Todo GRATIS

---

## 📊 FLUJO DE TRABAJO

1. Abres tu admin: `https://tu-sitio.netlify.app/HTML/admin.html`
2. Agregas/editas productos
3. Se guardan en MongoDB Atlas (nube)
4. **Aparecen automáticamente** en tu tienda
5. ¡Sin necesidad de exportar ni hacer nada manual!

---

## 🔧 ALTERNATIVA MÁS RÁPIDA (Mientras configuras lo anterior)

### Configurar servidor local temporalmente

Si necesitas que funcione YA mientras configuras la nube:

1. Asegúrate de tener MongoDB corriendo localmente
2. Inicia tu servidor:
   ```bash
   npm start
   ```
3. Abre tu navegador en `http://localhost:3000`
4. Los productos se cargarán desde MongoDB local

**IMPORTANTE:** Esto solo funciona en tu computadora. Para que funcione en internet, necesitas la solución de arriba.

---

## 🆘 SI TIENES PROBLEMAS

### Error: "No se puede conectar al servidor"
- Verifica que el servidor esté corriendo
- Verifica la URL en `api-service.js`

### Error: "Cannot connect to MongoDB"
- Verifica tu cadena de conexión
- Verifica que permitas tu IP en MongoDB Atlas (Network Access)

### Los productos no aparecen
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica que el backend esté corriendo

---

## 💡 RESUMEN

**SIN backend en la nube:**
- ❌ Productos hardcodeados
- ❌ Necesitas exportar manualmente
- ❌ No es dinámico

**CON backend en la nube:**
- ✅ Completamente dinámico
- ✅ Actualización automática
- ✅ Base de datos real
- ✅ Panel de admin funcional
- ✅ ¡Todo profesional!

---

**Tiempo total de configuración:** 20-30 minutos
**Costo:** $0 (todo gratis)
**Dificultad:** Fácil (solo seguir pasos)

