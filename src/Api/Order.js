
const BASE_URL = import.meta.env.VITE_API_URL

export async function obtenerMisPedidos() {
  const response = await fetch(`${BASE_URL}/order-items/`, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener tus pedidos");

  return await response.json();
}

export async function CrearOrdenesItem(productId, quantity) {
  const response = await fetch(`${BASE_URL}/order-items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ product: productId, quantity }),
  });

  if (!response.ok) throw new Error("Error al crear OrderItem");

  return await response.json();
}

export async function EditarOrdenesItem(productId, quantity) {
  const response = await fetch(`${BASE_URL}/order-items/${productId}`,{
    method:"PATCH",
    headers:{
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({product:productId,quantity})
  });

  if(!response.ok) throw new Error("Error al editar la orden");

  return await response.json();
}

export async function eliminarOrderItem(id) {
  const response = await fetch(`${BASE_URL}/order-items/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el item del pedido");
  }

  return true;
}