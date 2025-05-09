
import { useEffect, useState } from "react";
import { productService } from "../../Api/Product"; 
import { authService } from "../../Api/AuthService"; 
import { ProductCard } from "../../Components/ProductCard";
import { HeroBanner } from "../../Components/HeroBanner";
import { LoadingSpinner } from "../../Components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

  

  
   const Home = () => {
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const cargarProductos = async () => {
        try {
          setLoading(true);
          
          // Verificar autenticación primero
          const token = authService.getToken();
          if (!token) {
            setError("Por favor inicia sesión para ver recomendaciones");
            setLoading(false);
            return;
          }
          
          const data = await productService.obtenerProductosRecomendados();
          setProductosRecomendados(data);
        } catch (error) {
          console.error("Error al cargar productos:", error);
          setError(error.message || "No pudimos cargar las recomendaciones");
          
          // Si el error es por token inválido o expirado
          if (error.message.includes("token") || error.response?.status === 401) {
            authService.logout();
            window.dispatchEvent(new Event("authChange"));
          }
        } finally {
          setLoading(false);
        }
      };
      
      cargarProductos();
    }, []);
  // Datos para el banner hero
  const heroData = {
    title: "Plantronics BackBeat Pro",
    description: "Sonido profesional para amantes de la música",
    ctaText: "Ver producto",
    ctaLink: "/producto/plantronics-backbeat-pro",
    bgColor: "bg-black",
    textColor: "text-white"
  };

  // Datos de categorías de ejemplo
  const categorias = [
    { id: 1, nombre: "Electrónicos", imagen: "/images/electronics.jpg", ruta: "/categoria/electronicos" },
    { id: 2, nombre: "Ropa", imagen: "/images/clothing.jpg", ruta: "/categoria/ropa" },
    { id: 3, nombre: "Hogar", imagen: "/images/home.jpg", ruta: "/categoria/hogar" },
    { id: 4, nombre: "Deportes", imagen: "/images/sports.jpg", ruta: "/categoria/deportes" }
  ];

  return (
    
    <div className="bg-gray-100 min-h-screen">
      
      {/* Hero Section */}
      <HeroBanner {...heroData} />
      
      {/* Sección de Categorías */}
      <section className="container mx-auto py-8 px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explora categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map((categoria) => (
            <Link 
              to={categoria.ruta} 
              key={categoria.id}
              className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-200 relative">
                {categoria.imagen ? (
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>{categoria.nombre}</span>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-medium text-gray-900 text-center">
                  {categoria.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección de Productos Recomendados */}
      <section className="container mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Recomendados para ti
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Reintentar
            </button>
          </div>
        ) : productosRecomendados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay recomendaciones disponibles.</p>
            <p className="text-sm text-gray-400 mt-2">
              Prueba explorando nuestras categorías
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosRecomendados.map((producto) => (
              <ProductCard 
                key={producto.id} 
                product={producto} 
                className="hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home



