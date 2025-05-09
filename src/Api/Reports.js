const BASE_URL = import.meta.env.VITE_API_URL;

//generar reporte de los clientes
export async function generarReporteComprasCliente({ client_id }) {
  const url = `${BASE_URL}/products/simple-reports/client/?client_id=${client_id}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al generar el reporte de cliente");

  return await response.blob();
}

export async function generarReporteTopProductos() {

  const url = `${BASE_URL}/products/simple-reports/top-products/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al generar el reporte de productos");

  return await response.blob(); // PDF o Excel
}
