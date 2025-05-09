import { ProductCard } from "../../../Components/ProductCard";
import { productService } from "../../../Api/Product";
import { useState } from "react";
import { useEffect } from "react";
/*import { useCart } from "../../../Context/CarritoContext.jsx";
import { useLocation } from "react-router-dom";*/

 const Products = () => {
  const [productos, setProductos] = useState([]);
  /*const { clearCart } = useCart();
  const location = useLocation();*/

  useEffect(() => {
    if (localStorage.getItem("pagado") === "true") {
      localStorage.removeItem("pagado"); // limpiar marca
      window.location.reload(); // refrescar productos
    }
  }, []);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await productService.obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al Cargar Productos", error.message);
      }
    };
    cargarProductos();
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
};

export default Products
