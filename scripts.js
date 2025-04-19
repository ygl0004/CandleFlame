// scripts.js
// Header y menú móvil
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const menuButton = document.querySelector(".mobile-menu-button");
  const headerNav = document.querySelector(".header_nav");
  const body = document.body;

  // Efecto scroll para header
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Menú móvil
  if (menuButton) {
    if (!menuButton.querySelector("i")) {
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    }

    menuButton.addEventListener("click", function () {
      const isOpen = headerNav.classList.contains("show");

      headerNav.classList.toggle("show");
      body.classList.toggle("no-scroll");

      const icon = this.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");

      const iconsContainer = document.querySelector(".header_container_icons");
      if (!isOpen) {
        iconsContainer.style.display = "flex";
      } else {
        setTimeout(() => {
          iconsContainer.style.display = "none";
        }, 300);
      }
    });

    document.querySelectorAll(".header_nav a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          menuButton.classList.remove("active");
          headerNav.classList.remove("show");
          body.classList.remove("no-scroll");

          const icon = menuButton.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");

          setTimeout(() => {
            document.querySelector(".header_container_icons").style.display = "none";
          }, 300);
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

          if (window.innerWidth <= 768 && menuButton.classList.contains("active")) {
            menuButton.classList.remove("active");
            headerNav.classList.remove("show");
            body.classList.remove("no-scroll");

            const icon = menuButton.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");

            setTimeout(() => {
              document.querySelector(".header_container_icons").style.display = "none";
            }, 300);
          }
        }
      }
    });
  });

  // Ajustar video de fondo
  const adjustVideoSize = () => {
    const video = document.getElementById("background-video");
    if (video) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const videoRatio = video.videoWidth / video.videoHeight;
      const windowRatio = windowWidth / windowHeight;

      if (windowRatio < videoRatio) {
        video.style.width = "auto";
        video.style.height = "100%";
      } else {
        video.style.width = "100%";
        video.style.height = "auto";
      }
    }
  };

  window.addEventListener("load", adjustVideoSize);
  window.addEventListener("resize", adjustVideoSize);

  // Animación al hacer scroll
  const animateSections = document.querySelectorAll(".section-animate");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
        }
      });
    },
    { threshold: 0.1 }
  );

  animateSections.forEach((section) => {
    observer.observe(section);
  });

  const desktopVideo = document.getElementById("background-video-desktop");
  const mobileVideo = document.getElementById("background-video-mobile");

  if (window.innerWidth <= 768) {
    mobileVideo.style.display = "block";
    mobileVideo.play();
  } else {
    desktopVideo.style.display = "block";
    desktopVideo.play();
  }
});

// Efecto hover para elementos de la colección
document.querySelectorAll(".collection-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px)";
    this.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "";
    this.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  });
});

// Validación del formulario de newsletter
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');

    if (emailInput.value && emailInput.checkValidity()) {
      this.querySelector("button").innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        this.querySelector("button").innerHTML = '<i class="fas fa-paper-plane"></i>';
        emailInput.value = "";
        alert("¡Gracias por suscribirte!");
      }, 1000);
    } else {
      emailInput.focus();
    }
  });
}
