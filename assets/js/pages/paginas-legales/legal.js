// Script para los acordeones
document.addEventListener("DOMContentLoaded", () => {
  const articles = document.querySelectorAll(".legal-article");

  articles.forEach((article) => {
    const header = article.querySelector(".article-header");

    header.addEventListener("click", () => {
      article.classList.toggle("active");
    });
  });

  // Activar el primer artículo por defecto
  if (articles.length > 0) {
    articles[0].classList.add("active");
  }
});
