import { getToken } from "./AuthService";

const BASE_URL = import.meta.env.VITE_API_URL;

// Función común para manejar errores HTTP
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    console.error("Error en la respuesta:", data);
    throw new Error(data.detail || "Error en la solicitud");
  }
  return data;
}

export async function obtenerUsuarios() {
  const response = await fetch(`${BASE_URL}/users/`, {
    headers: {
      Authorization: `Token ${getToken()}`,
    },
  });
  return handleResponse(response);
}

export async function EditarUsuarios(UsuarioId, updateUsuario) {
  const bodyData = {
    nombre: updateUsuario.nombre,
    apellido: updateUsuario.apellido,
    correo: updateUsuario.correo,
    is_active: updateUsuario.is_active,
    is_staff: updateUsuario.is_staff,
    rol_id: updateUsuario.rol_id ? Number(updateUsuario.rol_id) : null
  };

  const response = await fetch(`${BASE_URL}/users/${UsuarioId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify(bodyData),
  });
  
  return handleResponse(response);
}

export async function RegistrarCliente(nombre, apellido, correo, password) {
  try {
    const response = await fetch(`${BASE_URL}/register-cliente/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Añade CSRF token si es necesario en Django
        // "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({
        nombre,
        apellido,
        correo,
        password,
        rol: 2 // Asegúrate que este es el ID correcto para "Cliente"
      }),
    });

    if (!response.ok) {
      // Manejo mejorado de errores
      const contentType = response.headers.get('content-type');
      let errorData;
      
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }

      // Mapeo de errores comunes
      const errorMap = {
        'email': 'El correo electrónico ya está registrado',
        'password': 'La contraseña no cumple con los requisitos',
        'nombre': 'El nombre es requerido',
        'apellido': 'El apellido es requerido'
      };

      const serverMessage = errorData.message || 
                          (errorData.errors && errorData.errors[0]) ||
                          Object.entries(errorData)
                            .filter(([key]) => key in errorMap)
                            .map(([key, value]) => errorMap[key] || value[0])
                            .join(', ');

      throw new Error(serverMessage || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en RegistrarCliente:', error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
}

export async function eliminarUsuario(UsuarioId) {
  const response = await fetch(`${BASE_URL}/users/${UsuarioId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }
  return { success: true };
}

export async function agregarUsuario(NewUser) {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify({
      ...NewUser,
      is_active: true, // Por defecto activo
      rol_id: NewUser.rol_id || 2 // valor por defecto
    }),
  });
  
  return handleResponse(response);
}