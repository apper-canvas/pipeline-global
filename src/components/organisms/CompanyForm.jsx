import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const CompanyForm = ({ company, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    website: company?.website || '',
    phone: company?.phone || '',
    email: company?.email || '',
    address: company?.address || '',
    employeeCount: company?.employeeCount || '1-10',
    revenue: company?.revenue || '',
    description: company?.description || '',
    status: company?.status || 'Active'
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Energy',
    'Construction',
    'Transportation',
    'Hospitality',
    'Food & Beverage',
    'Marketing',
    'Legal',
    'Other'
  ].sort();

  const employeeCounts = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '501+'
  ];

  const revenueRanges = [
    '',
    'Under $1M',
    '$1M-5M',
    '$5M-10M',
    '$10M-50M',
    '$50M-100M',
    '$100M+'
  ];

  const statuses = [
    'Active',
    'Prospect',
    'Inactive'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Building2" className="h-5 w-5 mr-2" />
            Basic Information
          </h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter company name"
              />
            </div>
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Industry *
              </label>
              <Select
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                error={errors.industry}
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                error={errors.website}
                placeholder="https://company.com"
              />
            </div>
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Contact Information */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="contact@company.com"
              />
            </div>
          </div>

<div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Business St, City, State 12345"
            />
          </div>
        </Card.Content>
      </Card>

      {/* Company Details */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Users" className="h-5 w-5 mr-2" />
            Company Details
          </h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
<label className="block text-sm font-medium text-slate-700 mb-2">
                Employee Count
              </label>
              <Select
                value={formData.employeeCount}
                onChange={(e) => handleChange('employeeCount', e.target.value)}
              >
                {employeeCounts.map(count => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Select>
            </div>
<div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Annual Revenue
              </label>
              <Select
                value={formData.revenue}
                onChange={(e) => handleChange('revenue', e.target.value)}
              >
                {revenueRanges.map(revenue => (
                  <option key={revenue} value={revenue}>
                    {revenue || 'Not specified'}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description of the company..."
            />
          </div>
        </Card.Content>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
        >
          {saving ? (
            <>
              <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {company ? 'Update Company' : 'Create Company'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;