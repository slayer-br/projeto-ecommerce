/* Seleciona os botões de adicionar ao carrinho */
const btnAddToCart = document.querySelectorAll(".add-to-cart");

/* Adiciona os eventos de clique aos botões */
btnAddToCart.forEach((button) => {
  button.addEventListener("click", (event) => {
    const elementProduct = event.target.closest(".product");

    const productId = elementProduct.dataset.id;

    const productName = elementProduct.querySelector(".name").textContent;

    const productImage = elementProduct.querySelector("img").getAttribute("src");

    const productPrice = parseFloat(
      elementProduct.querySelector(".price").textContent.replace("R$ ", "").replace(".", "").replace(",", ".")
    );

    const product = {
      id: productId,
      name: productName,
      image: productImage,
      price: productPrice,
      quantity: 1,
    };

    const cart = getProductsFromCart();

    /* Verifica se o produto já existe no carrinho do localStorage */
    const existProductInCart = cart.find((product) => product.id === productId);

    if (existProductInCart) {
      existProductInCart.quantity = (existProductInCart.quantity || 1) + 1;
    } else {
      cart.push(product);
    }

    saveCartToLocalStorage(cart);
    updateCartCount();
    renderTableFromCart();
  });
});

/* Função para obter os produtos do carrinho do localStorage */
function getProductsFromCart() {
  const products = localStorage.getItem("cart");
  return products ? JSON.parse(products) : [];
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
updateCartCount();

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
      <td class="td-quantity"><input type="number" value="${product.quantity}" min="1" /></td>
      <td class="td-total">R$ ${(product.price * product.quantity).toFixed(2).replace(".", ",")}</td>
      <td class="td-actions">
        <button class="remove-item" id="delete" data-id="${product.id}"></button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

renderTableFromCart();

const tableBody = document.querySelector("#modal-1-content table tbody");
tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-item")) {
    const id = event.target.dataset.id;
    removeProductToCart(id);
  }
});

function removeProductToCart(id) {
  const products = getProductsFromCart()
  /* Filtra os  produtos sem o id do parâmetro*/
  const cartUpdated = products.filter(product => product.id !== id)
  saveCartToLocalStorage(cartUpdated)
  updateCartCount()
  renderTableFromCart()
}