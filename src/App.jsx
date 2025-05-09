import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { LoadingSpinner } from "./Components/LoadingSpinner";
import { NavBar } from "./Components/NavBar.jsx";
import { useState } from "react";
import ErrorBoundary from './Components/ErrorBoundary';

// Importaciones lazy corregidas
const Home = lazy(() => import('./Routes/Home/Home.jsx'));
const Login = lazy(() => import('./Routes/Login/Login.jsx'));
const Registrar = lazy(() => import('./Routes/Registros/Registrar.jsx'));
const Cliente = lazy(() => import('./Routes/Client/Cliente.jsx'));
const Administrador = lazy(() => import('./Routes/Admin/Administrador.jsx'));
const Table_Users = lazy(() => import('./Routes/Admin/Gestion-Usuario/Table_Users.jsx'));
const Table_Products = lazy(() => import('./Routes/Admin/Gestion-Productos/Table_Products.jsx'));
const Table_Delivery = lazy(() => import('./Routes/Admin/Gestion-Delivery/Table_Delivery.jsx'));
const Reportes = lazy(() => import('./Routes/Admin/Reports/Reportes.jsx'));
const Products = lazy(() => import('./Routes/Client/Shopping/Products.jsx'));
const Carrito = lazy(() => import('./Routes/Client/Shopping/Carrito.jsx'));
const Historial = lazy(() => import('./Routes/Client/History/Historial.jsx'));
const Success = lazy(() => import('./Routes/Client/Success.jsx'));

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <ErrorBoundary>
      <NavBar onLoginClick={() => setMostrarLogin(true)} />
      {mostrarLogin && (
        <Suspense fallback={<LoadingSpinner />}>
          <Login onClose={() => setMostrarLogin(false)} />
        </Suspense>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Registers" element={<Registrar />} />
          <Route path="/Success" element={<Success />} />
          <Route path="Products" element={<Products />} />

          <Route path="/Client" element={<Cliente />}>
            <Route path="Carrito" element={<Carrito />} />
            <Route path="Ver_Historial" element={<Historial />} />
          </Route>

          <Route path="/Admin" element={<Administrador />}>
            <Route path="Users" element={<Table_Users />} />
            <Route path="Productos" element={<Table_Products />} />
            <Route path="Pedidos" element={<Table_Delivery />} />
            <Route path="Reportes" element={<Reportes />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;