import { useState } from "react";
import { SidebarClient } from "../SidebarClient";

export function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarClient isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 transition-all duration-300 px-4 md:px-8 py-6 ${
          isOpen ? "ml-10" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div> 
  );
}
