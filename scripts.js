// scripts.js
document.addEventListener("DOMContentLoaded", function () {
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

  // Control del menú móvil con animaciones mejoradas
  if (menuButton) {
    menuButton.addEventListener("click", function () {
      const isOpen = headerNav.classList.contains("show");

      // Alternar estado del menú
      headerNav.classList.toggle("show");
      body.classList.toggle("menu-open");

      // Cambiar icono del botón
      const icon = this.querySelector("i");
      if (!isOpen) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        this.style.transform = "rotate(90deg)";

        // Configurar delays escalonados para los elementos del menú
        headerLinks.forEach((link, index) => {
          link.style.transitionDelay = `${0.1 + index * 0.1}s`;
        });

        // Configurar delay para los iconos móviles
        if (mobileIcons) {
          mobileIcons.style.transitionDelay = `${0.1 + headerLinks.length * 0.1}s`;
        }
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        this.style.transform = "rotate(0)";

        // Resetear delays al cerrar el menú
        headerLinks.forEach((link) => {
          link.style.transitionDelay = "0s";
        });

        if (mobileIcons) {
          mobileIcons.style.transitionDelay = "0s";
        }
      }
    });

    // Cerrar menú al hacer clic en un enlace (mobile)
    headerLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          headerNav.classList.remove("show");
          body.classList.remove("menu-open");

          const icon = menuButton.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
          menuButton.style.transform = "rotate(0)";

          // Resetear delays al cerrar el menú
          headerLinks.forEach((link) => {
            link.style.transitionDelay = "0s";
          });

          if (mobileIcons) {
            mobileIcons.style.transitionDelay = "0s";
          }
        }
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Cerrar menú móvil si está abierto
          if (window.innerWidth <= 768 && headerNav.classList.contains("show")) {
            headerNav.classList.remove("show");
            body.classList.remove("menu-open");

            const icon = menuButton.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
            menuButton.style.transform = "rotate(0)";
          }
        }
      }
    });
  });

  // Control de videos de fondo
  const desktopVideo = document.getElementById("background-video-desktop");
  const mobileVideo = document.getElementById("background-video-mobile");

  const handleVideoDisplay = () => {
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

  // Inicializar videos
  handleVideoDisplay();
  window.addEventListener("resize", handleVideoDisplay);

  // Animación al hacer scroll
  // const animateSections = document.querySelectorAll(".section-animate");

  // const observer = new IntersectionObserver(
  //   (entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         entry.target.style.opacity = 1;
  //         entry.target.style.transform = "translateY(0)";
  //       }
  //     });
  //   },
  //   { threshold: 0.1 }
  // );

  // animateSections.forEach((section) => {
  //   section.style.opacity = 0;
  //   section.style.transform = "translateY(20px)";
  //   section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  //   observer.observe(section);
  // });

  // Efecto hover para elementos de la colección
  document.querySelectorAll(".collection-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "var(--shadow-hover)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "var(--shadow)";
    });
  });

  // Validación del formulario de newsletter
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');

      if (emailInput.value && emailInput.checkValidity()) {
        const button = this.querySelector("button");
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.backgroundColor = "var(--color-accent-light)";

        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-paper-plane"></i>';
          button.style.backgroundColor = "var(--color-accent)";
          emailInput.value = "";
          showNotification("¡Gracias por suscribirte!");
        }, 1000);
      } else {
        emailInput.focus();
      }
    });
  }

  // Función para mostrar notificaciones (opcional)
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
});

// Añadir estilos para la notificación (opcional)
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
}
.notification.show {
  transform: translateX(-50%) translateY(0);
}
`;
document.head.appendChild(notificationStyles);
