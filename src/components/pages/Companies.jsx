import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Modal from '@/components/molecules/Modal';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { companyService } from '@/services/api/companyService';
import { formatters } from '@/utils/formatters';
import CompanyForm from '@/components/organisms/CompanyForm';

const Companies = () => {
  const { toggleSidebar } = useOutletContext();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Load companies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    const matchesStatus = !statusFilter || company.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  // Get unique industries for filter
  const industries = [...new Set(companies.map(c => c.industry))].sort();
  const statuses = [...new Set(companies.map(c => c.status))].sort();

  // Handle company actions
  const handleAddCompany = () => {
    setSelectedCompany(null);
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleDeleteCompany = async (company) => {
    if (window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
      try {
        await companyService.delete(company.Id);
        await loadCompanies();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.Id, companyData);
      } else {
        await companyService.create(companyData);
      }
      await loadCompanies();
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Prospect': return 'warning';
      case 'Inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const headerActions = [
    {
      label: 'Add Company',
      icon: 'Plus',
      onClick: handleAddCompany,
      variant: 'primary'
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Companies" 
        onMenuToggle={toggleSidebar}
        actions={headerActions}
      />
      
      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2"
        />
        <Select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          options={[
            { value: '', label: 'All Industries' },
            ...industries.map(industry => ({ value: industry, label: industry }))
          ]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            ...statuses.map(status => ({ value: status, label: status }))
          ]}
        />
      </div>

      {/* Companies Table */}
      <div className="mt-6">
        {filteredCompanies.length === 0 ? (
          <Empty 
            title="No companies found" 
            description={searchTerm || industryFilter || statusFilter ? 
              "No companies match your current filters." : 
              "Get started by adding your first company."
            }
            action={
              <Button onClick={handleAddCompany} variant="primary">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            }
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-medium text-slate-900">Company</th>
                    <th className="text-left p-4 font-medium text-slate-900">Industry</th>
                    <th className="text-left p-4 font-medium text-slate-900">Employees</th>
                    <th className="text-left p-4 font-medium text-slate-900">Contacts</th>
                    <th className="text-left p-4 font-medium text-slate-900">Deals</th>
                    <th className="text-left p-4 font-medium text-slate-900">Status</th>
                    <th className="text-left p-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.Id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-900">{company.name}</div>
                          <div className="text-sm text-slate-600">{company.website}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{company.industry}</td>
                      <td className="p-4 text-slate-600">{company.employeeCount}</td>
                      <td className="p-4 text-slate-600">{company.contactCount}</td>
                      <td className="p-4">
                        <div className="text-slate-900">{company.dealCount}</div>
                        <div className="text-sm text-slate-600">
                          {formatters.currency(company.totalValue)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(company.status)}>
                          {company.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCompany(company)}
                          >
                            <ApperIcon name="Edit2" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCompany(company)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Company Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCompany ? 'Edit Company' : 'Add Company'}
        size="lg"
      >
        <CompanyForm
          company={selectedCompany}
          onSave={handleSaveCompany}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Companies;