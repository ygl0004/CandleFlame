// Archivo de optimización de rendimiento para Candle Flame
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar videos inmediatamente para mejorar LCP
  initializeVideos();

  // Cargar recursos no críticos después de que la página sea interactiva
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadNonCriticalResources);
  } else {
    setTimeout(loadNonCriticalResources, 1000);
  }
});

// Variables para evitar recargas innecesarias de video
let lastIsDesktop = null;
let lastDesktopSrc = "";
let lastMobileSrc = "";

// Función para inicializar videos de forma optimizada
function initializeVideos() {
  const desktopVideo = document.getElementById("background-video-desktop");
  const mobileVideo = document.getElementById("background-video-mobile");

  if (!desktopVideo || !mobileVideo) return;

  const windowWidth = window.innerWidth;
  const isDesktop = windowWidth >= 540;

  const path = window.location.pathname;
  let desktopSrc = "";
  let mobileSrc = "";

  if (path.endsWith("servicio.html")) {
    desktopSrc = "assets/media/video/servicio/hero/Video.Taller.Velas.webm";
    mobileSrc = "assets/media/video/servicio/hero/Video.Taller.Velas.webm";
  } else if (path.endsWith("personalizar.html")) {
    desktopSrc = "assets/media/video/personalizacion/Intro_Personalizar_Vela.webm";
    mobileSrc = "assets/media/video/personalizacion/Intro_Personalizar_Vela.webm";
  } else {
    desktopSrc = "assets/media/video/portada/Candleflame Ordenador.webm";
    mobileSrc = "assets/media/video/portada/Candleflame Movil.webm";
  }

  // Solo cambiar si cambia el modo o la fuente
  if (isDesktop) {
    if (lastIsDesktop !== true || lastDesktopSrc !== desktopSrc) {
      desktopVideo.hidden = false;
      mobileVideo.hidden = true;

      let source = desktopVideo.querySelector("source");
      if (!source) {
        source = document.createElement("source");
        source.type = "video/webm";
        desktopVideo.appendChild(source);
      }
      if (source.src !== location.origin + "/" + desktopSrc && source.src !== desktopSrc) {
        source.src = desktopSrc;
        desktopVideo.load();
        desktopVideo.play().catch((err) => console.log("Error al reproducir video de escritorio:", err));
      }
      lastIsDesktop = true;
      lastDesktopSrc = desktopSrc;
    }
  } else {
    if (lastIsDesktop !== false || lastMobileSrc !== mobileSrc) {
      desktopVideo.hidden = true;
      mobileVideo.hidden = false;

      let source = mobileVideo.querySelector("source");
      if (!source) {
        source = document.createElement("source");
        source.type = "video/webm";
        mobileVideo.appendChild(source);
      }
      if (source.src !== location.origin + "/" + mobileSrc && source.src !== mobileSrc) {
        source.src = mobileSrc;
        mobileVideo.load();
        mobileVideo.play().catch((err) => console.log("Error al reproducir video móvil:", err));
      }
      lastIsDesktop = false;
      lastMobileSrc = mobileSrc;
    }
  }
}

// Función para cargar recursos no críticos
function loadNonCriticalResources() {
  // Cargar imágenes de forma diferida
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length > 0) {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback para navegadores que no soportan IntersectionObserver
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      });
    }
  }

  // Optimizar la carga de FontAwesome
  optimizeFontAwesome();
}

// Función para optimizar la carga de FontAwesome
function optimizeFontAwesome() {
  // Verificar si ya está cargado para evitar duplicados
  if (document.querySelector('link[href*="all.min.css"]')) {
    return;
  }

  // Crear un elemento link para cargar FontAwesome de forma diferida
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "assets/css/FontAwesome/css/all.min.css";
  document.head.appendChild(link);
}

// Optimizar la carga de videos cuando cambia el tamaño de la ventana
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initializeVideos, 200);
});

// Observar cuando la página está completamente cargada
window.addEventListener("load", () => {
  // Marcar la página como completamente cargada
  document.documentElement.classList.add("page-loaded");

  // Optimizar la interacción después de la carga completa
  optimizeAfterLoad();
});

// Optimizaciones adicionales después de la carga completa
function optimizeAfterLoad() {
  // Precargar páginas cuando el usuario hace hover en enlaces
  const links = document.querySelectorAll('a[href^="http"], a[href^="/"], a[href^="./"], a[href^="../"]');

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const url = link.getAttribute("href");
      if (url && !url.startsWith("#") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
        const preloadLink = document.createElement("link");
        preloadLink.rel = "prefetch";
        preloadLink.href = url;
        document.head.appendChild(preloadLink);
      }
    });
  });
}
