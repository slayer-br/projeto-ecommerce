import { getProductsFromCart } from "./cartServices.js";
export async function calculateShipping(zip, btnCalculateShipping) {
  hideShippingInfo();

  btnCalculateShipping.disabled = true;
  const originalTextCalculateShippingBtn = btnCalculateShipping.textContent;
  btnCalculateShipping.textContent = "Calculando frete...";

  const url = "https://casilva.app.n8n.cloud/webhook/2ff47e4c-20f1-4423-bed6-0f25075bc62c";

  try {
    /* Busca as medidas dos produtos do arquivo JSON */
    const measuresResponse = await fetch("../measures-products.json");
    const measures = await measuresResponse.json();

    /* Monta array de produtos do carrinho com as medidas corretas */
    const cartProducts = getProductsFromCart();
    const products = cartProducts.map((product) => {
      /* Procura as medidas pelo id do produto */
      const measure = measures.find((m) => m.id === product.id);
      return {
        quantity: product.quantity,
        height: measure ? measure.height : 4,
        length: measure ? measure.length : 30,
        width: measure ? measure.width : 25,
        weight: measure ? measure.weight : 0.25,
      };
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ zip, products }),
    });
    if (!response.ok) throw new Error("Erro ao calcular o frete.");
    const result = await response.json();
    return result.price;
  } catch (erro) {
    console.error("Erro ao calcular o frete: ", erro);
    return null;
  } finally {
    btnCalculateShipping.disabled = false;
    btnCalculateShipping.textContent = originalTextCalculateShippingBtn;
  }
}

export function hideShippingInfo() {
  const shippingSection = document.querySelector("#shipping-cost");
  const shippingValue = document.querySelector("#shipping-cost .value");

  if (shippingSection) shippingSection.style.display = "none";
  if (shippingValue) shippingValue.textContent = "";

  const event = new CustomEvent("shippingCleared");
  window.dispatchEvent(event);
}
