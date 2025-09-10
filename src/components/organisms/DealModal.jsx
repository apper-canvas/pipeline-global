import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import DealForm from "@/components/organisms/DealForm";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";

const DealModal = ({ deal, isOpen, onClose, onUpdate, onDelete }) => {
  const [contact, setContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (deal?.contactId && isOpen) {
      loadContact();
    }
  }, [deal, isOpen]);

  const loadContact = async () => {
    try {
      const contactData = await contactService.getById(deal.contactId);
      setContact(contactData);
    } catch (error) {
      console.error("Failed to load contact:", error);
    }
  };

  const handleSave = (updatedDeal) => {
    onUpdate(updatedDeal);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await dealService.delete(deal.Id);
      toast.success("Deal deleted successfully");
      onDelete(deal.Id);
      onClose();
    } catch (error) {
      console.error("Failed to delete deal:", error);
      toast.error("Failed to delete deal");
    } finally {
      setIsDeleting(false);
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

  if (!deal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Deal" : "Deal Details"}
      size="lg"
    >
      {isEditing ? (
        <DealForm
          deal={deal}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {deal.name}
              </h2>
              <Badge variant={getStageVariant(deal.stage)}>
                {deal.stage}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(deal.value)}
              </div>
              <div className="text-sm text-slate-500 flex items-center justify-end mt-1">
                <ApperIcon name="Target" className="h-4 w-4 mr-1" />
                {deal.probability}% probability
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contact && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact
                </label>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <ApperIcon name="User" className="h-5 w-5 text-slate-400 mr-3" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-slate-600">
                        {contact.position} at {contact.company}
                      </div>
                      <div className="text-sm text-slate-500">
                        {contact.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected Close Date
              </label>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-slate-400 mr-3" />
                  <span className="text-slate-900">
                    {formatDate(deal.expectedCloseDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {deal.description && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-slate-700">
                  {deal.description}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Timeline
            </label>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Created:</span>
                <span className="text-slate-900">
                  {formatDate(deal.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Last Updated:</span>
                <span className="text-slate-900">
                  {formatDate(deal.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              )}
              <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
              Delete Deal
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
              >
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Deal
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DealModal;