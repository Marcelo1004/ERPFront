// src/Routes/Client/Pedido.jsx
import { useEffect, useState } from "react";
import { obtenerCarritos } from "../../../Api/Carrito";
import { obtenerItemsCarrito } from "../../../Api/CarritoItem";
import { obtenerProductos } from "../../../Api/Product";

const Pedido = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carritos = await obtenerCarritos();
        const productos = await obtenerProductos();
        const itemsCarrito = await obtenerItemsCarrito();

        console.log("Carritos", carritos);
        console.log("Productos", productos);
        console.log("Items carrito", itemsCarrito);

        if (carritos.length > 0) {
          const ultimoCarrito = carritos[carritos.length - 1];

          const itemsFiltrados = itemsCarrito
            .filter((item) => item.cart === ultimoCarrito.id || item.cart_id === ultimoCarrito.id)
            .map((item) => {
              const producto = productos.find((p) => p.id === item.product || p.id === item.product_id);
              return {
                ...item,
                product_name: producto ? producto.name : "Desconocido",
              };
            });

          setItems(itemsFiltrados);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  const hayItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pedidos por Confirmar</h2>
      {hayItems ? (
        <table className="w-full border text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">Producto</th>
              <th className="p-2">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b text-black">
                <td className="p-2">{item.product_name}</td>
                <td className="p-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay productos en el pedido.</p>
      )}
    </div>
  );
};

export default Pedido;
