document.addEventListener("DOMContentLoaded", function () {
  // Elementos principales
  const transitionAnimation = document.getElementById("transition-animation");
  const skipButton = document.getElementById("skip-animation");
  const desktopVideo = document.getElementById("background-video-desktop");
  const mobileVideo = document.getElementById("background-video-mobile");
  const candleContainer = document.getElementById("candle-container");
  const mainContent = document.querySelectorAll(".video-container, header, main, footer");

  // Configuración de la animación
  const config = {
    fireParticles: 60,
    sparks: 30,
    sequenceDelay: 800,
    igniteDelay: 1500,
    lightWaveDuration: 1200,
  };

  // Ocultar contenido principal inicialmente
  mainContent.forEach(el => {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  });

  // Función para iniciar el video
  const startVideo = () => {
    return new Promise((resolve) => {
      const video = window.innerWidth <= 768 ? mobileVideo : desktopVideo;
      video.style.display = "block";

      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Video iniciado correctamente");
          resolve();
        }).catch(error => {
          console.error("Error al reproducir video:", error);
          // Fallback: Mostrar contenido aunque el video falle
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  // Función para mostrar contenido principal
  const showMainContent = () => {
    anime({
      targets: mainContent,
      opacity: 1,
      duration: 1000,
      easing: 'easeOutQuad',
      begin: function() {
        mainContent.forEach(el => {
          el.style.pointerEvents = "auto";
        });
      }
    });
  };

  // Finalizar animación y comenzar experiencia completa
  const completeExperience = () => {
    localStorage.setItem("animationShown", "true");
    
    anime({
      targets: transitionAnimation,
      opacity: 0,
      duration: 800,
      easing: 'easeOutQuad',
      complete: async function() {
        transitionAnimation.style.display = "none";
        await startVideo();
        showMainContent();
      }
    });
  };

  // Función para crear borde de fuego
  function createFireBorder() {
    const border = document.getElementById("fire-border");
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < config.fireParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "fire-particle";

      let posX, posY;
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: posX = Math.random() * width; posY = 0; break;
        case 1: posX = width; posY = Math.random() * height; break;
        case 2: posX = Math.random() * width; posY = height; break;
        case 3: posX = 0; posY = Math.random() * height; break;
      }

      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.width = `${Math.random() * 60 + 30}px`;
      particle.style.height = particle.style.width;
      particle.style.background = `radial-gradient(circle, hsl(${Math.random() * 30 + 15}, 100%, 50%) 0%, transparent 70%)`;
      border.appendChild(particle);
      animateFireParticle(particle);
    }
  }

  function animateFireParticle(particle) {
    anime({
      targets: particle,
      translateX: () => anime.random(-100, 100),
      translateY: () => anime.random(-100, 100),
      opacity: [
        { value: [0, 0.5], duration: 2000, easing: "easeOutQuad" },
        { value: [0.5, 0], duration: 4000, delay: 2000, easing: "easeInQuad" },
      ],
      scale: [
        { value: [0.3, 0.9], duration: 3000, easing: "easeOutSine" },
        { value: [0.9, 0.2], duration: 3000, easing: "easeInSine" },
      ],
      delay: Math.random() * 3000,
      complete: () => animateFireParticle(particle),
    });
  }

  // Iniciar experiencia de animación
  function startExperience() {
    anime({
      targets: ".message h1",
      opacity: [0, 1],
      translateY: ["50px", "0px"],
      duration: 1500,
      easing: "easeOutQuint",
      delay: config.sequenceDelay,
    });

    anime({
      targets: ".message p",
      opacity: [0, 1],
      translateY: ["30px", "0px"],
      duration: 1200,
      easing: "easeOutQuint",
      delay: config.sequenceDelay + 500,
    });

    anime({
      targets: "#candle-container",
      opacity: [0, 1],
      translateY: ["80px", "0px"],
      duration: 1200,
      easing: "easeOutBack",
      delay: config.sequenceDelay + 1000,
      complete: function() {
        anime({
          targets: ".hint",
          opacity: [0, 0.6],
          translateY: ["10px", "0px"],
          duration: 800,
          delay: 500,
        });
      },
    });
  }

  // Encender la vela (animación completa)
  function igniteTransformation() {
    const candle = document.getElementById("candle-container");
    candle.style.pointerEvents = "none";
    document.querySelector(".hint").style.opacity = "0";

    // Secuencia de animación de encendido
    anime({
      targets: ".wick",
      backgroundColor: ["#2c1a0a", "#ff5500"],
      height: ["15px", "12px"],
      duration: 400,
    });

    anime({
      targets: ".wick-glow",
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 300,
      delay: 150,
    });

    anime({
      targets: ".wick-glow",
      scale: [1, 1.5],
      opacity: [1, 0],
      duration: 100,
      delay: 400,
    });

    anime({
      targets: ".flame",
      opacity: [0, 1],
      scale: [0.3, 1.3],
      duration: 200,
      delay: 500,
      complete: function() {
        anime({
          targets: ".flame",
          scale: [1.3, 0.9],
          duration: 100,
          complete: function() {
            animateFlame();
            createSparks();

            // Onda de luz final
            anime({
              targets: "#light-wave",
              opacity: [0, 0.8],
              scale: [0.1, 3],
              duration: config.lightWaveDuration,
              complete: function() {
                completeExperience();
              },
            });
          },
        });
      },
    });
  }

  // Animación continua de la llama
  function animateFlame() {
    anime({
      targets: ".flame",
      translateX: () => anime.random(-8, 8),
      translateY: () => anime.random(-5, 5),
      scaleX: () => anime.random(0.8, 1.2),
      scaleY: () => anime.random(0.8, 1.3),
      filter: () => `blur(${anime.random(5, 10)}px) brightness(${anime.random(1.1, 1.5)})`,
      duration: () => anime.random(400, 700),
      easing: "easeInOutSine",
      loop: true,
      direction: "alternate",
    });

    // Chispas aleatorias
    setInterval(() => {
      if (Math.random() > 0.5) createSparks(3 + Math.floor(Math.random() * 4));
    }, 400);
  }

  // Crear chispas
  function createSparks(count = config.sparks) {
    const candle = document.getElementById("candle-container");
    const rect = candle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${centerX}px`;
      spark.style.top = `${centerY - 12}px`;
      spark.style.width = `${Math.random() * 4 + 2}px`;
      spark.style.height = spark.style.width;
      spark.style.background = `radial-gradient(circle, hsl(${Math.random() * 30 + 20}, 100%, 50%) 0%, transparent 70%)`;
      document.getElementById("experience").appendChild(spark);

      anime({
        targets: spark,
        translateX: () => anime.random(-60, 60),
        translateY: () => anime.random(-100, -180),
        opacity: [1, 0],
        scale: [1, 0.2],
        duration: () => anime.random(500, 1000),
        delay: () => anime.random(0, 200),
        complete: () => spark.remove(),
      });
    }
  }

  // Evento para saltar animación
  skipButton.addEventListener("click", completeExperience);

  // Verificar si es la primera visita
  if (!localStorage.getItem("animationShown")) {
    transitionAnimation.style.display = "block";
    transitionAnimation.style.opacity = "1";

    // Iniciar animación
    anime({
      targets: "#transition",
      opacity: 0,
      duration: 1500,
      complete: startExperience,
    });
    
    createFireBorder();
    candleContainer.addEventListener("click", igniteTransformation);
  } else {
    // Si ya se mostró la animación, iniciar directamente
    startVideo().then(showMainContent);
  }
});