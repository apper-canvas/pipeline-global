import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { contactService } from "@/services/api/contactService";

const DealCard = ({ 
  deal, 
  onClick, 
  onDragStart, 
  onDragEnd, 
  isDragging 
}) => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    if (deal.contactId) {
      loadContact();
    }
  }, [deal.contactId]);

  const loadContact = async () => {
    try {
      const contactData = await contactService.getById(deal.contactId);
      setContact(contactData);
    } catch (error) {
      console.error("Failed to load contact:", error);
    }
  };

  const getStageVariant = (stage) => {
    const variants = {
      "Lead": "lead",
      "Qualified": "prospect", 
      "Proposal": "warning",
      "Negotiation": "primary",
      "Closed Won": "success"
    };
    return variants[stage] || "default";
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
        isDragging 
          ? 'opacity-50 rotate-2 border-primary-300' 
          : 'hover:border-primary-200'
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <Card.Content className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-slate-900 text-sm leading-tight">
            {deal.name}
          </h4>
          <Badge variant={getStageVariant(deal.stage)} className="ml-2 text-xs">
            {deal.stage}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(deal.value)}
            </span>
            <div className="text-xs text-slate-500 flex items-center">
              <ApperIcon name="Target" className="h-3 w-3 mr-1" />
              {deal.probability}%
            </div>
          </div>

          {contact && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="User" className="h-4 w-4 mr-2" />
              <span>{contact.firstName} {contact.lastName}</span>
            </div>
          )}

          {contact?.company && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="Building" className="h-4 w-4 mr-2" />
              <span className="truncate">{contact.company}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-600">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>{formatDate(deal.expectedCloseDate)}</span>
          </div>
        </div>

        {deal.description && (
          <p className="text-xs text-slate-500 mt-3 line-clamp-2">
            {deal.description}
          </p>
        )}
      </Card.Content>
    </Card>
  );
};

export default DealCard;