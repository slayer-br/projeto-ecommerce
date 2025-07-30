import {
  getProductsFromCart,
  saveCartToLocalStorage,
  updateCartAndTable,
  removeProductToCart,
} from "./services/cartServices.js";
import { calculateShipping } from "./services/shippingServices.js";
import { validateZipCode } from "./utilities/utilities.js";

updateCartAndTable();

const btnAddToCart = document.querySelectorAll(".add-to-cart");
btnAddToCart.forEach((button) => {
  button.addEventListener("click", (event) => {
    const elementProduct = event.target.closest(".product"); // Seleciona o elemento pai com a classe 'product'
    const productId = elementProduct.dataset.id; // Obtém o ID do produto via atributo data-id
    const productName = elementProduct.querySelector(".name").textContent; // Obtém o nome do produto
    const productImage = elementProduct.querySelector("img").getAttribute("src"); // Obtém a URL da imagem do produto
    const productPrice = parseFloat(
      elementProduct.querySelector(".price").textContent.replace("R$ ", "").replace(".", "").replace(",", ".") // Converte o texto do preço para número
    );

    const cart = getProductsFromCart(); // recupera os produtos salvos no carrinho
    const existProductInCart = cart.find((item) => item.id === productId);

    if (existProductInCart) {
      existProductInCart.quantity += 1;
    } else {
      cart.push({ productId, productName, productImage, productPrice, quantity: 1 });
    }

    saveCartToLocalStorage(cart); // Salva o carrinho no localStorage
    updateCartAndTable(); // Atualiza contador, tabla e total do carrinho
  });
});

const tableBody = document.querySelector("#modal-1-content table tbody");

if (tableBody) {
  tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item")) {
      const id = event.target.dataset.id;
      removeProductToCart(id);
      updateCartAndTable();
    }
  });

  // Evento para alterar a quantidade diretamente na tabela
  tableBody.addEventListener("input", (event) => {
    if (event.target.classList.contains("input-quantity")) {
      const id = event.target.dataset.id;
      let newQuantity = parseInt(event.target.value);

      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        event.target.value = 1;
      }

      const cart = getProductsFromCart();
      const product = cart.find((product) => product.id === id);

      if (product && product.quantity !== newQuantity) {
        product.quantity = newQuantity;
        saveCartToLocalStorage(cart);
        updateCartAndTable();
      }
    }
  });
}

const btnCalculateShipping = document.getElementById("calculate-shipping");
const inputZip = document.getElementById("zip");

/*  Validar CEP com enter */
inputZip.addEventListener("keydown", ({ key }) => {
  if (key === "Enter") {
    btnCalculateShipping.click();
  }
});

btnCalculateShipping.addEventListener("click", async () => {
  const zip = inputZip.value.trim();

  /* Validação do CEP */
  const errorZip = document.querySelector(".error-zip");

  if (!validateZipCode(zip)) {
    errorZip.textContent = "CEP inválido.";
    errorZip.style.display = "block";
    return;
  } else {
    errorZip.style.display = "none";
  }

  const valueShipping = await calculateShipping(zip, btnCalculateShipping);
  
  if (valueShipping === null) {
  alert("Erro ao calcular o frete. Tente novamente.");
  return;
}

  const formattedValue = valueShipping.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  document.querySelector("#shipping-cost .value").textContent = formattedValue;
  document.querySelector("#shipping-cost").style.display = "flex";

  const totalCart = document.querySelector("#total-cart");
  const valueTotalCart = parseFloat(
    totalCart.textContent.replace("Total: R$ ", "").replace(".", ",").replace(",", ".")
  );

  const totalIncludingShipping = valueTotalCart + valueShipping;
  const formattedTotal = totalIncludingShipping.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  totalCart.textContent = `Total: R$ ${formattedTotal}`;
});
