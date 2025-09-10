import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const ContactForm = ({ contact, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    status: "Lead",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        position: contact.position || "",
        status: contact.status || "Lead",
        notes: contact.notes || "",
      });
    }
  }, [contact]);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
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
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Enter first name"
          />
        </FormField>

        <FormField 
          label="Last Name" 
          required 
          error={errors.lastName}
        >
          <Input
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Enter last name"
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
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email address"
        />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
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
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Enter company name"
          />
        </FormField>

        <FormField label="Position" error={errors.position}>
          <Input
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="Enter job position"
          />
        </FormField>
      </div>

      <FormField label="Status" error={errors.status}>
        <Select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
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
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
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