import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex flex-col flex-1 lg:pl-64">
        <main className="flex-1 relative overflow-y-auto">
          <Outlet context={{ toggleSidebar }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;