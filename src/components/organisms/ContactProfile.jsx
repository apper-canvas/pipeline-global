import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/formatters";

const ContactProfile = ({ contact, onEdit, onClose }) => {
  const getStatusVariant = (status) => {
    const statusMap = {
      Lead: "lead",
      Prospect: "prospect",
      Customer: "customer", 
      Inactive: "inactive"
    };
    return statusMap[status] || "default";
  };

  const contactFields = [
    { label: "Email", value: contact.email, icon: "Mail" },
    { label: "Phone", value: contact.phone, icon: "Phone" },
    { label: "Company", value: contact.company, icon: "Building2" },
    { label: "Position", value: contact.position, icon: "Briefcase" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-white">
                {contact.firstName[0]}{contact.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-primary-100">
                {contact.position} at {contact.company}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(contact.status)}>
            {contact.status}
          </Badge>
        </div>
      </div>

      <Card className="rounded-t-none border-t-0">
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {contactFields.map((field) => (
              <div key={field.label} className="flex items-center">
                <div className="bg-slate-100 rounded-lg p-2 mr-3">
                  <ApperIcon name={field.icon} className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{field.label}</p>
                  <p className="font-medium text-slate-900">
                    {field.value || "Not provided"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {contact.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
              <p className="text-slate-900 bg-slate-50 rounded-lg p-4">
                {contact.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              <p>Created: {formatDate(contact.createdAt)}</p>
              <p>Updated: {formatDate(contact.updatedAt)}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onEdit(contact)}>
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default ContactProfile;