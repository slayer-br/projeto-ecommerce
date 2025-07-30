/* Função para salvar os produtos no carrinho do localStorage */
export function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* Função para obter os produtos do carrinho do localStorage */
export function getProductsFromCart() {
  const products = localStorage.getItem("cart"); // Acessa o conteúdo salvo no carrinho
  return products ? JSON.parse(products) : []; // Converte para objeto ou retorna array vazio
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

  tableBody.innerHTML = products
    .map((product) => {
      `
    <tr>
      <td class="td-product">
        <img src="${product.image}" alt="${product.name}"  />
      </td>
      <td class="td-description">${product.name}</td>
      <td class="td-price">R$ ${product.price.toFixed(2).replace(".", ",")}</td>
      <td class="td-quantity"><input type="number" class="input-quantity" data-id="${product.id}" value="${
        product.quantity
      }" min="1" /></td>
      <td class="td-total">R$ ${(product.price * product.quantity).toFixed(2).replace(".", ",")}</td>
      <td class="td-actions">
        <button class="remove-item" id="delete" data-id="${product.id}"></button>
      </td>
    </tr>
    `;
    })
    .join(""); // Limpa o conteúdo da tabela
}

/* Função para remover produto do carrinho com base no ID */
export function removeProductToCart(id) {
  const cartUpdated = getProductsFromCart().filter((product) => product.id !== id);
  saveCartToLocalStorage(cartUpdated);
  updateCartAndTable();
}

/* Função para atualizar o valor total do carrinho */
function updateTotalCart() {
  const cart = getProductsFromCart();

  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  document.querySelector(".order-subtotal .value").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  document.querySelector(".total-cart").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

/* Função principal que atualiza contador, tabela e total */
export function updateCartAndTable() {
  updateCartCount();
  renderTableFromCart();
  updateTotalCart();
}
