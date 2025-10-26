# 🚀 COMANDOS PARA SUBIR TODO A GIT Y NETLIFY

## ✅ PASO 1: AGREGAR TODOS LOS ARCHIVOS

```bash
git add .
```

---

## ✅ PASO 2: HACER COMMIT

```bash
git commit -m "✨ Actualización completa: Responsive móvil, campos nuevos (batería, colores, memorias), badge americano, actualización automática"
```

---

## ✅ PASO 3: SUBIR A GITHUB/GITLAB

```bash
git push origin main
```

O si tu rama se llama "master":

```bash
git push origin master
```

---

## 🔄 SI TIENES CONFLICTOS

```bash
git pull origin main --rebase
git push origin main
```

---

## 📋 VERIFICAR QUE TODO SUBIÓ

```bash
git status
```

Debería decir: "nothing to commit, working tree clean"

---

## 🌐 ACTUALIZAR NETLIFY

### Si conectaste Netlify con Git:
1. Los cambios se deployarán automáticamente
2. Espera 2-3 minutos
3. Ve a tu dashboard de Netlify
4. Verifica que el deploy esté "Published"

### Si arrastras archivos manualmente:
1. Ve a Netlify
2. Arrastra toda la carpeta del proyecto
3. O usa: Deploys → Drag and drop

---

## 🧹 LIMPIAR CACHE

### En Netlify:
```
Deploys → Trigger deploy → Clear cache and deploy site
```

### En tu navegador:
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

---

## ✅ ARCHIVOS NUEVOS QUE SE SUBIRÁN

1. ✅ netlify.toml
2. ✅ SOLUCION_NETLIFY.md
3. ✅ RESUMEN_CAMBIOS_COMPLETO.md
4. ✅ COMANDOS_GIT.md (este archivo)

Y todos los cambios en:
- HTML/admin.html
- JavaScript/productos.js
- style.css
- style-mobile.css
- index.js
- HTML/Carrito.html
- Todas las páginas HTML con responsive

---

## 🎯 COMANDO RÁPIDO (TODO EN UNO)

```bash
git add . && git commit -m "✨ Actualización completa: Responsive + campos nuevos" && git push origin main
```

---

## ⚠️ IMPORTANTE

Si Netlify está conectado a tu repositorio de Git:
- ✅ Los cambios se deployarán automáticamente al hacer push
- ✅ No necesitas arrastrar archivos manualmente
- ✅ Netlify detecta el netlify.toml automáticamente

---

## 🆘 SI ALGO FALLA

### Error: "failed to push"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Your branch is behind"
```bash
git pull origin main
git push origin main
```

### Error: "Permission denied"
- Verifica tu token de GitHub/GitLab
- O usa SSH en lugar de HTTPS

---

*PhoneSpot E-Commerce - Git Commands - 2025*

