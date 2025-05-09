import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CarritoContext";
import { CrearOrdenesItem } from "../../Api/Order";
import { CrearPedido } from "../../Api/Ordenes";

 const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const procesarOrden = async () => {
      const items = JSON.parse(localStorage.getItem("items_pagados"));

      if (!items || items.length === 0) {
        console.warn("No hay productos para registrar.");
        return;
      }

      try {
        const orderItems = [];

        for (const item of items) {
          const res = await CrearOrdenesItem(item.product_id, item.quantity);
          orderItems.push({
            product: res.product,
            quantity: res.quantity,
          });
        }

        await CrearPedido(orderItems, "Pendiente");

        // Limpiar carrito y localStorage
        clearCart();
        localStorage.removeItem("items_pagados");
        localStorage.removeItem("pagado");

        // Redirigir luego de 5 segundos (opcional)
        setTimeout(() => {
          navigate("/Products");
        }, 5000);
      } catch (error) {
        console.error("Error al procesar la orden:", error);
      }
    };

    if (localStorage.getItem("pagado")) {
      procesarOrden();
    }
  }, [clearCart, navigate]);

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">¡Pago Exitoso!</h2>
      <p className="text-lg text-gray-600">
        Gracias por tu compra. Estamos procesando tu orden.
      </p>
      <p className="mt-4 text-sm text-gray-400">Serás redirigido automáticamente...</p>
    </div>
  );
};

export default Success
