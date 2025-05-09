import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  EditarUsuarios,
  eliminarUsuario,
  agregarUsuario,
} from "../../../Api/Users";

 const Table_Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [EditarUsuario, setEditarUsuario] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [showModal, setShowModal] = useState("");
  const [newUsuario, SetNewUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    is_staff: false,
    is_active: true,
  });

  useEffect(() => {
    async function UserData() {
      try {
        const data = await obtenerUsuarios();
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios", error.message);
      }
    }
    UserData();
  }, []);

  const filteredData = users.filter((user) =>
    user?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditarUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await EditarUsuarios(EditarUsuario.id, EditarUsuario);
      alert("Usuario actualizado correctamente");
      setEditarUsuario(null);

      // Recargar lista actualizada
      const data = await obtenerUsuarios();
      setUsers(data);
    } catch (error) {
      console.error("Error al editar usuario:", error.message);
      alert("No se pudo actualizar el usuario");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Estas Seguro De Eliminar Este Usuario?")) {
      try {
        await eliminarUsuario(id);
        setUsers((prev) => prev.filter((p) => p.id !== id));
        alert("Usuario Eliminado Correctamente");
      } catch (error) {
        console.error("Error al Eliminar", error);
        alert("Hubo un Error al elminar el usuario");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agregarUsuario(newUsuario);
      const data = await obtenerUsuarios();
      setUsers(data);
      alert("Usuario agregado con exito");
      setShowModal(false);
      SetNewUsuario({
        name: "",
        apellido: "",
        correo: "",
        password: "",
        is_active: true,
        is_staff: "",
      });
    } catch (error) {
      console.log("Error Agregar Usuario", error.message);
    }
  };

  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const paginatedUsers = filteredData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-auto h-screen">
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-3">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2 w-full md:w-auto justify-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Agregar Usuario
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // resetear página al buscar
          }}
        />
      </div>
      {/* Contenedor de tabla responsiva */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          {" "}
          {/* Reduje el ancho mínimo para móviles */}
          <div className="overflow-y-auto max-h-[calc(100vh-180px)] rounded-lg shadow-lg">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-800 text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 md:px-6">Código</th>
                  <th className="px-4 py-3 md:px-6">Nombre</th>
                  <th className="px-4 py-3 md:px-6">Apellido</th>
                  <th className="px-4 py-3 md:px-6">Correo</th>
                  <th className="px-4 py-3 md:px-6">Password</th>
                  <th className="px-4 py-3 md:px-6">Rol</th>
                  <th className="px-4 py-3 md:px-6">Estado</th>
                  <th className="px-4 py-3 md:px-6 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="px-4 py-3 md:px-6">{user.id}</td>
                      <td className="px-4 py-3 md:px-6">{user.nombre}</td>
                      <td className="px-4 py-3 md:px-6">{user.apellido}</td>
                      <td className="px-4 py-3 md:px-6">{user.correo}</td>
                      <td className="px-4 py-3 md:px-6 truncate max-w-[100px]">
                        {user.password}
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        <span
                          className={`font-medium ${
                            user.is_staff ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.is_staff ? "Admin" : "Cliente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        <span
                          className={`font-medium ${
                            user.is_active ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6 text-center space-x-2 md:space-x-3">
                        <button
                          onClick={() => setEditarUsuario(user)}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center px-6 py-4 text-gray-400 italic"
                    >
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>{" "}
      {/* 🔽 Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto py-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm min-w-[80px]"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded text-sm min-w-[36px] ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm min-w-[80px]"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      {EditarUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre"
                value={EditarUsuario.nombre}
                onChange={handleEditChange}
                placeholder="Nombre"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="apellido"
                value={EditarUsuario.apellido}
                onChange={handleEditChange}
                placeholder="Apellido"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="email"
                name="correo"
                value={EditarUsuario.correo}
                onChange={handleEditChange}
                placeholder="Correo"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                value={EditarUsuario.password}
                onChange={handleEditChange}
                placeholder="Nueva contraseña (opcional)"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex gap-4 items-center">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={EditarUsuario.is_active}
                    onChange={handleEditChange}
                  />
                  Activo
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={EditarUsuario.is_staff}
                    onChange={handleEditChange}
                  />
                  Administrador
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  onClick={() => setEditarUsuario(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre"
                value={newUsuario.nombre}
                onChange={(e) =>
                  SetNewUsuario((prev) => ({ ...prev, nombre: e.target.value }))
                }
                placeholder="Nombre"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="apellido"
                value={newUsuario.apellido}
                onChange={(e) =>
                  SetNewUsuario((prev) => ({
                    ...prev,
                    apellido: e.target.value,
                  }))
                }
                placeholder="Apellido"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="email"
                name="correo"
                value={newUsuario.correo}
                onChange={(e) =>
                  SetNewUsuario((prev) => ({ ...prev, correo: e.target.value }))
                }
                placeholder="Correo"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                value={newUsuario.password}
                onChange={(e) =>
                  SetNewUsuario((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Contraseña"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                name="rol_id"
                value={newUsuario.rol_id || ""}
                onChange={(e) =>
                  SetNewUsuario((prev) => ({
                    ...prev,
                    rol_id: Number(e.target.value),
                  }))
                }
                placeholder="ID de Rol (ej: 1)"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex gap-4 items-center">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newUsuario.is_active}
                    onChange={(e) =>
                      SetNewUsuario((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                  />
                  Activo
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={newUsuario.is_staff}
                    onChange={(e) =>
                      SetNewUsuario((prev) => ({
                        ...prev,
                        is_staff: e.target.checked,
                      }))
                    }
                  />
                  Administrador
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table_Users;