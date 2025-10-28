# 🛠️ UTILIDADES DE DIAGNÓSTICO Y REPARACIÓN - RAILWAY

Este archivo contiene scripts útiles para diagnosticar y resolver problemas con el backend de Railway.

---

## 📋 TABLA DE CONTENIDOS

1. [Crear Admin Inicial](#1-crear-admin-inicial)
2. [Listar Usuarios](#2-listar-usuarios)
3. [Login y Guardar Sesión](#3-login-y-guardar-sesión)
4. [Limpiar Sesión Local](#4-limpiar-sesión-local)
5. [Diagnóstico Completo](#5-diagnóstico-completo)

---

## 1️⃣ CREAR ADMIN INICIAL

**Usar cuando:** No puedes iniciar sesión porque el usuario admin no existe en Railway.

**Cómo ejecutar:** Abre la consola del navegador (F12) y pega este código:

```javascript
fetch('https://phonespot-backend-production.up.railway.app/api/auth/crear-admin-inicial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => {
    console.clear();
    console.log('📦 RESPUESTA:', data);
    if (data.success) {
        console.log('\n✅ ADMIN CREADO!');
        console.log('Test password:', data.test_password);
        console.log('Email:', data.instrucciones.email);
        console.log('Password:', data.instrucciones.password);
    } else {
        console.log('\n❌ ERROR:', data.message);
        console.log('Detalles:', data.error);
    }
});
```

**Resultado esperado:**
```
✅ ADMIN CREADO!
Test password: Válida ✅
Email: nboujon7@gmail.com
Password: Nacho2005
```

---

## 2️⃣ LISTAR USUARIOS

**Usar cuando:** Quieres verificar qué usuarios existen en la base de datos.

**Cómo ejecutar:**

```javascript
fetch('https://phonespot-backend-production.up.railway.app/api/auth/listar-usuarios')
.then(r => r.json())
.then(data => {
    console.clear();
    console.log('👥 USUARIOS EN LA BASE DE DATOS\n');
    console.log('Total usuarios:', data.total);
    console.log('\n📋 Lista de usuarios:');
    data.usuarios.forEach((u, i) => {
        console.log(`${i + 1}. ${u.username} - ${u.email} - ${u.rol}`);
    });
});
```

**Resultado esperado:**
```
👥 USUARIOS EN LA BASE DE DATOS
Total usuarios: 1

📋 Lista de usuarios:
1. admin - nboujon7@gmail.com - administrador
```

---

## 3️⃣ LOGIN Y GUARDAR SESIÓN

**Usar cuando:** Quieres iniciar sesión y guardar el token JWT en localStorage.

**Cómo ejecutar:**

```javascript
fetch('https://phonespot-backend-production.up.railway.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        identificador: 'nboujon7@gmail.com',
        password: 'Nacho2005'
    })
})
.then(r => r.json())
.then(data => {
    console.clear();
    console.log('📦 LOGIN:', data);
    if (data.success && data.token) {
        console.log('\n✅ LOGIN EXITOSO!');
        console.log('Token:', data.token.substring(0, 50) + '...');
        
        localStorage.setItem('sesionPhoneSpot', JSON.stringify({
            username: data.sesion.username,
            rol: data.sesion.rol,
            nombre: data.sesion.nombre,
            email: data.sesion.email,
            token: data.token,
            loginTime: new Date().toISOString()
        }));
        
        console.log('💾 Sesión guardada en localStorage!');
        console.log('\n🎉 Ve al admin: http://127.0.0.1:5500/HTML/admin.html');
    } else {
        console.log('\n❌ ERROR:', data.message);
    }
});
```

**Resultado esperado:**
```
✅ LOGIN EXITOSO!
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI...
💾 Sesión guardada en localStorage!
🎉 Ve al admin: http://127.0.0.1:5500/HTML/admin.html
```

---

## 4️⃣ LIMPIAR SESIÓN LOCAL

**Usar cuando:** Tienes un token inválido o corrupto y necesitas empezar de cero.

**Cómo ejecutar:**

```javascript
localStorage.clear();
console.clear();
console.log('✅ Sesión limpiada!');
console.log('🔄 Recarga la página y vuelve a iniciar sesión.');
```

---

## 5️⃣ DIAGNÓSTICO COMPLETO

**Usar cuando:** Quieres verificar todo el sistema de autenticación.

**Cómo ejecutar:**

```javascript
async function diagnosticoCompleto() {
    console.clear();
    console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA\n');
    console.log('='.repeat(60));
    
    // 1. Verificar JWT_SECRET
    console.log('\n1️⃣ Verificando JWT_SECRET...');
    try {
        const jwtRes = await fetch('https://phonespot-backend-production.up.railway.app/api/auth/diagnostico-jwt');
        const jwtData = await jwtRes.json();
        console.log('   JWT_SECRET:', jwtData.diagnostico.JWT_SECRET_configurado ? '✅ Configurado' : '❌ NO configurado');
        console.log('   Coincide esperado:', jwtData.diagnostico.coincide_con_esperado ? '✅ SÍ' : '❌ NO');
    } catch (err) {
        console.log('   ❌ Error:', err.message);
    }
    
    // 2. Listar usuarios
    console.log('\n2️⃣ Verificando usuarios en BD...');
    try {
        const usersRes = await fetch('https://phonespot-backend-production.up.railway.app/api/auth/listar-usuarios');
        const usersData = await usersRes.json();
        console.log('   Total usuarios:', usersData.total);
        if (usersData.total > 0) {
            console.log('   Usuarios:');
            usersData.usuarios.forEach((u, i) => {
                console.log(`      ${i + 1}. ${u.username} / ${u.email} / ${u.rol}`);
            });
        } else {
            console.log('   ⚠️ NO HAY USUARIOS - Ejecuta el script #1 para crear admin');
        }
    } catch (err) {
        console.log('   ❌ Error:', err.message);
    }
    
    // 3. Verificar sesión local
    console.log('\n3️⃣ Verificando sesión local...');
    const sesion = localStorage.getItem('sesionPhoneSpot');
    if (sesion) {
        const s = JSON.parse(sesion);
        console.log('   Usuario:', s.username);
        console.log('   Rol:', s.rol);
        console.log('   Token:', s.token ? 'Presente ✅' : 'NO presente ❌');
        console.log('   Login time:', s.loginTime);
    } else {
        console.log('   ⚠️ NO HAY SESIÓN GUARDADA');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Diagnóstico completado');
}

diagnosticoCompleto();
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Token inválido o expirado"
**Solución:**
1. Ejecuta el script #4 (Limpiar sesión)
2. Ejecuta el script #3 (Login y guardar sesión)
3. Recarga la página del admin

### Problema 2: "Usuario no encontrado" al hacer login
**Solución:**
1. Ejecuta el script #2 (Listar usuarios) para verificar
2. Si no hay usuarios, ejecuta el script #1 (Crear admin)
3. Ejecuta el script #3 (Login y guardar sesión)

### Problema 3: "No hay token JWT - Las operaciones de admin FALLARÁN"
**Solución:**
1. Ejecuta el script #4 (Limpiar sesión)
2. Ejecuta el script #3 (Login y guardar sesión)
3. Recarga el panel admin

### Problema 4: Railway muestra "NO HAY USUARIOS EN LA BASE DE DATOS"
**Solución:**
1. Ejecuta el script #1 (Crear admin inicial)
2. Verifica con el script #2 (Listar usuarios)
3. Ejecuta el script #3 (Login y guardar sesión)

---

## 📝 CREDENCIALES DEL ADMIN

```
Email: nboujon7@gmail.com
Password: Nacho2005
```

---

## 🔗 URLS IMPORTANTES

- **Backend Railway:** https://phonespot-backend-production.up.railway.app
- **Frontend Netlify:** https://phonespott.netlify.app
- **Admin Local:** http://127.0.0.1:5500/HTML/admin.html
- **Login Local:** http://127.0.0.1:5500/HTML/login.html

---

## 🛠️ MANTENIMIENTO

### Ver logs de Railway:
1. Ve a [Railway.app](https://railway.app/)
2. Selecciona tu proyecto "phonespot-backend"
3. Click en "Deployments"
4. Click en "View Logs"

### Variables de entorno en Railway:
- `MONGODB_URI`: Conexión a MongoDB Atlas
- `JWT_SECRET`: `phonespot_secret_key_2025`
- `FRONTEND_URL`: `https://phonespott.netlify.app`
- `NODE_ENV`: `production`

---

**Última actualización:** 28 de Octubre, 2025
**Backend:** Railway.app
**Base de datos:** MongoDB Atlas

