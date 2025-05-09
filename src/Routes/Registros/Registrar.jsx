import { useState } from "react";
import { RegistrarCliente } from "../../Api/Users";
import { useNavigate } from "react-router-dom";

 const Registrar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    apellido: "",
    password: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    if (!formData.correo || !formData.nombre || !formData.apellido || !formData.password) {
      setMensaje("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }

    try {
      await RegistrarCliente(
        formData.nombre,
        formData.apellido,
        formData.correo,
        formData.password
      );
      setMensaje("Usuario registrado exitosamente");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje(error.message.includes('already exists') ? 
        'Este correo ya está registrado' : 
        'Error al registrar. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Registro de Usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-medium transition ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {mensaje && (
          <p className={`text-sm text-center mt-4 ${
            mensaje.includes('éxito') ? 'text-green-500' : 'text-red-500'
          }`}>
            {mensaje}
          </p>
        )}

        <p className="text-sm text-center text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Registrar