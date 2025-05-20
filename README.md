<p align="center">
  <a href="" rel="noopener">
    <img width=200px height=200px src="assets\media\img\readme\logo.webp" alt="Logo Candle Flame">
  </a>
</p>

<h3 align="center">Candle Flame - Proyecto Académico</h3>

<div align="center">

[![Estado](https://img.shields.io/badge/status-activo-success.svg)]()
[![Licencia](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">
  Sitio web académico de velas artesanales, realizado como proyecto educativo para el ciclo de Desarrollo de Aplicaciones Multiplataforma y Marketing y Publicidad (MEDAC, 2024/2025).
  <br>
</p>

## 📝 Tabla de Contenidos

- [Acerca de](#acerca)
- [Comenzando](#comenzando)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura)
- [Scripts y Estilos](#scripts)
- [Accesibilidad](#accesibilidad)
- [Pruebas y Buenas Prácticas](#pruebas)
- [Notas adicionales](#notas)
- [Tecnologías Utilizadas](#tecnologias)
- [Autores](#autores)
- [Agradecimientos](#agradecimientos)

## 🧐 Acerca de <a name="acerca"></a>

Candle Flame es una web ficticia de venta de velas artesanales y personalizables, creada como proyecto académico. El objetivo es simular una tienda online moderna, con funcionalidades de carrito, personalización de productos, gestión de cookies y formularios de contacto, todo desarrollado con tecnologías web estándar (HTML, CSS, JavaScript).

## 🏁 Comenzando <a name="comenzando"></a>

Estas instrucciones te permitirán obtener una copia del proyecto y ejecutarlo localmente para desarrollo y pruebas.

### Requisitos previos

Solo necesitas un navegador web moderno (Chrome, Firefox, Edge, Safari).

### Instalación

1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` en tu navegador.

No se requiere instalación de dependencias ni backend.

## 🎈 Uso <a name="uso"></a>

- Navega por las distintas secciones: inicio, blog, productos, personalización, contacto, etc.
- Prueba la personalización de velas, añade productos al carrito y utiliza los formularios de contacto y newsletter.
- Gestiona tus preferencias de cookies desde la barra inferior.

## 🚀 Despliegue <a name="despliegue"></a>

Puedes desplegar el sitio en cualquier servidor estático (por ejemplo, GitHub Pages, Netlify, Vercel) subiendo todos los archivos del proyecto.

## 📁 Estructura del Proyecto <a name="estructura"></a>

```
CandleFlame/
│
├── index.html                # Página principal
├── blog.html                 # Blog principal
├── blog-bienestar.html       # Artículo: bienestar
├── blog-decoracion.html      # Artículo: decoración
├── carrito.html              # Carrito de compras
├── contacto.html             # Página de contacto
├── condiciones-compra.html   # Condiciones de compra
├── aviso-legal.html          # Aviso legal
├── politica-cookies.html     # Política de cookies
├── privacidad.html           # Política de privacidad
├── producto-premium.html     # Producto destacado premium
├── productos.html            # Catálogo de productos
├── personalizar.html         # Personalización de velas
├── reviews.html              # Opiniones de clientes
├── servicio.html             # Taller/servicio
│
├── scripts.js                # Scripts globales
├── scripts-optimized.js      # Optimizaciones de carga y rendimiento
│                             # (carga diferida de recursos, videos, FontAwesome,
│                               imágenes, prefetch de páginas)
├── styles.css                # Estilos globales
│
├── assets/
│   ├── css/                  # Hojas de estilo CSS
│   │   ├── FontAwesome/      # Iconos
│   │   └── pages/            # Estilos por página
│   ├── js/                   # Scripts JS
│   │   ├── AnimeJS/          # Librería Anime.js
│   │   ├── html2canvas/      # Librería html2canvas
│   │   └── pages/            # Scripts por página
│   └── media/                # Imágenes y vídeos
│       ├── img/              # Imágenes
│       └── video/            # Vídeos
│
├── favicon.ico               # Icono del sitio
├── robots.txt                # Archivo robots.txt
└── README.md                 # Este archivo
```

## 🛠️ Scripts y Estilos <a name="scripts"></a>

- **Estilos globales:** `styles.css`
- **Scripts globales:** `scripts.js`
- **Script de optimización:** `scripts-optimized.js` (carga diferida de recursos, optimización de videos, imágenes y FontAwesome)
- **Estilos y scripts por página:** en `assets/css/pages/` y `assets/js/pages/`
- **Dependencias externas:**
  - [FontAwesome](https://fontawesome.com/) para iconos
  - [Anime.js](https://animejs.com/) para animaciones
  - [html2canvas](https://html2canvas.hertzen.com/) para capturas

## ♿ Accesibilidad <a name="accesibilidad"></a>

- El sitio utiliza etiquetas semánticas y roles ARIA donde es relevante.
- Los formularios incluyen atributos `required` y `placeholder`.
- Los colores cumplen con el contraste recomendado para accesibilidad.
- Navegación por teclado soportada en menús y formularios.
- Los iconos y botones tienen etiquetas `aria-label` descriptivas.

<!--
## 🤝 Contribuir <a name="contribuir"></a>

¿Quieres contribuir? Sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

**Recomendaciones:**
- Mantén la estructura de carpetas.
- Usa comentarios claros en el código.
- Sigue la convención de nombres de archivos y clases.
- Si añades librerías externas, justifica su uso en el README.
-->

## 🧪 Pruebas y Buenas Prácticas <a name="pruebas"></a>

- El código JavaScript está modularizado por página.
- Se recomienda validar los formularios antes de enviar.
- Usa [Lighthouse](https://developers.google.com/web/tools/lighthouse) para auditar accesibilidad y rendimiento.
- Prueba en diferentes navegadores y dispositivos.

<!--
## 🔗 Enlaces útiles <a name="enlaces"></a>

- [Guía de estilos CSS](https://cssguidelin.es/)
- [Guía de buenas prácticas JS](https://github.com/airbnb/javascript)
- [MDN Web Docs](https://developer.mozilla.org/es/)
-->

## 🗒️ Notas adicionales <a name="notas"></a>

- El proyecto no almacena datos personales ni realiza transacciones reales.
- Las imágenes y videos son de uso educativo o libres de derechos.
- Si encuentras algún error o tienes sugerencias, abre un issue.

## ⛏️ Tecnologías Utilizadas <a name="tecnologias"></a>

- HTML5
- CSS3
- JavaScript (ES6)
- [FontAwesome](https://fontawesome.com/) - Iconos
- [Anime.js](https://animejs.com/) - Animaciones
- [html2canvas](https://html2canvas.hertzen.com/) - Captura de elementos HTML como imagen

## ✍️ Autores <a name="autores"></a>

- Yeray Garrido Linares (Programador, desarrollo web)
- Claudia Cretu Domenech (Diseño y marketing)
- Proyecto académico para MEDAC (DAM y Marketing y Publicidad, 2024/2025)

## 🎉 Agradecimientos <a name="agradecimientos"></a>

- Inspiración en tiendas reales de velas artesanales.
- Recursos gráficos e iconos de uso libre y educativo.
- Docentes y compañeros de MEDAC.

---

**Este proyecto es ficticio y solo tiene fines educativos. No representa una tienda real ni realiza actividad comercial.**
