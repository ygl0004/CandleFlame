document.addEventListener("DOMContentLoaded", function () {
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

        // Cambiar color de la cera directamente con transición CSS
        document.documentElement.style.setProperty("--wax-color-light", this.dataset.colorLight);
        document.documentElement.style.setProperty("--wax-color-dark", this.dataset.colorDark);

        updatePrice();
      });
    });

    // Interacción con el color de llama - Versión mejorada
    document.querySelectorAll(".flame-color-option").forEach((option) => {
      option.addEventListener("click", function () {
        document.querySelectorAll(".flame-color-option").forEach((opt) => {
          opt.classList.remove("selected");
        });
        this.classList.add("selected");

        // Aplicar clase de transición a todas las capas de la llama
        const flameLayers = document.querySelectorAll(".flame-layer");
        flameLayers.forEach((layer) => {
          layer.classList.add("flame-transition-effect");

          // Eliminar la clase después de que termine la animación
          setTimeout(() => {
            layer.classList.remove("flame-transition-effect");
          }, 800);
        });

        // Cambiar los colores después de un breve retraso para sincronizar con la animación
        setTimeout(() => {
          document.documentElement.style.setProperty("--flame-primary", this.dataset.flamePrimary);
          document.documentElement.style.setProperty("--flame-secondary", this.dataset.flameSecondary);
          document.documentElement.style.setProperty("--flame-glow", this.dataset.flameGlow);

          // Efecto de chispa
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

        // Efecto de transición para el cambio de tamaño
        const candleModel = document.querySelector(".candle-model");
        candleModel.classList.add("size-changing");

        // Cambiar tamaño después del efecto
        setTimeout(() => {
          document.documentElement.style.setProperty("--candle-scale", this.dataset.scale);
          candleModel.classList.remove("size-changing");
        }, 600);

        updatePrice();
      });
    });

    // Interacción con el aroma (incluyendo cambio de fondo)
    document.querySelectorAll(".scent-option").forEach((option) => {
      option.addEventListener("click", function () {
        const parent = this.parentElement;
        parent.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
        this.classList.add("selected");

        // Cambiar imagen de fondo con transición
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

    // Interacción con el mouse para efecto 3D mejorado
    const candle = document.querySelector(".candle-model");
    const candlePreview = document.querySelector(".candle-preview");

    candlePreview.addEventListener("mousemove", (e) => {
      const rect = candlePreview.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 25;
      const rotateY = (0.5 - x) * 25;

      candle.style.transform = `
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;

      // Efecto de iluminación dinámica mejorado
      candle.style.filter = `
      drop-shadow(${(0.5 - x) * 15}px ${(0.5 - y) * 15}px 25px rgba(0,0,0,0.3))
    `;

      // Mover reflejo según la posición del mouse
      const reflection = document.querySelector(".candle-reflection");
      reflection.style.left = `${15 + (0.5 - x) * 10}%`;
      reflection.style.top = `${15 + (0.5 - y) * 10}%`;
    });

    candlePreview.addEventListener("mouseleave", () => {
      candle.style.transform = "rotateX(0deg) rotateY(0deg)";
      candle.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.15))";
      const reflection = document.querySelector(".candle-reflection");
      reflection.style.left = "15%";
      reflection.style.top = "15%";
    });

    // Actualizar precio
    function updatePrice() {
      const sizeOption = document.querySelector(".size-option.selected");
      const basePrice = 24.99;
      let price = basePrice;

      // Ajustar por tamaño
      if (sizeOption) {
        const scale = parseFloat(sizeOption.dataset.scale);
        price = basePrice * scale;
      }

      // Mostrar precio formateado
      // document.querySelector(".price-display").textContent = `$${price.toFixed(2)}`;
    }

    // Inicializar efectos
    createFlameParticles();
  });