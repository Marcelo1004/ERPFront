import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../Api/AuthService";

 const Login = ({ onClose }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (!correo) {
        throw new Error("El correo electrónico es requerido");
      }
      if (!password) {
        throw new Error("La contraseña es requerida");
      }

      const user = await login(correo, password);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChange"));
      
      onClose?.(); // Cierra el modal si existe la prop
      console.log("Usuario Autenticado", user);
      
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
          disabled={isLoading}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-75"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : "Iniciar Sesión"}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-500 mt-4">
          ¿No tienes cuenta?{" "}
          <Link 
            to="/Registers" 
            className="text-indigo-600 hover:underline font-medium"
            onClick={onClose}
          >
            Registrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login