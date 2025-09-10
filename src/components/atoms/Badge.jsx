import { cn } from "@/utils/cn";

const Badge = ({ variant = "default", className, children, ...props }) => {
const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    lead: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
    prospect: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300",
    customer: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300",
    inactive: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300",
    qualified: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300",
    proposal: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    negotiation: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300",
    won: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;