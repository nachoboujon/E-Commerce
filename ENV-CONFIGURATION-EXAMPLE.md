# 🔐 CONFIGURACIÓN DE VARIABLES DE ENTORNO

## ⚠️ IMPORTANTE
Copia este contenido a un archivo `.env` en la raíz del proyecto y completa con tus valores reales.

**NUNCA compartas tu archivo .env en Git.**

---

## 📋 Archivo `.env` Completo

```env
# ====================================================================
# 🗄️ DATABASE - MongoDB
# ====================================================================
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/phonespot_db?retryWrites=true&w=majority
DB_NAME=phonespot_db

# ====================================================================
# 🔑 AUTENTICACIÓN - JWT
# ====================================================================
# Genera una clave segura con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=CAMBIAR_POR_UNA_CLAVE_MUY_SEGURA_Y_ALEATORIA_DE_AL_MENOS_64_CARACTERES
JWT_EXPIRES_IN=7d

# ====================================================================
# 📧 EMAIL - Nodemailer (Gmail)
# ====================================================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_de_16_caracteres
EMAIL_FROM="PhoneSpot <tu_email@gmail.com>"

# ====================================================================
# 🌐 FRONTEND
# ====================================================================
FRONTEND_URL=https://phonespott.netlify.app
ALLOWED_ORIGINS=https://phonespott.netlify.app,https://phonespotsj1.netlify.app

# ====================================================================
# 🚀 SERVIDOR
# ====================================================================
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# ====================================================================
# 🔒 RATE LIMITING
# ====================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# ====================================================================
# ⚡ CACHÉ
# ====================================================================
CACHE_TTL=600
```

---

## 🚀 Configuración por Entorno

### 🧪 Desarrollo (Local)

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/phonespot_db
PORT=3000
LOG_LEVEL=debug
```

### 🏭 Producción (Railway/Heroku)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/phonespot_db
PORT=$PORT
LOG_LEVEL=info
```

---

## 📝 Instrucciones Detalladas

### 1. JWT_SECRET

Genera una clave segura:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. MongoDB

**Opción A: MongoDB Atlas (Recomendado para producción)**
1. Crea cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. En "Database Access", crea un usuario
4. En "Network Access", agrega tu IP (o 0.0.0.0/0 para permitir todas)
5. Click en "Connect" → "Connect your application"
6. Copia la URI y reemplaza `<password>` con tu contraseña

**Opción B: MongoDB Local**
```bash
# Instalar MongoDB Community Edition
# Luego usar:
MONGODB_URI=mongodb://localhost:27017/phonespot_db
```

### 3. Email (Gmail)

1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Ingresa "PhoneSpot" y genera
4. Usa la contraseña de 16 caracteres generada

### 4. Variables en Railway

En Railway Dashboard:
1. Ve a tu proyecto → Variables
2. Agrega cada variable manualmente
3. O usa Railway CLI:

```bash
railway variables set JWT_SECRET=tu_secreto_seguro
railway variables set MONGODB_URI=tu_mongodb_uri
```

---

## ✅ Verificación

Para verificar que las variables están configuradas:

```bash
node -e "console.log(process.env.JWT_SECRET ? '✅ JWT_SECRET configurado' : '❌ JWT_SECRET falta')"
```

---

## 🛡️ Seguridad

- ✅ Usa contraseñas largas y aleatorias
- ✅ Nunca compartas el archivo .env
- ✅ Agrega .env a .gitignore
- ✅ Rota credenciales cada 3-6 meses
- ✅ Usa diferentes valores en dev/prod
- ✅ Limita acceso a MongoDB por IP

---

## ❓ Troubleshooting

**Error: JWT_SECRET no está configurado**
- Verifica que el archivo .env existe en la raíz
- Verifica que la variable está escrita correctamente
- En Railway, verifica que la variable está en el dashboard

**Error: No se puede conectar a MongoDB**
- Verifica la URI de conexión
- Verifica que tu IP está en la whitelist de MongoDB Atlas
- Verifica que el usuario/password son correctos

**Error: No se pueden enviar emails**
- Verifica que usas una "contraseña de aplicación", no tu contraseña de Gmail
- Verifica que 2FA está activado en Gmail
- Verifica que EMAIL_HOST y EMAIL_PORT son correctos

---

Última actualización: 30 de Octubre de 2025

