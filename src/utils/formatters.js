import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  }
  
  return format(date, "MMM d, yyyy");
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "N/A";
  
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};