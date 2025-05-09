import { obtenerMisPedidos } from "../../../Api/Order";
import { useEffect, useState } from "react";

const Historial = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cargarOrderItems = async () => {
      try {
        const data = await obtenerMisPedidos();
        setItems(data);
      } catch (error) {
        console.error("Error al cargar Order Items:", error.message);
      }
    };
    cargarOrderItems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Detalle de Items de Orden</h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto bg-white text-center">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre del Producto</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">ID Producto</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.product_name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.product}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historial
