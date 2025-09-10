import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "",
  value = "",
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onChange) {
      onChange(term);
    } else if (onSearch) {
      onSearch(term);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={onChange ? value : searchTerm}
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;