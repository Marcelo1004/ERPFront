// src/Routes/Client/Carrito.jsx
import { useCart } from "../../../Context/CarritoContext.jsx";
import { Minus, Plus, Trash2 } from "lucide-react";
import { redirectToCheckout } from "../../../Api/Stripe.js";
import { obtenerItemsCarrito } from "../../../Api/CarritoItem.js";
import { useEffect } from "react";

const Carrito = () => {
  const {
    cart,
    clearCart,
    addToCart,
    removeFromCart,
    aumentarCantidad,
    disminuirCantidad,
  } = useCart();

  const handleCheckout = async () => {
    try {
      const items = await obtenerItemsCarrito();
      const payload = items.map((item) => ({
        product_id: item.product.id || item.product,
        quantity: item.quantity,
      }));

      await redirectToCheckout(payload, () => {
        clearCart(); // ✅ Limpiar carrito en frontend
      });
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      alert("No se pudo iniciar el pago.");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price * item.quantity),
    0
  );

  useEffect(() => {
    const itemEditado = JSON.parse(localStorage.getItem("editar_order_item"));
    if (itemEditado && itemEditado.id) {
      addToCart(itemEditado); // debe tener `.id` para funcionar
      localStorage.removeItem("editar_order_item");
    }
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Mi Carrito</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <>
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">${Number(item.price).toFixed(2)}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center">{Number(item.quantity)}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        disminuirCantidad(item.itemId, item.quantity, item.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus size={18} />
                    </button>
                    <button
                      onClick={() =>
                        aumentarCantidad(item.itemId, item.quantity, item.id)
                      }
                      disabled={item.quantity >= item.stock}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-black"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-xl font-semibold">
              Total: ${total.toFixed(2)}
            </span>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Realizar Pago
            </button>
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito