import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      current: location.pathname === "/"
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: "Users",
      current: location.pathname === "/contacts"
    },
    {
      name: "Deals",
      href: "/deals",
      icon: "Briefcase",
      current: location.pathname === "/deals"
    },
    {
      name: "Companies",
      href: "/companies",
      icon: "Building2",
      current: location.pathname === "/companies"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3",
      current: location.pathname === "/reports"
    },
  ];

  // Desktop Sidebar - Static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-slate-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-2">
              <ApperIcon name="Zap" className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Pipeline Pro
              </h1>
            </div>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <ApperIcon
                name={item.icon}
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  item.current ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar - Transform overlay
  const MobileSidebar = () => (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Mobile sidebar */}
      <motion.div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={false}
        animate={{
          x: isOpen ? 0 : -256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full pt-5 pb-4">
          <div className="flex items-center justify-between flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-2">
                <ApperIcon name="Zap" className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Pipeline Pro
                </h1>
              </div>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onToggle}
                className={({ isActive }) => cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    item.current ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;