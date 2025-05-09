const BASE_URL = import.meta.env.VITE_API_URL

export async function obtenerPedidos() {
  const response = await fetch(`${BASE_URL}/orders/`, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener los pedidos");

  return await response.json();
}

export async function CrearPedido(orderItems, status = "Pendiente") {
  const response = await fetch(`${BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status, items: orderItems }),
  });

  if (!response.ok) throw new Error("Error al crear Orden");

  return await response.json();
}

//funcion que solo edita el estado del orden
export async function actualizarEstadoOrden(id, newStatus) {
  const response = await fetch(`${BASE_URL}/orders/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el estado de la orden.");
  }

  return await response.json(); // respuesta con todos los datos actualizados
}


export async function actualizarTotalOrden(orderId, status, items) {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      status: status,  // "pending", "paid", etc.
      items: items,    // array con product y quantity actualizados
    }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la orden.");
  }

  return await response.json();
}

export async function eliminarOrden(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/orders/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la orden");
  }

  return true; // Podés devolver true si querés usarlo como confirmación
}
