// ==================
// CARRITO DE COMPRAS
// ==================
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.updateCartCount();
    this.setupCartEventListeners();
    this.isAddingToCart = false;
    this.captureQueue = [];
    this.isProcessingQueue = false;
    this.MAX_CAPTURE_ATTEMPTS = 5;
    this.CAPTURE_TIMEOUT = 5000; // 5 segundos
  }

  async processCaptureQueue() {
    if (this.isProcessingQueue || this.captureQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.captureQueue.length > 0) {
      const { resolve, reject, item, attempts = 0 } = this.captureQueue.shift();

      try {
        const imageData = await this.attemptCaptureWithRetry(item, attempts);
        resolve(imageData);
      } catch (error) {
        if (attempts < this.MAX_CAPTURE_ATTEMPTS - 1) {
          // Reintentar
          this.captureQueue.unshift({
            resolve,
            reject,
            item,
            attempts: attempts + 1,
          });
        } else {
          // Fallback a imagen genérica
          resolve(this.getGenericCandleImage(item));
        }
      }

      // Pequeña pausa entre capturas
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    this.isProcessingQueue = false;
  }

  async captureCandleImage() {
    return new Promise((resolve, reject) => {
      this.captureQueue.push({
        resolve,
        reject,
        item: null,
        attempts: 0,
      });

      if (!this.isProcessingQueue) {
        this.processCaptureQueue();
      }
    });
  }

  async attemptCaptureWithRetry(item, attempt) {
    const candlePreview = document.querySelector(".candle-preview");
    if (!candlePreview) {
      return this.getGenericCandleImage(item);
    }

    // Configuración optimizada
    const captureWidth = 350;
    const captureHeight = 350;
    const candleScale = 0.6;
    const bgOpacity = 0.3;

    // Contenedor único para esta captura
    const containerId = `temp-candle-container-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.width = `${captureWidth}px`;
    container.style.height = `${captureHeight}px`;
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.backgroundColor = "transparent";
    container.style.overflow = "hidden";
    container.style.zIndex = "-1000";

    // Clon optimizado
    const clone = candlePreview.cloneNode(true);
    clone.id = `temp-candle-preview-capture-${Date.now()}`;
    clone.style.position = "relative";
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.transform = "none";
    clone.style.opacity = "1";
    clone.style.visibility = "visible";
    clone.style.display = "block";
    clone.style.padding = "0";
    clone.style.margin = "0";

    // Optimización del modelo de vela
    const candleModel = clone.querySelector(".candle-model");
    if (candleModel) {
      candleModel.style.position = "absolute";
      candleModel.style.top = "50%";
      candleModel.style.left = "50%";
      candleModel.style.transform = `translate(-50%, -50%) scale(${candleScale})`;
      candleModel.style.transformOrigin = "center center";
      candleModel.style.willChange = "transform";
    }

    // Optimización del fondo
    const candleBg = clone.querySelector(".candle-background");
    if (candleBg) {
      candleBg.style.width = "100%";
      candleBg.style.height = "100%";
      candleBg.style.opacity = bgOpacity;
      candleBg.style.objectFit = "cover";
      candleBg.style.position = "absolute";
      candleBg.style.top = "0";
      candleBg.style.left = "0";
    }

    container.appendChild(clone);
    document.body.appendChild(container);

    // Configuración de html2canvas
    const config = {
      backgroundColor: null,
      scale: 0.8,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: captureWidth,
      height: captureHeight,
      windowWidth: captureWidth,
      windowHeight: captureHeight,
      ignoreElements: (element) => {
        return element.id === "back-to-top" || element.classList.contains("notification");
      },
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.getElementById(containerId);
        if (clonedContainer) {
          clonedContainer.style.display = "flex";
          const clonedPreview = clonedContainer.firstChild;
          if (clonedPreview) {
            clonedPreview.style.position = "relative";
            clonedPreview.style.transform = "none";
          }
        }
      },
      async: true,
      removeContainer: true,
    };

    try {
      // Usamos Promise.race con timeout
      const canvas = await Promise.race([
        html2canvas(container, config),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Capture timeout")), this.CAPTURE_TIMEOUT)),
      ]);

      return canvas.toDataURL("image/webp", 0.8);
    } finally {
      // Limpieza del contenedor
      const containerElement = document.getElementById(containerId);
      if (containerElement && containerElement.parentNode) {
        document.body.removeChild(containerElement);
      }
    }
  }

  getGenericCandleImage(item) {
    // Genera una imagen genérica basada en las características del item
    const basePath = "assets/media/img/candles/";

    const sizeMap = {
      Pequeña: "small",
      Mediana: "medium",
      Grande: "large",
    };

    const colorMap = {
      Beige: "beige",
      Crema: "cream",
      Arena: "sand",
      Caramelo: "caramel",
      Rojo: "red",
      "Marrón Oscuro": "dark-brown",
    };

    const flameMap = {
      Clásica: "classic",
      Ámbar: "amber",
      Blanca: "white",
      Azulada: "blue",
    };

    const size = sizeMap[item?.size || "Mediana"] || "medium";
    const color = colorMap[item?.color || "Beige"] || "beige";
    const flame = flameMap[item?.flame || "Clásica"] || "classic";

    return `${basePath}${size}-${color}-${flame}.webp`;
  }

  getCandleImagePath(item) {
    // Prioriza la imagen capturada, si no usa la genérica
    return item.image || this.getGenericCandleImage(item);
  }

  showNotification(message, isError = false) {
    document.querySelectorAll(".notification").forEach((el) => el.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${isError ? "error" : ""}`;
    notification.innerHTML = `
      <i class="fas ${isError ? "fa-exclamation-circle" : "fa-check"}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Nueva función para renderizar los elementos del carrito
  renderCartItems() {
    const cartItemsContainer = document.getElementById("cart-items-container");
    if (!cartItemsContainer) return;

    // Limpiar el contenedor
    cartItemsContainer.innerHTML = "";

    // Obtener los items del carrito
    const cartItems = this.cart;

    // Renderizar cada item
    cartItems.forEach((item, index) => {
      // Generar HTML para las opciones del producto
      let optionsHTML = "";
      // Si tienes un array de opciones, úsalo. Si no, usa los campos individuales.
      if (item.options && Array.isArray(item.options) && item.options.length > 0) {
        item.options.forEach((option) => {
          optionsHTML += `<span class="cart-item-option">${option}</span>`;
        });
      } else {
        // Compatibilidad con la estructura actual
        if (item.size) optionsHTML += `<span class="cart-item-option"><strong>Tamaño:</strong> ${this.formatOptionName(item.size)}</span>`;
        if (item.color) optionsHTML += `<span class="cart-item-option"><strong>Color:</strong> ${this.formatOptionName(item.color)}</span>`;
        if (item.flame) optionsHTML += `<span class="cart-item-option"><strong>Llama:</strong> ${this.formatOptionName(item.flame)}</span>`;
        if (item.scent) optionsHTML += `<span class="cart-item-option"><strong>Aroma:</strong> ${this.formatOptionName(item.scent)}</span>`;
      }

      // Crear el elemento del carrito
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";

      // Estructura HTML exacta como en la versión original
      cartItemElement.innerHTML = `
        <div class="cart-item-image-container">
          <img src="${this.getCandleImagePath(item)}" alt="${item.name}" class="cart-item-image"
            onerror="this.onerror=null;this.src='${this.getGenericCandleImage(item)}'">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.name}</h3>
          <div class="cart-item-options">
            ${optionsHTML}
          </div>
          <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} €</div>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-selector">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn plus" data-index="${index}">+</button>
          </div>
          <button class="remove-item" data-index="${index}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      `;

      // Añadir el elemento al contenedor
      cartItemsContainer.appendChild(cartItemElement);
    });
  }

  updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items-container");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const cartSummary = document.getElementById("cart-summary");

    this.updateCartCount();

    // Solo proceder si los elementos existen (para carrito.html)
    if (cartItemsContainer && emptyCartMessage && cartSummary) {
      if (this.cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        emptyCartMessage.style.display = "block";
        cartSummary.style.display = "none";
        return;
      }

      emptyCartMessage.style.display = "none";
      cartSummary.style.display = "block";
      // Usar la nueva función para renderizar los items
      this.renderCartItems();

      const subtotal = this.getTotalPrice();
      document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " €";
      document.getElementById("total").textContent = subtotal.toFixed(2) + " €";

      this.setupCartEventListeners();
    }
  }

  setupCartEventListeners() {
    // Función optimizada para solo manejar botones del carrito
    const replaceCartButtons = (selector) => {
      const buttons = Array.from(document.querySelectorAll(selector));
      return buttons.map((btn) => {
        if (btn.closest(".cart-item-actions") || btn.id === "checkout-btn" || btn.classList.contains("cta-button")) {
          const newBtn = btn.cloneNode(true);
          btn.replaceWith(newBtn);
          return newBtn;
        }
        return btn;
      });
    };

    // Reemplazar y obtener los nuevos botones
    const minusButtons = replaceCartButtons(".quantity-btn.minus");
    const plusButtons = replaceCartButtons(".quantity-btn.plus");
    const removeButtons = replaceCartButtons(".remove-item");
    const checkoutButton = replaceCartButtons("#checkout-btn")[0];
    const ctaButton = replaceCartButtons(".cta-button")[0];

    // Asignar eventos solo a los botones del carrito
    minusButtons.forEach((btn) => {
      if (btn && btn.classList) {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          this.updateQuantity(index, this.cart[index].quantity - 1);
        });
      }
    });

    plusButtons.forEach((btn) => {
      if (btn && btn.classList) {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          this.updateQuantity(index, this.cart[index].quantity + 1);
        });
      }
    });

    removeButtons.forEach((btn) => {
      if (btn && btn.classList) {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          this.removeItem(index);
        });
      }
    });

    if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
        alert("Redirigiendo al proceso de pago...");
      });
    }

    // Configuración del botón Añadir al carrito
    if (ctaButton && !ctaButton.hasListener) {
      const handler = async () => {
        if (this.isAddingToCart) return;
        await this.handleAddToCart(ctaButton);
      };

      ctaButton.addEventListener("click", handler);
      ctaButton.hasListener = true;
    }
  }

  async handleAddToCart(button) {
    if (this.isAddingToCart) return;
    this.isAddingToCart = true;

    const originalText = button.textContent;
    const originalHTML = button.innerHTML;

    try {
      // Validar que se haya seleccionado un aroma
      const selectedScent = document.querySelector(".scent-option.selected");
      if (!selectedScent) {
        // Solo mostrar la notificación si NO es el botón de farolillo
        if (!button.id || button.id !== "add-ceramic-lantern") {
          this.showNotification("Por favor selecciona un aroma antes de añadir al carrito", true);
        }
        button.innerHTML = originalHTML;
        button.disabled = false;
        this.isAddingToCart = false;
        return;
      }

      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
      button.disabled = true;

      // Captura de imagen con sistema de cola mejorado
      const candleImage = await this.captureCandleImage();

      const getSelectedOption = (selector, attr, defaultValue) => {
        const el = document.querySelector(selector);
        return el ? (attr ? el.getAttribute(attr) : el.textContent) : defaultValue;
      };

      const newItem = {
        id: Date.now().toString(),
        name: "Vela personalizada",
        color: getSelectedOption(".color-option.selected", "title", "Beige"),
        flame: getSelectedOption(".flame-color-option.selected", "title", "Clásica"),
        size: getSelectedOption(".size-option.selected div:first-child", null, "Mediana"),
        sizeValue: getSelectedOption(".size-option.selected", "data-scale", "1"),
        scent: getSelectedOption(".scent-option.selected", "data-scent", "Sin aroma"),
        price: parseFloat(getSelectedOption(".size-option.selected .price-amount", null, "0")),
        image: candleImage,
        quantity: 1,
      };

      const existingIndex = this.cart.findIndex(
        (item) =>
          item.name === newItem.name &&
          item.color === newItem.color &&
          item.flame === newItem.flame &&
          item.size === newItem.size &&
          item.scent === newItem.scent &&
          item.price === newItem.price
      );

      if (existingIndex >= 0) {
        this.cart[existingIndex].quantity += 1;
      } else {
        this.cart.push(newItem);
      }

      this.saveCart();
      this.updateCartUI();
      this.showNotification("Producto añadido al carrito");

      button.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        this.isAddingToCart = false;
      }, 1500);
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      button.innerHTML = originalHTML;
      button.textContent = "Añadir al carrito";
      button.disabled = false;
      this.isAddingToCart = false;
    }
  }

  addItem(product) {
    this.cart.push(product);
    this.saveCart();
    this.updateCartUI();
    this.showNotification("Producto añadido al carrito");
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  }

  updateQuantity(index, quantity) {
    if (quantity > 0) {
      this.cart[index].quantity = quantity;
    } else {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.updateCartUI();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartUI();
  }

  saveCart() {
    try {
      // Limpiar imágenes muy grandes para no exceder localStorage
      const cartToSave = this.cart.map((item) => {
        if (item.image && item.image.length > 500000) {
          // > 500KB
          return { ...item, image: null };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(cartToSave));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
      // Si falla por tamaño, guardar sin imágenes
      const cartWithoutImages = this.cart.map((item) => ({ ...item, image: null }));
      localStorage.setItem("cart", JSON.stringify(cartWithoutImages));
    }
  }

  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  updateCartCount() {
    const count = this.getTotalItems();
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  // Añadir función para formatear el aroma
  formatScentName(scent) {
    if (!scent) return "";
    // Reemplaza guiones por espacios y pone mayúsculas iniciales
    return scent
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Función genérica para formatear opciones (tamaño, color, llama, aroma)
  formatOptionName(option) {
    if (!option) return "";
    return option
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el carrito
  const cart = new ShoppingCart();

  // Actualizar contador del carrito
  document.querySelectorAll(".header_link.icon-cart, .mobile-icons .icon-cart").forEach((link) => {
    if (!link.querySelector(".cart-count")) {
      const countSpan = document.createElement("span");
      countSpan.className = "cart-count";
      link.appendChild(countSpan);
    }
  });

  cart.updateCartUI();

  // Botón "Volver arriba"
  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      backToTopButton.classList.toggle("show", window.pageYOffset > 300);
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Manejar el botón de añadir farolillo de cerámica
  document.getElementById("add-ceramic-lantern")?.addEventListener("click", function () {
    if (cart.isAddingToCart) return;

    const button = this;
    const originalHTML = button.innerHTML;
    const originalClass = button.className;

    cart.isAddingToCart = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Procesando...</span>';
    button.classList.add("show-text");
    button.disabled = true;

    const ceramicLantern = {
      // id: "ceramic-lantern-" + Date.now(), // Eliminado para evitar duplicados (Puede que lo use en otro producto)
      name: "Farolillo de Cerámica Artesanal",
      price: 89.9,
      image: "assets/media/img/productos/vela_2.webp",
      quantity: 1,
      description: "Farolillo de cerámica artesanal con vela incluida, creación exclusiva y limitada.",
    };

    // Buscar si ya existe el producto en el carrito
    const existingIndex = cart.cart.findIndex(
      (item) => item.name === ceramicLantern.name && item.price === ceramicLantern.price && item.image === ceramicLantern.image
    );

    setTimeout(() => {
      if (existingIndex >= 0) {
        cart.cart[existingIndex].quantity += 1;
        cart.saveCart();
        cart.updateCartUI();
        cart.showNotification("Producto añadido al carrito");
      } else {
        // Añadir un id único solo si es nuevo
        cart.addItem({ ...ceramicLantern, id: "ceramic-lantern-" + Date.now() });
      }
      button.innerHTML = '<i class="fas fa-check"></i> <span>¡Añadido!</span>';
      button.classList.add("show-text");

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.className = originalClass;
        button.disabled = false;
        cart.isAddingToCart = false;
      }, 1500);
    }, 500); // Pequeño retraso para mejor feedback visual
  });
});
