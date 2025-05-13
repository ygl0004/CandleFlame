// Script para manejar el foco de los campos del formulario
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".form-group input, .form-group textarea");

  inputs.forEach((input) => {
    // Asegurarse de que los placeholders estén vacíos
    input.setAttribute("placeholder", " ");

    // Manejar el evento focus
    input.addEventListener("focus", function () {
      const label = this.nextElementSibling;
      if (label && label.classList.contains("floating-label")) {
        label.style.color = "#dd5215"; // Color del acento al enfocar
      }
    });

    // Manejar el evento blur
    input.addEventListener("blur", function () {
      const label = this.nextElementSibling;
      if (label && label.classList.contains("floating-label")) {
        if (!this.value) {
          label.style.color = ""; // Restaurar color original
        }
      }
    });
  });

  // Restaurar color de los labels al resetear el formulario
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("reset", function () {
      setTimeout(function () {
        inputs.forEach((input) => {
          const label = input.nextElementSibling;
          if (label && label.classList.contains("floating-label")) {
            label.style.color = "";
          }
        });
      }, 0);
    });
  }
});
