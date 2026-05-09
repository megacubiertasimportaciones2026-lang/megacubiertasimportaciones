# 🚀 INSTALACIÓN RÁPIDA - Megacubiertas

## 📦 Opción 1: GitHub Pages (MÁS FÁCIL)

1. **Sube a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Primera versión de Megacubiertas"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/megacubiertas.git
   git push -u origin main
   ```

2. **Activa GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main → / (root) → Save
   
3. **¡Listo!** Tu sitio estará en:
   ```
   https://TU-USUARIO.github.io/megacubiertas/
   ```

## 💻 Opción 2: Prueba Local

**Sin instalación:**
```bash
# Simplemente abre index.html en tu navegador
```

**Con servidor (recomendado):**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## ⚡ Opción 3: Netlify (Deploy en 30 segundos)

1. Ve a [netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta completa
3. ¡Sitio publicado al instante!

## ⚙️ CONFIGURACIÓN INICIAL

### 1. Edita tus datos de contacto

Abre `data.js` y modifica:

```javascript
contacto: {
  whatsappNumbers: [
    { numero: "593999999999", etiqueta: "Tu Etiqueta" }
  ],
  email: "tuemail@dominio.com",
  direccion: "Tu Dirección"
}
```

### 2. Cambia los enlaces de redes sociales

```javascript
redes: {
  facebook: "https://facebook.com/tu-pagina",
  instagram: "https://instagram.com/tu-cuenta",
  tiktok: "https://tiktok.com/@tu-cuenta",
  youtube: "https://youtube.com/@tu-canal"
}
```

### 3. Actualiza el mapa

```javascript
mapa: {
  mapsLink: "https://maps.app.goo.gl/TU-ENLACE",
  embedUrl: "https://www.google.com/maps/embed?pb=TU-CODIGO"
}
```

### 4. Personaliza colores (opcional)

```javascript
tema: {
  colorPrimario: "#C9A84C",    // Cambia tu color principal
  colorSecundario: "#FF8C42",  // Color secundario
  // ... más opciones en data.js
}
```

## 📝 CHECKLIST PRE-PUBLICACIÓN

- [ ] Cambiar números de WhatsApp
- [ ] Cambiar email de contacto
- [ ] Actualizar dirección física
- [ ] Configurar enlaces de redes sociales
- [ ] Actualizar coordenadas del mapa
- [ ] Reemplazar `portada.jpg` con tu imagen
- [ ] Agregar tus productos en `data.js`
- [ ] Probar todos los enlaces
- [ ] Verificar que WhatsApp funcione

## 🆘 AYUDA RÁPIDA

**¿Las imágenes no cargan?**
- Verifica que `portada.jpg` esté en la raíz del proyecto
- Revisa las rutas en `data.js`

**¿WhatsApp no abre?**
- Confirma que los números estén con código de país (ej: 593999999999)
- No uses espacios, guiones ni símbolos + en los números

**¿El mapa no se ve?**
- Genera un nuevo enlace embed en Google Maps
- Pégalo completo en `data.js` → `mapa.embedUrl`

## 📞 Más Ayuda

Lee el `README.md` completo para más detalles.

---

**¡Feliz publicación! 🎉**
