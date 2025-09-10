import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const ContactForm = ({ contact, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    position_c: "",
    status_c: "Lead",
    notes_c: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (contact) {
      setFormData({
        first_name_c: contact.first_name_c || "",
        last_name_c: contact.last_name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        position_c: contact.position_c || "",
        status_c: contact.status_c || "Lead",
        notes_c: contact.notes_c || "",
      });
    }
  }, [contact]);

  const validate = () => {
    const newErrors = {};

if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }
    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email";
    }
    if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="First Name" 
          required 
          error={errors.firstName}
        >
          <Input
value={formData.first_name_c}
            onChange={(e) => handleChange("first_name_c", e.target.value)}
            placeholder="Enter first name"
            error={errors.first_name_c}
          />
        </FormField>

        <FormField 
          label="Last Name" 
          required 
          error={errors.lastName}
        >
          <Input
value={formData.last_name_c}
            onChange={(e) => handleChange("last_name_c", e.target.value)}
            placeholder="Enter last name"
            error={errors.last_name_c}
          />
        </FormField>
      </div>

      <FormField 
        label="Email" 
        required 
        error={errors.email}
      >
        <Input
type="email"
          value={formData.email_c}
          onChange={(e) => handleChange("email_c", e.target.value)}
          placeholder="Enter email address"
          error={errors.email_c}
        />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <Input
          type="tel"
value={formData.phone_c}
          onChange={(e) => handleChange("phone_c", e.target.value)}
          placeholder="Enter phone number"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="Company" 
          required 
          error={errors.company}
        >
          <Input
value={formData.company_c}
            onChange={(e) => handleChange("company_c", e.target.value)}
            placeholder="Enter company name"
            error={errors.company_c}
          />
        </FormField>

        <FormField label="Position" error={errors.position}>
          <Input
            value={formData.position}
value={formData.position_c}
            onChange={(e) => handleChange("position_c", e.target.value)}
            placeholder="Enter job position"
          />
        </FormField>
      </div>

      <FormField label="Status" error={errors.status}>
        <Select
value={formData.status_c}
          onChange={(e) => handleChange("status_c", e.target.value)}
        >
          <option value="Lead">Lead</option>
          <option value="Prospect">Prospect</option>
          <option value="Customer">Customer</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </FormField>

      <FormField label="Notes" error={errors.notes}>
        <textarea
          className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          rows={4}
value={formData.notes_c}
          onChange={(e) => handleChange("notes_c", e.target.value)}
          placeholder="Enter any notes about this contact"
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;