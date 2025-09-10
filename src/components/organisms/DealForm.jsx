import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const STAGES = [
  { value: "Lead", label: "Lead" },
  { value: "Qualified", label: "Qualified" },
  { value: "Proposal", label: "Proposal" },
  { value: "Negotiation", label: "Negotiation" },
  { value: "Closed Won", label: "Closed Won" }
];

const DealForm = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    stage: "Lead",
    contactId: "",
    expectedCloseDate: "",
    description: "",
    probability: "25"
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadContacts();
    if (deal) {
      setFormData({
        name: deal.name || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        contactId: deal.contactId?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate || "",
        description: deal.description || "",
        probability: deal.probability?.toString() || "25"
      });
    }
  }, [deal]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      toast.error("Failed to load contacts");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact selection is required";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    const probability = parseInt(formData.probability);
    if (isNaN(probability) || probability < 0 || probability > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability)
      };

      let savedDeal;
      if (deal?.Id) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success("Deal created successfully");
      }

      onSave(savedDeal);
    } catch (error) {
      console.error("Failed to save deal:", error);
      toast.error(deal?.Id ? "Failed to update deal" : "Failed to create deal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Deal Name" required error={errors.name}>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter deal name..."
          disabled={loading}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Deal Value" required error={errors.value}>
          <Input
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            placeholder="0.00"
            disabled={loading}
          />
        </FormField>

        <FormField label="Probability (%)" error={errors.probability}>
          <Input
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={handleChange}
            disabled={loading}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Stage" error={errors.stage}>
          <Select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            disabled={loading}
          >
            {STAGES.map(stage => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Contact" required error={errors.contactId}>
          <Select
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.firstName} {contact.lastName} - {contact.company}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Expected Close Date" required error={errors.expectedCloseDate}>
        <Input
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
          disabled={loading}
        />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add deal description..."
          rows={3}
          disabled={loading}
          className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
          {deal?.Id ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;