import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuToggle, actions = [] }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden mr-3 p-2"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center space-x-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "primary"}
                size={action.size || "md"}
                onClick={action.onClick}
                className={action.className}
              >
                {action.icon && (
                  <ApperIcon name={action.icon} className="h-4 w-4 mr-2" />
                )}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;