import { useState } from "react";
import {
  generarReporteComprasCliente,
  generarReporteTopProductos,
} from "../../../Api/Reports";

 const Reportes = () => {
  const [formato, setFormato] = useState("pdf");
  const [clienteId, setClienteId] = useState("");

  const handleReporteProductos = async () => {
    try {
      const blob = await generarReporteTopProductos();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_top_productos.${formato === "excel" ? "xlsx" : "pdf"}`;;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar reporte de productos", error);
      alert("No se pudo generar el reporte");
    }
  };

  const handleReporteCliente = async () => {
    if (!clienteId) return alert("Debe ingresar un ID de cliente");

    try {
      const blob = await generarReporteComprasCliente({
        client_id: clienteId,
      });

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_cliente_${clienteId}.${
        formato === "excel" ? "xlsx" : "pdf"
      }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar reporte de cliente", error);
      alert("No se pudo generar el reporte");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Generación de Reportes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Formato
          </label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={formato}
            onChange={(e) => setFormato(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            ID Cliente
          </label>
          <input
            type="number"
            placeholder="Opcional para Productos"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
        <button
          onClick={handleReporteProductos}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Reporte Productos Vendidos
        </button>
        <button
          onClick={handleReporteCliente}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Reporte de Compras por Cliente
        </button>
      </div>
    </div>
  );
};

export default Reportes;