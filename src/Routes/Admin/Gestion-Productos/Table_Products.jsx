import React, { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaBars, FaSearch, FaPercentage } from 'react-icons/fa';
import { productService} from "../../../Api/Product";
import {Sidebar} from '../../../Components/Sidebar';

const Table_Products = () => {
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 
  

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    is_active: true,
    is_available: true
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState("");
  const [productForDiscount, setProductForDiscount] = useState(null);
  const [discountValue, setDiscountValue] = useState("");
  
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false);

  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.obtenerProductos();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en formularios
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Validación básica
  const validate = (product) => {
    const errors = {};
    if (!product.name) errors.name = 'Nombre es requerido';
    if (!product.price || isNaN(product.price)) errors.price = 'Precio válido es requerido';
    return errors;
  };

  // CRUD Operations
  const handleCreate = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await productService.AgregarProductos(formData);
      await fetchProducts();
      setShowModal("");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: 0,
        is_active: true,
        is_available: true
      });
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    } catch (error) {
      console.error("Error al crear producto:", error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate(editingProduct);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await productService.editarProducto(editingProduct.id, editingProduct);
      await fetchProducts();
      setEditingProduct(null);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await productService.EliminarProducto(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error al eliminar producto:", error.message);
      }
    }
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    try {
      await productService.AplicarDescuento(productForDiscount.id, discountValue);
      await fetchProducts();
      setProductForDiscount(null);
      setDiscountValue("");
    } catch (error) {
      console.error("Error al aplicar descuento:", error.message);
    }
  };

  // Filtrado y paginación
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-md relative">
          <h1 className="text-3xl font-semibold">Gestión de Productos</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-white focus:outline-none md:hidden"
          >
            <FaBars />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Total Products Card */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total de Productos</h3>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-3 rounded-lg ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Vista de Tabla
              </button>
              <button 
                onClick={() => setViewMode('cards')}
                className={`p-3 rounded-lg ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Vista de Tarjetas
              </button>
            </div>
            <FaBox className="text-5xl text-gray-400" />
          </div>
          {/* Create/Update Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h3>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${animate ? 'animate-pulse' : ''}`}>
              <div className="relative">
                <label htmlFor="name" className="text-gray-700 font-semibold">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={editingProduct?.name || formData.name}
                  onChange={editingProduct ? handleEditChange : handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="relative">
                <label htmlFor="description" className="text-gray-700 font-semibold">Descripción</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Descripción"
                  value={editingProduct?.description || formData.description}
                  onChange={editingProduct ? handleEditChange : handleInputChange}
                  className="border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="relative">
                <label htmlFor="price" className="text-gray-700 font-semibold">Precio</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Precio"
                  value={editingProduct?.price || formData.price}
                  onChange={editingProduct ? handleEditChange : handleInputChange}
                  className={`border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600 ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div className="relative">
                <label htmlFor="stock" className="text-gray-700 font-semibold">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Stock"
                  value={editingProduct?.stock || formData.stock}
                  onChange={editingProduct ? handleEditChange : handleInputChange}
                  className="border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editingProduct ? editingProduct.is_active : formData.is_active}
                    onChange={editingProduct ? handleEditChange : handleInputChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Activo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={editingProduct ? editingProduct.is_available : formData.is_available}
                    onChange={editingProduct ? handleEditChange : handleInputChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Disponible</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-4 rounded-lg shadow-lg bg-gray-500 text-white hover:bg-gray-600 transition duration-200"
                >
                  Cancelar
                </button>
              )}
              
              <button
                onClick={editingProduct ? handleUpdate : () => setShowModal("create")}
                className={`p-4 rounded-lg shadow-lg transition duration-200 flex items-center text-white ${
                  editingProduct 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {editingProduct ? <FaEdit className="inline mr-2" /> : <FaPlus className="inline mr-2" />}
                {editingProduct ? 'Actualizar' : 'Crear Producto'}
              </button>
            </div>
          </div>



          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-4 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-600 pl-10"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto mb-8">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Descripción</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-600">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border border-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        <span className="truncate max-w-[200px] inline-block" title={product.description}>
                          {product.description || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
  {product.has_discount ? (
    <div className="flex flex-col">
      <span className="line-through text-gray-500">
        ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
      </span>
      <span className="text-green-600 font-bold">
        ${typeof product.price === 'number' 
          ? (product.price * (1 - (product.discount_percentage || 0) / 100)).toFixed(2)
          : '0.00'}
        <span className="text-xs ml-1">
          ({product.discount_percentage || 0}% off)
        </span>
      </span>
    </div>
  ) : (
    `$${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}`
  )}
</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">{product.stock}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-400">
                        {product.is_active ? (
                          <span className="text-green-600 font-medium">Disponible</span>
                        ) : (
                          <span className="text-red-600 font-medium">No Disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm border border-gray-400">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-2 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200 flex items-center"
                            title="Editar"
                          >
                            <FaEdit size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center"
                            title="Eliminar"
                          >
                            <FaTrash size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setProductForDiscount(product);
                              setShowModal("discount");
                            }}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-2 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition duration-200 flex items-center"
                            title="Descuento"
                          >
                            <FaPercentage size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400 italic">
                      {isLoading ? 'Cargando productos...' : 'No se encontraron productos'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md disabled:bg-gray-300 hover:bg-gray-700 transition duration-200"
              >
                Anterior
              </button>
              <span className="text-lg">Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md disabled:bg-gray-300 hover:bg-gray-700 transition duration-200"
              >
                Siguiente
              </button>
            </div>
          )}
        </main>

        {/* Modals */}
        {/* Create Product Modal */}
        {showModal === "create" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6">Confirmar Creación</h3>
              <p className="mb-6">¿Estás seguro de que deseas crear este producto?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal("")}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discount Modal */}
        {showModal === "discount" && productForDiscount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6">Aplicar Descuento</h3>
              <form onSubmit={handleApplyDiscount} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Producto: {productForDiscount.name}</label>
                  <label className="block text-gray-700 mb-2">Precio actual: ${productForDiscount.price.toFixed(2)}</label>
                </div>
                
                <div className="relative">
                  <label htmlFor="discount" className="text-gray-700 font-semibold">Porcentaje de descuento</label>
                  <input
                    type="number"
                    id="discount"
                    min="1"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="border p-4 rounded-lg w-full mt-2 shadow-sm focus:ring-2 focus:ring-blue-600"
                    placeholder="Ej: 20 para 20%"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setProductForDiscount(null);
                      setShowModal("");
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition duration-200"
                  >
                    Aplicar Descuento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="bg-white p-6 text-center text-gray-500 shadow-inner text-lg">
          &copy; {new Date().getFullYear()} Gestión de Productos. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Table_Products;