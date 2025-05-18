document.addEventListener("DOMContentLoaded", () => {
  // =============================================
  // 1. SISTEMA DE VIEWPORT INTELIGENTE
  // =============================================
  let allowResize = false;
  const heroSection = document.querySelector(".hero, .customization-hero"); // Compatible con ambas páginas

  const setFixedViewport = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Ajustar el contenedor de video para asegurar que cubra toda la pantalla
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.style.height = `${window.innerHeight}px`;
    }

    // Ajustar menú móvil si está abierto
    const headerNav = document.querySelector(".header_nav");
    if (headerNav && headerNav.classList.contains("show")) {
      headerNav.style.height = `${window.innerHeight}px`;
    }
  };

  const checkHeroVisibility = () => {
    if (!heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    allowResize = heroRect.top >= -100 && heroRect.bottom <= window.innerHeight + 100;
  };

  const optimizedResizeHandler = () => {
    checkHeroVisibility();
    if (allowResize) {
      requestAnimationFrame(setFixedViewport);
    }
  };

  // Configuración inicial
  setFixedViewport();
  window.addEventListener("orientationchange", setFixedViewport);
  window.addEventListener("scroll", checkHeroVisibility);
  window.addEventListener("resize", optimizedResizeHandler);

  // =============================================
  // 2. HEADER Y MENÚ MÓVIL
  // =============================================
  const header = document.querySelector("header");
  const menuButton = document.querySelector(".mobile-menu-button");
  const headerNav = document.querySelector(".header_nav");
  const body = document.body;
  const headerLinks = document.querySelectorAll(".header_link");

  // Efecto scroll para header
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Control del menú móvil
  if (menuButton) {
    menuButton.addEventListener("click", function (e) {
      e.preventDefault();
      const isOpen = headerNav.classList.contains("show");

      // Alternar estado del menú
      headerNav.classList.toggle("show");
      body.classList.toggle("menu-open");

      if (!isOpen) {
        headerNav.style.height = `${window.innerHeight}px`;
        body.style.overflow = "hidden";
        body.style.position = "fixed";
      } else {
        headerNav.style.height = "";
        body.style.overflow = "";
        body.style.position = "";
      }

      // Cambiar icono
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });
  }

  // Cerrar menú al hacer clic en enlaces (mobile)
  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768 && headerNav.classList.contains("show")) {
        e.preventDefault();
        headerNav.classList.remove("show");
        body.classList.remove("menu-open");
        headerNav.style.height = "";
        body.style.overflow = "";
        body.style.position = "";

        const target = this.getAttribute("href");
        setTimeout(() => {
          if (target.startsWith("#") && target.length > 1) {
            const targetElement = document.querySelector(target);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            window.location.href = target;
          }
        }, 300);
      }
    });
  });

  // =============================================
  // 3. SCROLL SUAVE Y CONTROL DE VIDEOS
  // =============================================
  // Smooth scroll para anclas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const headerHeight = header?.offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Control de videos de fondo
  let lastVideoType = null; // "desktop" o "mobile"
  let lastVideoSrc = null;

  const handleVideoDisplay = () => {
    const desktopVideo = document.getElementById("background-video-desktop");
    const mobileVideo = document.getElementById("background-video-mobile");
    const videoContainer = document.querySelector(".video-container");

    // Detectar página y asignar rutas de video
    let desktopSrc = "";
    let mobileSrc = "";
    const path = window.location.pathname;

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

    const isDesktop = window.innerWidth >= 540;
    const currentType = isDesktop ? "desktop" : "mobile";
    const currentSrc = isDesktop ? desktopSrc : mobileSrc;

    // Solo cambiar si el tipo o la ruta han cambiado
    if (lastVideoType === currentType && lastVideoSrc === currentSrc) {
      return;
    }
    lastVideoType = currentType;
    lastVideoSrc = currentSrc;

    // Ocultar ambos videos primero
    if (desktopVideo) desktopVideo.hidden = true;
    if (mobileVideo) mobileVideo.hidden = true;

    // Seleccionar el video y la ruta a usar
    const videoEl = isDesktop ? desktopVideo : mobileVideo;
    if (videoEl) {
      // Solo cambiar el source si es diferente
      let sourceEl = videoEl.querySelector("source");
      if (!sourceEl || sourceEl.getAttribute("src") !== currentSrc) {
        // Eliminar source anterior
        while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
        // Añadir nuevo source
        sourceEl = document.createElement("source");
        sourceEl.src = currentSrc;
        sourceEl.type = "video/webm";
        videoEl.appendChild(sourceEl);
        videoEl.load();
      }
      videoEl.hidden = false;
      videoEl.play().catch(() => {});
    }

    // Asegurar que el contenedor de video cubra toda la pantalla
    if (videoContainer) {
      videoContainer.style.height = `${window.innerHeight}px`;
    }
  };

  // Inicialización de videos al cargar la página
  handleVideoDisplay();
  window.addEventListener("resize", handleVideoDisplay);

  // =============================================
  // 4. FUNCIONALIDADES ESPECÍFICAS DE PERSONALIZAR.HTML
  // (Solo se ejecutan si existen los elementos)
  // =============================================
  if (document.querySelector(".candle-model")) {
    // Sistema de partículas para la llama
    function createFlameParticles() {
      const container = document.querySelector(".flame-sparks");
      setInterval(() => {
        if (Math.random() > 0.5) {
          const particle = document.createElement("div");
          particle.className = "flame-particle";
          particle.style.cssText = `
                      position: absolute;
                      bottom: 0;
                      left: ${50 + (Math.random() * 20 - 10)}%;
                      width: ${Math.random() * 4 + 2}px;
                      height: ${Math.random() * 4 + 2}px;
                      background: ${Math.random() > 0.7 ? "var(--flame-secondary)" : "var(--flame-primary)"};
                      border-radius: 50%;
                      filter: blur(1px);
                      opacity: ${Math.random() * 0.8 + 0.2};
                  `;
          container.appendChild(particle);

          anime({
            targets: particle,
            translateY: [0, -Math.random() * 100 - 50],
            translateX: [0, Math.random() * 20 - 10],
            scale: [1, Math.random() * 0.5 + 0.5],
            opacity: [1, 0],
            duration: Math.random() * 1000 + 500,
            easing: "easeOutQuad",
            complete: () => particle.remove(),
          });
        }
      }, 100);
    }

    // Interacción 3D con la vela
    const candle = document.querySelector(".candle-model");
    const candlePreview = document.querySelector(".candle-preview");

    if (candlePreview) {
      candlePreview.addEventListener("mousemove", (e) => {
        const rect = candlePreview.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (0.5 - y) * 25;
        const rotateY = (0.5 - x) * 25;

        candle.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        candle.style.filter = `drop-shadow(${(0.5 - x) * 15}px ${(0.5 - y) * 15}px 25px rgba(0,0,0,0.3))`;

        const reflection = document.querySelector(".candle-reflection");
        if (reflection) {
          reflection.style.left = `${15 + (0.5 - x) * 10}%`;
          reflection.style.top = `${15 + (0.5 - y) * 10}%`;
        }
      });

      candlePreview.addEventListener("mouseleave", () => {
        candle.style.transform = "rotateX(0deg) rotateY(0deg)";
        candle.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.15))";
        const reflection = document.querySelector(".candle-reflection");
        if (reflection) {
          reflection.style.left = "15%";
          reflection.style.top = "15%";
        }
      });
    }

    // Inicializar efectos
    createFlameParticles();
  }

  // =============================================
  // 5. NOTIFICACIONES
  // =============================================
  let notificationTimeout = null;
  let currentNotification = null;

  function showNotification(message) {
    // Si ya hay una notificación visible, actualiza el mensaje y extiende la duración
    if (currentNotification) {
      currentNotification.textContent = message;
      clearTimeout(notificationTimeout);
      notificationTimeout = setTimeout(() => {
        currentNotification.classList.remove("show");
        setTimeout(() => {
          if (currentNotification && currentNotification.parentNode) {
            currentNotification.parentNode.removeChild(currentNotification);
          }
          currentNotification = null;
        }, 300);
      }, 3000);
      return;
    }

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    currentNotification = notification;

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    notificationTimeout = setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        if (currentNotification === notification) {
          currentNotification = null;
        }
      }, 300);
    }, 3000);
  }

  // Estilos para notificaciones
  const notificationStyles = document.createElement("style");
  notificationStyles.textContent = `
      .notification {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: var(--color-accent);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 10000;
          transition: transform 0.3s ease;
          text-align: center;
      }
      .notification.show {
          transform: translateX(-50%) translateY(0);
      }
  `;
  document.head.appendChild(notificationStyles);

  // Control del formulario de newsletter (actualizado)
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    // Solo el primer checkbox es obligatorio
    const checkboxes = newsletterForm.querySelectorAll('input[type="checkbox"]');
    if (checkboxes[0]) checkboxes[0].removeAttribute("required");
    if (checkboxes[1]) checkboxes[1].removeAttribute("required");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Solo la primera casilla (privacidad) es obligatoria
      const faltaPrivacidad = !checkboxes[0]?.checked;

      if (faltaPrivacidad) {
        showNotification("Debes aceptar la Política de Privacidad para suscribirte");
        return;
      }

      // Simular envío exitoso
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput) emailInput.value = ""; // Limpiar el campo

      // Resetear checkboxes
      checkboxes.forEach((checkbox) => (checkbox.checked = false));

      // Mostrar notificación
      showNotification("¡Gracias por suscribirte a nuestro newsletter!");
    });
  }

  // Notificaciones para formularios de contacto
  document.querySelectorAll("form[data-toast]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simular envío exitoso
      const toastMessage = form.getAttribute("data-toast");
      showNotification(toastMessage);

      // Limpiar el formulario
      form.reset();
    });
  });

  // =============================================
  // 6. BOTÓN "VOLVER ARRIBA"
  // =============================================
  const backToTopButton = document.getElementById("back-to-top");

  // Mostrar/ocultar botón al hacer scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Scroll suave al hacer clic
  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // =============================================
  // 7. GALERÍA AUTOMÁTICA STORY SECTION
  // =============================================
  // Galería automática
  const gallerySlides = document.querySelectorAll(".gallery-slide");
  const storyContent = document.querySelector(".story-content");
  const storySectionElement = document.querySelector(".story-section");

  if (gallerySlides.length > 0 && storyContent) {
    let currentIndex = 0;
    let slideInterval;
    let isTransitioning = false;

    // Añadir estilos para las transiciones perfectamente sincronizadas
    if (!document.getElementById("gallery-transition-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "gallery-transition-styles";
      styleElement.textContent = `
        .story-content {
          transition: opacity 0.7s ease-in-out;
        }
        .gallery-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.7s ease-in-out;
          z-index: 1;
        }
        .gallery-slide.active {
          opacity: 1;
          z-index: 2;
        }
        .story-section.transitioning .story-content,
        .story-section.transitioning .gallery-slide.active {
          opacity: 0;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Contenido para cada slide
    const slideContents = [
      {
        title: "Hogar saludable",
        subtitle: "Claves para transformar tu espacio en un santuario de bienestar",
        description:
          "Diseña un espacio donde la calma habite, con ideas de organización, decoración y aromas que revitalizan tu día a día.",
        link: "blog-bienestar.html",
        linkText: "Empieza por ti",
      },
      {
        title: "Cómo decorar tu hogar sin grandes cambios",
        subtitle: "",
        description:
          "Descubre cómo renovar la decoración de tu hogar con pequeños cambios. Ideas sencillas y efectivas para crear espacios más frescos, acogedores y llenos de estilo.",
        link: "blog-decoracion.html",
        linkText: "Empieza por ti",
      },
    ];

    // Función para cambiar de slide con transiciones perfectamente sincronizadas
    function changeSlide() {
      if (isTransitioning) return;
      isTransitioning = true;

      // Calcular el índice del siguiente slide
      const nextIndex = (currentIndex + 1) % gallerySlides.length;

      // 1. Añadir clase para iniciar desvanecimiento simultáneo
      storySectionElement.classList.add("transitioning");

      // 2. Después de que todo se desvanezca, cambiar contenido
      setTimeout(() => {
        // Cambiar la imagen
        gallerySlides[currentIndex].classList.remove("active");
        gallerySlides[nextIndex].classList.add("active");

        // Actualizar el contenido
        const content = slideContents[nextIndex];
        const titleElement = storyContent.querySelector("h3");
        const subtitleElement = storyContent.querySelector("h4");
        const descriptionElement = storyContent.querySelector("p");
        const linkElement = storyContent.querySelector("a");

        // Actualizar textos
        titleElement.textContent = content.title;

        // Manejar el subtítulo (puede estar vacío para el segundo slide)
        if (content.subtitle) {
          if (subtitleElement) {
            subtitleElement.textContent = content.subtitle;
            subtitleElement.style.display = "block";
          } else {
            const newSubtitle = document.createElement("h4");
            newSubtitle.textContent = content.subtitle;
            titleElement.after(newSubtitle);
          }
        } else if (subtitleElement) {
          subtitleElement.style.display = "none";
        }

        descriptionElement.textContent = content.description;
        linkElement.href = content.link;
        linkElement.textContent = content.linkText;

        // 3. Mostrar todo el nuevo contenido simultáneamente
        setTimeout(() => {
          storySectionElement.classList.remove("transitioning");
          currentIndex = nextIndex;
          isTransitioning = false;
        }, 50);
      }, 700); // Este tiempo debe coincidir con la duración de la transición CSS
    }

    // Iniciar intervalo (7 segundos)
    slideInterval = setInterval(changeSlide, 7000);

    // Ajustar imágenes al cargar
    window.addEventListener("load", () => {
      gallerySlides.forEach((slide) => {
        const img = slide.querySelector("img");
        if (img) {
          // Forzar redimensionamiento inicial
          img.style.width = "100%";
          img.style.height = "100%";
        }
      });
    });
  }

  // =============================================
  // 8. GESTIÓN DE COOKIES
  // =============================================
  const cookieBar = document.getElementById("cookie-bar");
  const cookieAcceptAll = document.getElementById("cookie-accept-all");
  const cookieAcceptNecessary = document.getElementById("cookie-accept-necessary");
  const cookieConfigure = document.getElementById("cookie-configure");
  const cookieModal = document.getElementById("cookie-modal");
  const cookieSave = document.getElementById("cookie-save");
  const cookieCancel = document.getElementById("cookie-cancel");
  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  // Comprobar preferencias de cookies
  function checkCookiesAccepted() {
    return localStorage.getItem("cookiesAccepted") !== null;
  }

  // Mostrar barra con animación
  function showCookieBar() {
    if (!checkCookiesAccepted() && cookieBar) {
      cookieBar.style.display = "block";

      // Forzar reflow para activar la animación
      void cookieBar.offsetHeight;

      setTimeout(() => {
        cookieBar.classList.add("show");

        // Animación escalonada para botones
        const buttons = cookieBar.querySelectorAll(".cookie-button");
        buttons.forEach((btn, index) => {
          btn.style.transition = `all 0.5s ease ${0.3 + index * 0.1}s`;
          btn.style.opacity = "1";
          btn.style.transform = "translateY(0)";
        });
      }, 100);
    }
  }

  // Ocultar barra con animación
  function hideCookieBar() {
    if (cookieBar) {
      cookieBar.classList.remove("show");
      setTimeout(() => {
        cookieBar.style.display = "none";
      }, 600); // Coincide con la duración de la animación
    }
  }

  // Aceptar todas las cookies
  function acceptAllCookies() {
    localStorage.setItem("cookiesAccepted", "all");
    localStorage.setItem("analyticsCookies", "true");
    localStorage.setItem("marketingCookies", "true");
    hideCookieBar();
    showNotification("Preferencias de cookies guardadas");
  }

  // Aceptar solo necesarias
  function acceptNecessaryCookies() {
    localStorage.setItem("cookiesAccepted", "necessary");
    localStorage.setItem("analyticsCookies", "false");
    localStorage.setItem("marketingCookies", "false");
    hideCookieBar();
    showNotification("Solo se han aceptado cookies necesarias");
  }

  // Mostrar modal de configuración
  function showCookieModal() {
    if (cookieModal) {
      cookieModal.classList.add("show");

      // Cargar preferencias existentes
      const analyticsAccepted = localStorage.getItem("analyticsCookies") === "true";
      const marketingAccepted = localStorage.getItem("marketingCookies") === "true";

      if (analyticsCheckbox) analyticsCheckbox.checked = analyticsAccepted;
      if (marketingCheckbox) marketingCheckbox.checked = marketingAccepted;
    }
  }

  // Guardar preferencias personalizadas
  function saveCookiePreferences() {
    const analyticsAccepted = analyticsCheckbox ? analyticsCheckbox.checked : false;
    const marketingAccepted = marketingCheckbox ? marketingCheckbox.checked : false;

    localStorage.setItem("cookiesAccepted", "custom");
    localStorage.setItem("analyticsCookies", analyticsAccepted.toString());
    localStorage.setItem("marketingCookies", marketingAccepted.toString());

    if (cookieModal) cookieModal.classList.remove("show");
    hideCookieBar();
    showNotification("Preferencias de cookies guardadas");
  }

  // Event listeners seguros
  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener("click", acceptAllCookies);
  }

  if (cookieAcceptNecessary) {
    cookieAcceptNecessary.addEventListener("click", acceptNecessaryCookies);
  }

  if (cookieConfigure) {
    cookieConfigure.addEventListener("click", showCookieModal);
  }

  if (cookieSave) {
    cookieSave.addEventListener("click", saveCookiePreferences);
  }

  if (cookieCancel) {
    cookieCancel.addEventListener("click", () => {
      if (cookieModal) cookieModal.classList.remove("show");
    });
  }

  // Inicialización con retraso para mejor UX
  setTimeout(showCookieBar, 1500);

  // =============================================
  // 9. POPUP PERSONALIZACIÓN AL SCROLL
  // =============================================
  const personalizacionPopup = document.getElementById("personalizacion-popup");
  const popupClose = document.querySelector(".popup-close");

  // Mostrar popup con animación
  function showCustomizationPopup() {
    if (personalizacionPopup) {
      personalizacionPopup.style.display = "flex";
      void personalizacionPopup.offsetWidth; // Forzar reflow para activar la animación
      setTimeout(() => {
        personalizacionPopup.classList.add("show");
      }, 50);
    }
  }

  // Ocultar popup
  function hideCustomizationPopup() {
    if (personalizacionPopup) {
      personalizacionPopup.classList.remove("show");
      setTimeout(() => {
        personalizacionPopup.style.display = "none";
      }, 400);
    }
  }

  // Mostrar popup al recorrer la mitad de la sección "story-section"
  function handleScrollForPopup() {
    if (storySectionElement) {
      const sectionRect = storySectionElement.getBoundingClientRect();
      const sectionMidpoint = sectionRect.top + sectionRect.height / 2;
      if (sectionMidpoint <= window.innerHeight) {
        showCustomizationPopup();
        window.removeEventListener("scroll", handleScrollForPopup); // Evitar múltiples activaciones
      }
    }
  }

  // Event listeners
  if (popupClose) {
    popupClose.addEventListener("click", (e) => {
      e.preventDefault();
      hideCustomizationPopup();
    });
  }

  if (personalizacionPopup) {
    personalizacionPopup.addEventListener("click", (e) => {
      if (e.target.classList.contains("popup-overlay")) {
        hideCustomizationPopup();
      }
    });
  }

  // Cierra el popup cuando se pincha en "Personalizar ahora"
  const customizationButton = document.querySelector(".popup-text .cta-button");
  if (customizationButton) {
    customizationButton.addEventListener("click", (e) => {
      e.preventDefault();
      hideCustomizationPopup();
      const target = customizationButton.getAttribute("href");
      if (target.startsWith("#")) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Inicialización - Mostrar al recorrer la mitad de la sección
  window.addEventListener("scroll", handleScrollForPopup);

  // =============================================
  // 10. NOTIFICACIÓN DE ITEMS EN EL CARRITO
  // =============================================
  class ShoppingCart {
    constructor() {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
      this.updateCartCount();
    }

    getTotalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCount() {
      const count = this.getTotalItems();
      const cartCountElements = document.querySelectorAll(".cart-count");

      cartCountElements.forEach((element) => {
        if (count > 0) {
          element.textContent = count;
          element.style.display = "flex";
        } else {
          element.style.display = "none";
        }
      });
    }
  }

  // Inicializar carrito
  const cart = new ShoppingCart();

  // Actualizar enlaces del carrito para incluir el contador
  const cartLinks = document.querySelectorAll(".header_link.icon-cart, .mobile-icons .icon-cart");

  cartLinks.forEach((link) => {
    const countSpan = document.createElement("span");
    countSpan.className = "cart-count";
    link.appendChild(countSpan);
  });

  cart.updateCartCount();
});

var anime = anime || {};
