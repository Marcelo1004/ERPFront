const BASE_URL = import.meta.env.VITE_API_URL;
const TEMP_URL = 'http://127.0.0.1:8000';
const authService = {
  async login(correo, password) {
    try {
      console.groupCollapsed('AuthService - Iniciando login');
      console.log('URL:', `${TEMP_URL}/api-token-auth/`);
      console.log('correo:', correo);
      
      if (!correo?.trim()) throw new Error('El correo es requerido');
      if (!password) throw new Error('La contraseña es requerida');

      const response = await fetch(`${TEMP_URL}/api-token-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          correo: correo.trim(),  
          password: password
        }),
      });

      console.log('Status:', response.status);
      
      const data = await response.json().catch(() => null);
      console.log('Response Data:', data);

      if (response.status === 400) {
        const errorMsg = data?.detail || 
                        data?.non_field_errors?.[0] ||
                        (data ? JSON.stringify(data) : 'Credenciales inválidas');
        throw new Error(errorMsg);
      }

      if (!response.ok) {
        throw new Error(data?.detail || `Error HTTP ${response.status}`);
      }

      if (!data?.token) {
        throw new Error('El servidor no devolvió un token válido');
      }

      localStorage.setItem("authToken", data.token);
      console.log('Login exitoso, token almacenado');
      console.groupEnd();
      
      return data;

    } catch (error) {
      console.error('Error en authService.login:', {
        message: error.message,
        stack: error.stack
      });
      console.groupEnd();
      throw error;
    }
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('authChange'));
  },

  async getCurrentUser(token = this.getToken()) {
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/user/me/`, {  
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) this.logout();
        throw new Error(`Error ${response.status} al obtener usuario`);
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      return user;
      
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }
};

export {authService};
export const { getToken, login, logout, getCurrentUser } = authService;