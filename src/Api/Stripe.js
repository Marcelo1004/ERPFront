const BASE_URL = import.meta.env.VITE_API_URL

export async function redirectToCheckout(cartItems) {
  const response = await fetch(
    `${BASE_URL}/checkout/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        items: cartItems,
      }),
    }
  );
  const data = await response.json();

  if (data.checkout_url) {
    localStorage.setItem("items_pagados", JSON.stringify(cartItems));
    localStorage.setItem("pagado", "true");

    window.location.href = data.checkout_url; // redirige directamente a Stripe
  } else {
    alert("No se pudo iniciar el pago.");
    console.error("Respuesta del backend:", data);
  }
}
