import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className = "",
  children 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;