document.addEventListener("DOMContentLoaded", () => {
  // =============================================
  // 1. SCROLL SUAVE PARA ANCLAS
  // =============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector("header")?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Inicializar scroll suave
  initSmoothScroll();

  // =============================================
  // 2. FORMULARIO DE OPINIÓN
  // =============================================
  function initReviewForm() {
    const form = document.getElementById("new-review-form");
    const photoInput = document.getElementById("review-photos");
    const previewContainer = document.querySelector(".upload-preview");
    const starLabels = document.querySelectorAll(".star-rating label");

    if (!form) return;

    // Mejorar interacción con las estrellas
    if (starLabels.length > 0) {
      starLabels.forEach((label) => {
        label.addEventListener("mouseenter", function () {
          // Asegurar que las estrellas se muestren correctamente al pasar el mouse
          const starValue = this.getAttribute("for").replace("star", "");
          highlightStars(starValue);
        });
      });

      document.querySelector(".star-rating").addEventListener("mouseleave", () => {
        // Restaurar la selección actual al quitar el mouse
        const checkedStar = document.querySelector(".star-rating input:checked");
        if (checkedStar) {
          const starValue = checkedStar.value;
          highlightStars(starValue);
        } else {
          resetStars();
        }
      });
    }

    function highlightStars(value) {
      starLabels.forEach((label) => {
        const labelValue = label.getAttribute("for").replace("star", "");
        const farIcon = label.querySelector(".far");
        const fasIcon = label.querySelector(".fas");

        if (labelValue <= value) {
          if (farIcon) farIcon.style.opacity = "0";
          if (fasIcon) fasIcon.style.opacity = "1";
        } else {
          if (farIcon) farIcon.style.opacity = "1";
          if (fasIcon) fasIcon.style.opacity = "0";
        }
      });
    }

    function resetStars() {
      starLabels.forEach((label) => {
        const farIcon = label.querySelector(".far");
        const fasIcon = label.querySelector(".fas");

        if (farIcon) farIcon.style.opacity = "1";
        if (fasIcon) fasIcon.style.opacity = "0";
      });
    }

    // Previsualización de fotos
    if (photoInput && previewContainer) {
      photoInput.addEventListener("change", function () {
        previewContainer.innerHTML = "";

        if (this.files.length > 3) {
          window.showNotification("Solo puedes subir hasta 3 imágenes");
          this.value = "";
          return;
        }

        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];

          if (file.size > 5 * 1024 * 1024) {
            window.showNotification("Las imágenes deben ser menores de 5MB");
            this.value = "";
            previewContainer.innerHTML = "";
            return;
          }

          if (!file.type.startsWith("image/")) {
            window.showNotification("Solo se permiten archivos de imagen");
            continue;
          }

          const reader = new FileReader();
          const previewItem = document.createElement("div");
          previewItem.className = "upload-preview-item";

          reader.onload = (e) => {
            previewItem.innerHTML = `
              <img src="${e.target.result}" alt="Vista previa">
              <div class="remove-btn"><i class="fas fa-times"></i></div>
            `;

            const removeBtn = previewItem.querySelector(".remove-btn");
            removeBtn.addEventListener("click", () => {
              previewItem.remove();
              // No podemos modificar directamente FileList, así que reiniciamos el input
              if (previewContainer.children.length === 0) {
                photoInput.value = "";
              }
            });
          };

          reader.readAsDataURL(file);
          previewContainer.appendChild(previewItem);
        }
      });
    }

    // Envío del formulario
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Aquí iría la lógica para enviar los datos al servidor
        // Por ahora, solo simulamos el envío

        // Mostrar notificación de éxito
        const toastMessage = this.getAttribute("data-toast");
        if (toastMessage) {
          window.showNotification(toastMessage);
        }

        // Resetear formulario
        this.reset();
        if (previewContainer) previewContainer.innerHTML = "";
        resetStars();

        // Scroll hacia arriba
        window.scrollTo({
          top: form.offsetTop - 100,
          behavior: "smooth",
        });
      });
    }
  }

  // Inicializar formulario
  initReviewForm();

  // =============================================
  // 3. PREGUNTAS FRECUENTES (FAQ)
  // =============================================
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Cerrar todos los items
        faqItems.forEach((faq) => {
          faq.classList.remove("active");
        });

        // Abrir el actual si no estaba abierto
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });

    // Abrir el primer item por defecto
    if (faqItems.length > 0) {
      faqItems[0].classList.add("active");
    }
  }

  // Inicializar FAQ
  initFAQ();

  // =============================================
  // 4. NOTIFICACIONES
  // =============================================
  // Función global para mostrar notificaciones
  window.showNotification = (message) => {
    // Verificar si ya existe la función en el ámbito global
    if (typeof window.showNotification === "function" && window.showNotification !== arguments.callee) {
      return window.showNotification(message);
    }

    // Implementación de fallback
    let notificationTimeout = null;
    let currentNotification = null;

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
  };
});
