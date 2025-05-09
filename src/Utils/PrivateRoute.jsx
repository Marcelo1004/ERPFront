// src/Utils/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/Login" replace />;
}
