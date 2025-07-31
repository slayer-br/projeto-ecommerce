import { hideShippingInfo } from "./shippingServices.js";
export function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getProductsFromCart() {
  const products = localStorage.getItem("cart"); 
  return products ? JSON.parse(products) : []; 
}

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


function renderTableFromCart() {
  const products = getProductsFromCart();
  const tableBody = document.querySelector("#modal-1-content table tbody");

  tableBody.innerHTML = products
    .map(
      (product) =>
        `
    <tr>
      <td class="td-product">
        <img src="${product.image}" alt="${product.name}"  />
      </td>
      <td class="td-description">${product.name}</td>
      <td class="td-price">${product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td class="td-quantity"><input type="number" class="input-quantity" data-id="${product.id}" value="${
          product.quantity
        }" min="1" /></td>
      <td class="td-total">${(product.price * product.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td class="td-actions">
        <button class="remove-item" id="delete" data-id="${product.id}"></button>
      </td>
    </tr>
    `
    )
    .join("");
}

export function removeProductToCart(id) {
  const cartUpdated = getProductsFromCart().filter((product) => product.id !== id);
  saveCartToLocalStorage(cartUpdated);
  hideShippingInfo()
  updateCartAndTable();
}

export function updateTotalCart() {

  const cart = getProductsFromCart();

  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  document.querySelector(".order-subtotal .value").textContent = `${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
  document.querySelector(".total-cart").textContent = `Total: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
}

window.addEventListener("shippingCleared", () => {
  updateTotalCart(); // atualiza o total com subtotal apenas
});

export function updateCartAndTable() {
  updateCartCount();
  renderTableFromCart();
  updateTotalCart();
}
