document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // 1. SISTEMA DE VIEWPORT INTELIGENTE
  // =============================================
  let allowResize = false;
  const heroSection = document.querySelector(".hero, .customization-hero"); // Compatible con ambas páginas

  const setFixedViewport = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

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
  const mobileIcons = document.querySelector(".mobile-icons");

  // Efecto scroll para header
  window.addEventListener("scroll", function () {
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
          if (target.startsWith("#")) {
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
  const handleVideoDisplay = () => {
    const desktopVideo = document.getElementById("background-video-desktop");
    const mobileVideo = document.getElementById("background-video-mobile");

    if (window.innerWidth <= 768) {
      if (desktopVideo) desktopVideo.style.display = "none";
      if (mobileVideo) {
        mobileVideo.style.display = "block";
        mobileVideo.play().catch((e) => console.log("Autoplay prevented:", e));
      }
    } else {
      if (mobileVideo) mobileVideo.style.display = "none";
      if (desktopVideo) {
        desktopVideo.style.display = "block";
        desktopVideo.play().catch((e) => console.log("Autoplay prevented:", e));
      }
    }
  };

  // Inicialización de videos
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
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
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

  // Control del formulario de newsletter
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simular envío exitoso
      const emailInput = this.querySelector('input[type="email"]');
      emailInput.value = ""; // Limpiar el campo

      // Mostrar notificación
      showNotification("¡Gracias por suscribirte a nuestro newsletter!");
    });
  }

  // Notificaciones para formularios de contacto
  document.querySelectorAll("form[data-toast]").forEach((form) => {
    form.addEventListener("submit", function (e) {
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
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Scroll suave al hacer clic
  backToTopButton.addEventListener("click", function (e) {
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
  if (gallerySlides.length > 0) {
    let currentIndex = 0;

    // Función para cambiar de slide
    function changeSlide() {
      gallerySlides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % gallerySlides.length;
      gallerySlides[currentIndex].classList.add("active");
    }

    // Iniciar intervalo
    let slideInterval = setInterval(changeSlide, 6000); // Cambia cada 6 segundos

    // Pausar al hacer hover
    // const gallery = document.querySelector(".story-gallery");
    // if (gallery) {
    //   gallery.addEventListener("mouseenter", () => clearInterval(slideInterval));
    //   gallery.addEventListener("mouseleave", () => {
    //     clearInterval(slideInterval);
    //     slideInterval = setInterval(changeSlide, 6000); // Reiniciar intervalo
    //   });
    // }

    // Ajustar imágenes al cargar
    window.addEventListener("load", function () {
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
  // 8. GESTIÓN DE COOKIES (VERSIÓN MEJORADA)
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

  // Mostrar barra con animación mejorada
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

  
});
