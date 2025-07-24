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
    const existProductInCart = cart.find(
      (product) => product.id === productId
    );

    if (existProductInCart) {
      existProductInCart.quantity = (existProductInCart.quantity || 1) + 1;
    } else {
      cart.push(product);
    }

    saveCartToLocalStorage(cart);
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
