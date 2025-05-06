document.addEventListener("DOMContentLoaded", function () {
  // 1. Fijar el tamaño del viewport SOLO al cargar y en cambio de orientación
  const setFixedViewport = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Ajustar altura del menú móvil si está abierto
    const headerNav = document.querySelector(".header_nav");
    if (headerNav && headerNav.classList.contains("show")) {
      headerNav.style.height = `${window.innerHeight}px`;
    }
  };

  // Solo ejecutar al cargar y en orientationchange
  setFixedViewport();
  window.addEventListener("orientationchange", setFixedViewport);

  // Establecer el color de cera inicial según la opción marcada por defecto
  const defaultWaxOption = document.querySelector(".color-option.selected");
  if (defaultWaxOption) {
    document.documentElement.style.setProperty("--wax-color-light", defaultWaxOption.dataset.colorLight);
    document.documentElement.style.setProperty("--wax-color-dark", defaultWaxOption.dataset.colorDark);
  }

  // Establecer el tamaño inicial de la vela
  document.documentElement.style.setProperty("--candle-scale", "1");

  // Sistema de partículas para la llama
  function createFlameParticles() {
    const container = document.querySelector(".flame-sparks");

    setInterval(() => {
      if (Math.random() > 0.5) {
        const particle = document.createElement("div");
        particle.className = "flame-particle";

        const xPos = 50 + (Math.random() * 20 - 10);

        particle.style.cssText = `
          position: absolute;
          bottom: 0;
          left: ${xPos}%;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: ${Math.random() > 0.7 ? "var(--flame-secondary)" : "var(--flame-primary)"};
          border-radius: 50%;
          filter: blur(1px);
          opacity: ${Math.random() * 0.8 + 0.2};
          transform-origin: bottom;
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

  // Interacción con el color de cera
  document.querySelectorAll(".color-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".color-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      this.classList.add("selected");

      document.documentElement.style.setProperty("--wax-color-light", this.dataset.colorLight);
      document.documentElement.style.setProperty("--wax-color-dark", this.dataset.colorDark);

      updatePrice();
    });
  });

  // Interacción con el color de llama
  document.querySelectorAll(".flame-color-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".flame-color-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      this.classList.add("selected");

      const flameLayers = document.querySelectorAll(".flame-layer");
      flameLayers.forEach((layer) => {
        layer.classList.add("flame-transition-effect");
        setTimeout(() => {
          layer.classList.remove("flame-transition-effect");
        }, 800);
      });

      setTimeout(() => {
        document.documentElement.style.setProperty("--flame-primary", this.dataset.flamePrimary);
        document.documentElement.style.setProperty("--flame-secondary", this.dataset.flameSecondary);
        document.documentElement.style.setProperty("--flame-glow", this.dataset.flameGlow);

        const spark = document.createElement("div");
        spark.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 15px;
          height: 15px;
          background: ${this.dataset.flameSecondary};
          border-radius: 50%;
          filter: blur(3px);
          transform: translateX(-50%);
          z-index: 10;
          opacity: 0;
        `;
        document.querySelector(".flame-sparks").appendChild(spark);

        anime({
          targets: spark,
          translateY: [-20, -40],
          scale: [0.5, 2],
          opacity: [0.8, 0],
          duration: 600,
          easing: "easeOutQuad",
          complete: () => spark.remove(),
        });
      }, 200);

      updatePrice();
    });
  });

  // Interacción con el tamaño
  document.querySelectorAll(".size-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".size-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      this.classList.add("selected");

      const candleModel = document.querySelector(".candle-model");
      candleModel.classList.add("size-changing");

      setTimeout(() => {
        document.documentElement.style.setProperty("--candle-scale", this.dataset.scale);
        candleModel.classList.remove("size-changing");
      }, 600);

      updatePrice();
    });
  });

  // Interacción con el aroma
  document.querySelectorAll(".scent-option").forEach((option) => {
    option.addEventListener("click", function () {
      const parent = this.parentElement;
      parent.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
      this.classList.add("selected");

      const candleBg = document.querySelector(".candle-background");
      candleBg.style.opacity = "0";

      setTimeout(() => {
        const bgImage = this.dataset.bgImage;
        document.documentElement.style.setProperty("--bg-image", `url('${bgImage}')`);
        candleBg.style.opacity = "0.3";
      }, 400);

      updatePrice();
    });
  });

  // Interacción con el mouse para efecto 3D
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

  // Actualizar precio
  function updatePrice() {
    const sizeOption = document.querySelector(".size-option.selected");
    const basePrice = 24.99;
    let price = basePrice;

    if (sizeOption) {
      const scale = parseFloat(sizeOption.dataset.scale);
      price = basePrice * scale;
    }

    // Mostrar precio formateado
    // document.querySelector(".price-display").textContent = `$${price.toFixed(2)}`;
  }

  // Inicializar efectos
  createFlameParticles();

  // Función para actualizar características
  function updateFeatures() {
    // Tamaño
    const sizeOption = document.querySelector(".size-option.selected");
    if (sizeOption) {
      const sizeText = sizeOption.querySelector("div:first-child").textContent;
      document.getElementById("feature-size").textContent =
        sizeOption.dataset.scale === "0.8" ? "8cm" : sizeOption.dataset.scale === "1" ? "12cm" : "16cm";

      // Actualizar tiempo de uso basado en tamaño
      document.getElementById("feature-burn-time").textContent =
        sizeOption.dataset.scale === "0.8" ? "20h" : sizeOption.dataset.scale === "1" ? "25h" : "36h";
    }

    // Aroma
    const scentOption = document.querySelector(".scent-option.selected");
    if (scentOption) {
      document.getElementById("feature-scent").textContent = scentOption.querySelector("div:last-child").textContent;
    }

    // Color de llama
    const flameOption = document.querySelector(".flame-color-option.selected");
    if (flameOption) {
      document.getElementById("feature-flame").textContent = flameOption.getAttribute("title");
    }

    // Color de cera
    const waxOption = document.querySelector(".color-option.selected");
    if (waxOption) {
      document.getElementById("feature-color").textContent = waxOption.getAttribute("title");
    }
  }

  // Llama a updateFeatures cuando se selecciona cualquier opción
  document.querySelectorAll(".color-option, .flame-color-option, .size-option, .scent-option").forEach((option) => {
    option.addEventListener("click", updateFeatures);
  });

  // Inicializar características
  updateFeatures();
});
