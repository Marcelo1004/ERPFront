import {
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    MessageSquareMoreIcon,
  } from "lucide-react";
  
  import { Link } from "react-router-dom";
  
  export function SidebarClient({ isOpen, toggleSidebar }) {
    return (
      <div
        className={`h-screen bg-[#0F172A] text-white flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
              {isOpen && <span className="font-bold text-lg">SMART POS</span>}
            </div>
            <button
              onClick={toggleSidebar}
              className="ml-auto text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
  
          <nav className="px-2 space-y-2">
            <SidebarLink
              to="/Client/Carrito"
              icon={<ShoppingCart size={18} />}
              label="Ver Carrito"
              isOpen={isOpen}
            />
            <SidebarLink
              to="/Client/Ver_Historial"
              icon={<FileText size={18} />}
              label="Historial Pedidos"
              isOpen={isOpen}
            />
          </nav>
        </div>
  
        <div className="p-2">
          <SidebarLink
            to="/Client/Settings"
            icon={<Settings size={18} />}
            label="Settings"
            isOpen={isOpen}
          />
        </div>
      </div>
    );
  }
  
  function SidebarLink({ to, icon, label, isOpen }) {
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-2 hover:bg-[#1E293B] rounded-md transition-colors duration-200 ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        {icon}
        {isOpen && <span>{label}</span>}
      </Link>
    );
  }
  