// Aguarda o carregamento completo do DOM (estrutura HTML) antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  /* Seleciona o botão de menu (hamburguer) e o header */
  const btnMenu = document.querySelector(".hamburger");
  const header = document.querySelector("header");

  /* Abre e fecha o menu em telas tablets e mobiles */
  if (btnMenu && header) {
    btnMenu.addEventListener("click", () => {
      header.classList.toggle("active-menu");
    });
  }
});