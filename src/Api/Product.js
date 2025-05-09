import { authService } from "./AuthService";

const BASE_URL = import.meta.env.VITE_API_URL;

// Manejador de respuestas mejorado
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  
  try {
    const data = contentType?.includes("application/json") 
      ? await response.json() 
      : await response.text();

    if (!response.ok) {
      console.error("Error en la respuesta:", data);
      const errorMessage = data.detail || 
                         data.message || 
                         (data.errors ? Object.values(data.errors).flat().join(', ') : null) || 
                         (typeof data === 'string' ? data : "Error en la solicitud");
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error al procesar la respuesta:", error);
    throw new Error("Error al procesar la respuesta del servidor");
  }
};

export const productService = {
  // Operaciones CRUD básicas
  async AgregarProductos(productoData) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(productoData),
    });
    return handleResponse(response);
  },

  async obtenerProductos(params = {}) {
    const token = authService.getToken();
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/products/?${queryString}`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  },

  async obtenerProductoPorId(id) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  },

  async editarProducto(id, productoData) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(productoData),
    }); 
    return handleResponse(response);
  },

  async actualizarParcialProducto(id, partialData) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(partialData),
    });
    return handleResponse(response);
  },

  async EliminarProducto(id) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    
    if (response.status === 204) return true; // No Content
    
    return handleResponse(response);
  },

  async obtenerProductosRecomendados({
    limit = 10,
    category = null,
    includeOutOfStock = false
  } = {}) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
  
    // Construir parámetros de consulta
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (category) params.append('category', category);
    if (includeOutOfStock) params.append('include_out_of_stock', 'true');
  
    const response = await fetch(`${BASE_URL}/products/recommendations/?${params.toString()}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-cache'
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.detail || 
        `Error ${response.status}: ${response.statusText}`
      );
    }
  
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn('La respuesta de productos recomendados no es un array:', data);
      return [];
    }
  
    return data;
  },

  async buscarProductos(query) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/search/?q=${encodeURIComponent(query)}`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  },

  async filtrarProductos(filters) {
    const token = authService.getToken();
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/products/filter/?${queryString}`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  },

  async AplicarDescuento(id, descuento) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/apply_discount/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({
        discount_percentage: descuento,
        has_discount: true,
      }),
    });
    return handleResponse(response);
  },

  async removerDescuento(id) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/${id}/remove_discount/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({
        has_discount: false,
      }),
    });
    return handleResponse(response);
  },

  async obtenerCategorias() {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/categories/`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  },

  async obtenerProductosPorCategoria(categoryId) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}/products/category/${categoryId}/`, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Exportación por defecto para compatibilidad
export default productService;
export const obtenerProductosRecomendados = productService.obtenerProductosRecomendados;