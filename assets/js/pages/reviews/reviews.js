document.addEventListener("DOMContentLoaded", function() {
  // =============================================
  // 1. SCROLL SUAVE PARA ANCLAS
  // =============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
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
    const form = document.getElementById('new-review-form');
    const photoInput = document.getElementById('review-photos');
    const previewContainer = document.querySelector('.upload-preview');
    
    if (!form || !photoInput) return;
    
    // Previsualización de fotos
    photoInput.addEventListener('change', function() {
      previewContainer.innerHTML = '';
      
      if (this.files.length > 3) {
        window.showNotification('Solo puedes subir hasta 3 imágenes');
        this.value = '';
        return;
      }
      
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          window.showNotification('Las imágenes deben ser menores de 5MB');
          this.value = '';
          previewContainer.innerHTML = '';
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          window.showNotification('Solo se permiten archivos de imagen');
          continue;
        }
        
        const reader = new FileReader();
        const previewItem = document.createElement('div');
        previewItem.className = 'upload-preview-item';
        
        reader.onload = function(e) {
          previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Vista previa">
            <div class="remove-btn"><i class="fas fa-times"></i></div>
          `;
          
          const removeBtn = previewItem.querySelector('.remove-btn');
          removeBtn.addEventListener('click', function() {
            previewItem.remove();
            // No podemos modificar directamente FileList, así que reiniciamos el input
            if (previewContainer.children.length === 0) {
              photoInput.value = '';
            }
          });
        };
        
        reader.readAsDataURL(file);
        previewContainer.appendChild(previewItem);
      }
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí iría la lógica para enviar los datos al servidor
      // Por ahora, solo simulamos el envío
      
      // Mostrar notificación de éxito
      const toastMessage = this.getAttribute('data-toast');
      if (toastMessage) {
        window.showNotification(toastMessage);
      }
      
      // Resetear formulario
      this.reset();
      previewContainer.innerHTML = '';
      
      // Scroll hacia arriba
      window.scrollTo({
        top: form.offsetTop - 100,
        behavior: 'smooth'
      });
    });
  }
  
  // Inicializar formulario
  initReviewForm();
  
  // =============================================
  // 3. PREGUNTAS FRECUENTES (FAQ)
  // =============================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cerrar todos los items
        faqItems.forEach(faq => {
          faq.classList.remove('active');
        });
        
        // Abrir el actual si no estaba abierto
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
    
    // Abrir el primer item por defecto
    if (faqItems.length > 0) {
      faqItems[0].classList.add('active');
    }
  }
  
  // Inicializar FAQ
  initFAQ();
  
  // =============================================
  // 4. NOTIFICACIONES
  // =============================================
  // Función global para mostrar notificaciones
  window.showNotification = function(message) {
    // Verificar si ya existe la función en el ámbito global
    if (typeof window.showNotification === 'function' && window.showNotification !== arguments.callee) {
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