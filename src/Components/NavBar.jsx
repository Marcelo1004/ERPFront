import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  {authService}  from "../Api/AuthService";

export const NavBar = ({ onLoginClick }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {  // Hacer la función async
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser(token);  // Añadir await
          setUser(userData);
        } catch (err) {
          console.error("Error al verificar usuario:", err);
          authService.logout();
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);
    
    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout(); // Usar el servicio
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex space-x-4">
            <Link to="/" className="text-white px-3 py-2">
              HOME
            </Link>

            {user?.rol === "Administrador" && (
              <Link to="/admin" className="text-white px-3 py-2">
                ADMIN
              </Link>
            )}

            {user?.rol === "Cliente" && (
              <Link to="/client" className="text-white px-3 py-2">
                CLIENTE
              </Link>
            )}

            {user && (
              <Link to="/products" className="text-white px-3 py-2">
                PRODUCTOS
              </Link>
            )}
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">
                  Hola, {user.nombre || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition text-sm"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};