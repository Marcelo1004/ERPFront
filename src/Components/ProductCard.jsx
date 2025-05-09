import { useCart } from "../Context/CarritoContext.jsx";

export const ProductCard = ({ producto = {} }) => {
  // Proporciona un objeto vacío como valor por defecto
  const { cart, addToCart, removeFromCart } = useCart();

  // Verifica que producto existe antes de usarlo
  if (!producto || Object.keys(producto).length === 0) {
    return <div className="bg-gray-100 rounded-lg p-4">Producto no disponible</div>;
  }

  const yaEnCarrito = cart.some((item) => item.id === producto.id);

  const handleClick = () => {
    if (yaEnCarrito) {
      removeFromCart(producto.id);
    } else {
      addToCart(producto);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={producto.image_url || null}
        alt={producto.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1">
        <h2 className="text-lg font-semibold">{producto.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{producto.description}</p>
        <p className="text-indigo-600 font-bold text-lg">${producto.price}</p>
        <p className="text-sm text-gray-800">
          {producto.has_discount ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                ${Number(producto.price).toFixed(2)}
              </span>
              <span className="text-green-600 font-bold">
                $
                {Number(
                  producto.price * (1 - producto.discount_percentage / 100)
                ).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-black font-medium">
              ${Number(producto.price).toFixed(2)}
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2 p-4 border-t">
        <button className="w-full border border-gray-400 rounded py-2 text-gray-700 hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button
          className={`w-full bg-indigo-600 text-white py-2 rounded ${
            yaEnCarrito
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          onClick={handleClick}
        >
          {yaEnCarrito ? "Quitar del Carrito" : "Agregar al Carrito"}
        </button>
      </div>
    </div>
  );
};
