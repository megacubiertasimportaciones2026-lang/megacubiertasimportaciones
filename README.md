# 🏠 Megacubiertas Importaciones

Sitio web corporativo moderno para Megacubiertas Importaciones, empresa ecuatoriana especializada en tejas PVC, policarbonato y materiales de construcción.

## 🚀 Demo en Vivo

Visita el sitio: [Megacubiertas Importaciones](#)

## ✨ Características

- 🎨 **Diseño moderno y elegante** con animaciones suaves
- 📱 **100% Responsive** - se adapta a móviles, tablets y desktop
- ⚡ **Rendimiento optimizado** - carga rápida
- 🛒 **Catálogo de productos** completo con categorías y filtros
- 📸 **Galería de proyectos** instalados
- 💬 **Integración WhatsApp** para cotizaciones directas
- 🗺️ **Mapa interactivo** con ubicación
- 🎨 **Sistema de temas** personalizable
- 📊 **Panel de administración** para gestión de contenido

## 📂 Estructura del Proyecto

```
megacubiertas/
│
├── index.html              # Página principal
├── catalogo.html           # Catálogo completo de productos
├── categoria.html          # Vista de categoría de accesorios
├── categoria-prod.html     # Vista de categoría de productos
├── detalle.html            # Vista detalle de producto/accesorio
│
├── styles.css              # Estilos globales
├── app.js                  # Lógica principal del frontend
├── data.js                 # Base de datos JSON (productos, configuración)
│
├── portada.jpg             # Imagen de portada
└── README.md               # Este archivo
```

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS, Grid y Flexbox
- **JavaScript ES6+** - Interactividad sin dependencias
- **Font Awesome 6** - Iconografía
- **Google Fonts** - Tipografía (Playfair Display, Barlow)
- **LocalStorage** - Persistencia de datos

## 📦 Instalación

### Opción 1: Uso Directo (Simple)

1. **Descarga o clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/megacubiertas.git
   cd megacubiertas
   ```

2. **Abre `index.html` en tu navegador:**
   - Doble clic en `index.html`, o
   - Arrastra el archivo al navegador

3. **¡Listo!** El sitio funciona completamente sin servidor.

### Opción 2: Con Servidor Local (Recomendado)

Para evitar problemas con CORS y mejorar la experiencia de desarrollo:

**Con Python 3:**
```bash
python -m http.server 8000
```

**Con Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

Luego visita: `http://localhost:8000`

## ⚙️ Configuración

### Personalizar Datos del Sitio

Edita el archivo `data.js` para cambiar:

- **Información de contacto** (teléfonos, email, dirección)
- **Productos y categorías**
- **Accesorios**
- **Galería de proyectos**
- **Ventajas y beneficios**
- **Redes sociales**
- **Tema y colores**
- **Ubicación en mapa**

### Cambiar Colores del Tema

En `data.js`, modifica la sección `tema`:

```javascript
tema: {
  colorPrimario: "#C9A84C",      // Color dorado principal
  colorSecundario: "#FF8C42",    // Color naranja/acento
  colorFondo: "#0A0A0A",         // Fondo oscuro
  colorFondo2: "#1A1A1A",        // Fondo secundario
  colorTexto: "#F5F0E8",         // Texto claro
  colorAccent: "#00D9FF",        // Color de acento (cyan)
  fuente: "Barlow",              // Fuente del cuerpo
  fuenteTitulos: "Playfair Display" // Fuente de títulos
}
```

### Agregar Productos

En `data.js`, en la sección `categoriasProducto`:

```javascript
{
  id: "nuevo-producto",
  nombre: "Nombre del Producto",
  descripcion: "Descripción breve",
  imagen: "ruta/imagen.jpg",
  icono: "fas fa-box",
  items: [
    {
      id: "item-1",
      nombre: "Producto Individual",
      imagen: "imagen.jpg",
      caracteristicas: ["Característica 1", "Característica 2"],
      badge: "Nuevo",
      badgeColor: "success"
    }
  ]
}
```

## 🎨 Personalización Visual

### Cambiar Imagen de Portada

Reemplaza `portada.jpg` con tu imagen (recomendado: 1920x1080px, formato JPG).

### Modificar Fuentes

En `data.js`, cambia las fuentes de Google Fonts disponibles:

```javascript
fuente: "Montserrat",
fuenteTitulos: "Poppins"
```

## 📱 Integración WhatsApp

Las cotizaciones y consultas se envían automáticamente por WhatsApp. Configura los números en `data.js`:

```javascript
whatsappNumbers: [
  { numero: "593999999999", etiqueta: "Ventas General" },
  { numero: "593988888888", etiqueta: "Servicio Técnico" }
]
```

## 🗂️ Base de Datos

El sistema usa LocalStorage para almacenar toda la información. Los datos se cargan desde `data.js` en el primer acceso y se mantienen en el navegador del usuario.

**Ventajas:**
- ✅ Sin servidor backend necesario
- ✅ Funcionamiento offline después de la primera carga
- ✅ Rápido y eficiente

## 🌐 Despliegue

### GitHub Pages (Gratis)

1. Sube el repositorio a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` o `master`
4. ¡Tu sitio estará en `https://tu-usuario.github.io/megacubiertas/`!

### Netlify (Gratis)

1. Arrastra la carpeta del proyecto a [netlify.com/drop](https://app.netlify.com/drop)
2. ¡Listo! Obtendrás una URL instantáneamente

### Vercel (Gratis)

```bash
npm i -g vercel
vercel
```

### Hosting Tradicional

Sube todos los archivos por FTP a la carpeta `public_html` o `www` de tu hosting.

## 📊 SEO

El sitio incluye:
- Títulos y meta descripciones optimizadas
- Estructura semántica HTML5
- Etiquetas Open Graph para redes sociales
- URLs amigables
- Velocidad de carga optimizada

## 🔒 Seguridad

**Importante:** Los archivos de administración (`admin.html`, `admin.js`, `admin.css`, `login.html`) **NO** están incluidos en esta versión pública por seguridad.

Si necesitas el panel de administración completo, contáctanos.

## 🐛 Solución de Problemas

### Las imágenes no cargan
- Verifica que `portada.jpg` y las imágenes de productos estén en la raíz del proyecto
- Comprueba las rutas en `data.js`

### Los estilos se ven mal
- Asegúrate de que `styles.css` esté en la raíz
- Verifica que no haya bloqueadores de CSS en el navegador

### El mapa no aparece
- Confirma que el `embedUrl` en `data.js` sea válido
- Algunos navegadores bloquean iframes sin HTTPS

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:

- 📧 Email: info@megacubiertas.com
- 💬 WhatsApp: +593 99 999 9999
- 🌐 Web: www.megacubiertas.com

## 📄 Licencia

Este proyecto es propiedad de **Megacubiertas Importaciones**. 

© 2019-2026 Megacubiertas Importaciones | Ambato, Ecuador

## 🙏 Agradecimientos

Desarrollado con ❤️ en Ecuador 🇪🇨

---

**⭐ Si te gusta el proyecto, dale una estrella en GitHub!**
