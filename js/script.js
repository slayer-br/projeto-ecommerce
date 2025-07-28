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

/* Seleciona os botões de adicionar ao carrinho */
const btnAddToCart = document.querySelectorAll(".add-to-cart");

/* Adiciona os eventos de clique aos botões */
btnAddToCart.forEach((button) => {
  button.addEventListener("click", (event) => {
    const elementProduct = event.target.closest(".product"); // Seleciona o elemento pai com a classe 'product'

    const productId = elementProduct.dataset.id; // Obtém o ID do produto via atributo data-id

    const productName = elementProduct.querySelector(".name").textContent; // Obtém o nome do produto

    const productImage = elementProduct.querySelector("img").getAttribute("src"); // Obtém a URL da imagem do produto

    const productPrice = parseFloat(
      elementProduct.querySelector(".price").textContent.replace("R$ ", "").replace(".", "").replace(",", ".") // Converte o texto do preço para número
    );

    const product = {
      id: productId,
      name: productName,
      image: productImage,
      price: productPrice,
      quantity: 1,
    };

    const cart = getProductsFromCart(); // recupera os produtos salvos no carrinho

    /* Verifica se o produto já existe no carrinho do localStorage */
    const existProductInCart = cart.find((item) => item.id === productId);

    if (existProductInCart) {
      existProductInCart.quantity = (existProductInCart.quantity || 1) + 1;
    } else {
      cart.push(product);
    }

    saveCartToLocalStorage(cart); // Salva o carrinho no localStorage
    updateCartAndTable(); // Atualiza contador, tabla e total do carrinho
  });
});

/* Função para obter os produtos do carrinho do localStorage */
function getProductsFromCart() {
  const products = localStorage.getItem("cart"); // Acessa o conteúdo salvo no carrinho
  return products ? JSON.parse(products) : []; // Converte para objeto ou retorna array vazio
}

/* Função para salvar os produtos no carrinho do localStorage */
function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* Função para atualizar o contador de produtos do carrinho */
function updateCartCount() {
  const products = getProductsFromCart();
  let totalQuantity = 0;

  products.forEach((product) => {
    totalQuantity += product.quantity;
  });

  const cartCountElement = document.getElementById("cart-counter");
  if (cartCountElement) {
    cartCountElement.textContent = totalQuantity;
  }
}

/* Função para renderiza os produtos para a Tabela do modal */
function renderTableFromCart() {
  const products = getProductsFromCart();

  const tableBody = document.querySelector("#modal-1-content table tbody");

  if (!tableBody) return;

  tableBody.innerHTML = ""; // Limpa o conteúdo da tabela

  products.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="td-product">
        <img src="${product.image}" alt="${product.name}"  />
      </td>
      <td class="td-description">${product.name}</td>
      <td class="td-price">R$ ${product.price.toFixed(2).replace(".", ",")}</td>
      <td class="td-quantity"><input type="number" class="input-quantify" data-id="${product.id}" value="${
      product.quantity
    }" min="1" /></td>
      <td class="td-total">R$ ${(product.price * product.quantity).toFixed(2).replace(".", ",")}</td>
      <td class="td-actions">
        <button class="remove-item" id="delete" data-id="${product.id}"></button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

const tableBody = document.querySelector("#modal-1-content table tbody");

if (tableBody) {
  tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item")) {
      const id = event.target.dataset.id;
      removeProductToCart(id);
    }
  });

  // Evento para alterar a quantidade diretamente na tabela
  tableBody.addEventListener("input", function (event) {
    if (event.target.classList.contains("input-quantify")) {
      const id = event.target.getAttribute("data-id");
      let newQuantity = parseInt(event.target.value, 10);

      if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;

      const cart = getProductsFromCart();
      const product = cart.find((product) => product.id === id);

      if (product) {
        product.quantity = newQuantity;
        saveCartToLocalStorage(cart);
        updateCartAndTable();
      }
    }
  });
}

/* Função para remover produto do carrinho com base no ID */
function removeProductToCart(id) {
  const products = getProductsFromCart();
  /* Filtra os  produtos sem o id do parâmetro*/
  const cartUpdated = products.filter((product) => product.id !== id);
  saveCartToLocalStorage(cartUpdated);
  updateCartAndTable();
}

/* Função para atualizar o valor total do carrinho */
function updateTotalCart() {
  const cart = getProductsFromCart();

  let total = 0;

  cart.forEach((product) => {
    total += product.price * product.quantity || 1;
  });

  const totalSpan = document.getElementById("total-cart");

  if (totalSpan) {
    totalSpan.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
  }
}

/* Função principal que atualiza contador, tabela e total */
function updateCartAndTable() {
  updateCartCount();
  renderTableFromCart();
  updateTotalCart();
}

/* Executa a atualização inicial ao carregar a página */
updateCartAndTable();
