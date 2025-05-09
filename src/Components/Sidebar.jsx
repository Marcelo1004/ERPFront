import {
  Home,
  Users,
  FileText,
  Package,
  Settings,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const sidebarLinks = [
    { to: "/Admin", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/Admin/Users", icon: <Users size={18} />, label: "Gestionar Usuarios" },
    { to: "/Admin/Pedidos", icon: <Package size={18} />, label: "Gestionar Pedidos" },
    { to: "/Admin/Productos", icon: <ShoppingBag size={18} />, label: "Gestionar Productos" },
    { to: "/Admin/Reportes", icon: <FileText size={18} />, label: "Reportes" },
    { to: "/Admin/Settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#0F172A] text-white flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Logo y botón de toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex-shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg whitespace-nowrap"
                >
                  SMART POS
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          
          <button
            onClick={toggleSidebar}
            className="ml-auto text-gray-300 hover:text-white focus:outline-none p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Links de navegación */}
        <nav className="px-2 py-4 space-y-1">
          {sidebarLinks.slice(0, 5).map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isOpen={isOpen}
              isActive={location.pathname === link.to}
            />
          ))}
        </nav>
      </div>

      {/* Configuración */}
      <div className="p-2 border-t border-gray-800">
        <SidebarLink
          to={sidebarLinks[5].to}
          icon={sidebarLinks[5].icon}
          label={sidebarLinks[5].label}
          isOpen={isOpen}
          isActive={location.pathname === sidebarLinks[5].to}
        />
      </div>
    </motion.div>
  );
}

function SidebarLink({ to, icon, label, isOpen, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
        isActive 
          ? "bg-indigo-600 text-white" 
          : "text-gray-300 hover:bg-[#1E293B] hover:text-white"
      } ${isOpen ? "justify-start" : "justify-center"}`}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {icon}
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}