import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({ 
  columns, 
  sortColumn, 
  sortDirection, 
  onSort 
}) => {
  const handleSort = (column) => {
    if (!column.sortable) return;
    
    if (sortColumn === column.key) {
      onSort(column.key, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSort(column.key, "asc");
    }
  };

  return (
    <thead className="bg-slate-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
          >
            {column.sortable ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort(column)}
                className="p-0 h-auto font-medium text-slate-500 hover:text-slate-700"
              >
                {column.label}
                {sortColumn === column.key && (
                  <ApperIcon
                    name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"}
                    className="ml-1 h-4 w-4"
                  />
                )}
              </Button>
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;