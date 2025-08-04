document.addEventListener("DOMContentLoaded", () => {
  /* Seleciona o botão de menu (hamburguer) e o header */
  const btnMenu = document.querySelector(".hamburger");
  const header = document.querySelector("header");

  if (btnMenu && header) {
    btnMenu.addEventListener("click", () => {
      header.classList.toggle("active-menu");
    });
  }
});
