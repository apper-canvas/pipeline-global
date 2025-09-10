import { toast } from 'react-toastify';

// Add delay to simulate API calls
function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'company_c';

export const companyService = {
  // Get all companies
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}}, 
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "deal_count_c"}},
          {"field": {"Name": "total_value_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Error fetching companies:', response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI-friendly format
      return (response.data || []).map(company => ({
        Id: company.Id,
        name: company.name_c || company.Name || '',
        industry: company.industry_c || '',
        website: company.website_c || '',
        phone: company.phone_c || '',
        email: company.email_c || '',
        address: company.address_c || '',
        employeeCount: company.employee_count_c || '1-10',
        revenue: company.revenue_c || '',
        description: company.description_c || '',
        contactCount: company.contact_count_c || 0,
        dealCount: company.deal_count_c || 0,
        totalValue: company.total_value_c || 0,
        status: company.status_c || 'Active',
        createdAt: company.created_at_c || company.CreatedOn,
        updatedAt: company.updated_at_c || company.ModifiedOn
      }));
    } catch (error) {
      console.error('Error fetching companies:', error?.response?.data?.message || error);
      toast.error('Failed to load companies');
      return [];
    }
  },

  // Get company by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}}, 
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "deal_count_c"}},
          {"field": {"Name": "total_value_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success || !response.data) {
        toast.error('Company not found');
        return null;
      }

      const company = response.data;
      // Map database fields to UI-friendly format
      return {
        Id: company.Id,
        name: company.name_c || company.Name || '',
        industry: company.industry_c || '',
        website: company.website_c || '',
        phone: company.phone_c || '',
        email: company.email_c || '',
        address: company.address_c || '',
        employeeCount: company.employee_count_c || '1-10',
        revenue: company.revenue_c || '',
        description: company.description_c || '',
        contactCount: company.contact_count_c || 0,
        dealCount: company.deal_count_c || 0,
        totalValue: company.total_value_c || 0,
        status: company.status_c || 'Active',
        createdAt: company.created_at_c || company.CreatedOn,
        updatedAt: company.updated_at_c || company.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load company');
      return null;
    }
  },

  // Create new company
  async create(companyData) {
    try {
      // Validate required fields
      if (!companyData.name || !companyData.name.trim()) {
        toast.error('Company name is required');
        throw new Error('Company name is required');
      }

      // Map UI data to database field names (only Updateable fields)
      const params = {
        records: [{
          Name: companyData.name.trim(),
          name_c: companyData.name.trim(),
          industry_c: companyData.industry || '',
          website_c: companyData.website || '',
          phone_c: companyData.phone || '',
          email_c: companyData.email || '',
          address_c: companyData.address || '',
          employee_count_c: companyData.employeeCount || '1-10',
          revenue_c: companyData.revenue || '',
          description_c: companyData.description || '',
          contact_count_c: companyData.contactCount || 0,
          deal_count_c: companyData.dealCount || 0,
          total_value_c: companyData.totalValue || 0.0,
          status_c: companyData.status || 'Active',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Error creating company:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create company:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create company');
        }
        
        if (successful.length > 0) {
          const createdCompany = successful[0].data;
          toast.success(`Company "${companyData.name}" created successfully`);
          
          // Return in UI-friendly format
          return {
            Id: createdCompany.Id,
            name: createdCompany.name_c || createdCompany.Name,
            industry: createdCompany.industry_c || '',
            website: createdCompany.website_c || '',
            phone: createdCompany.phone_c || '',
            email: createdCompany.email_c || '',
            address: createdCompany.address_c || '',
            employeeCount: createdCompany.employee_count_c || '1-10',
            revenue: createdCompany.revenue_c || '',
            description: createdCompany.description_c || '',
            contactCount: createdCompany.contact_count_c || 0,
            dealCount: createdCompany.deal_count_c || 0,
            totalValue: createdCompany.total_value_c || 0,
            status: createdCompany.status_c || 'Active',
            createdAt: createdCompany.created_at_c,
            updatedAt: createdCompany.updated_at_c
          };
        }
      }
    } catch (error) {
      console.error('Error creating company:', error?.response?.data?.message || error);
      if (!error.message.includes('required') && !error.message.includes('create')) {
        toast.error('Failed to create company');
      }
      throw error;
    }
  },

  // Update existing company
  async update(id, updates) {
    try {
      // Validate required fields
      if (updates.name && !updates.name.trim()) {
        toast.error('Company name is required');
        throw new Error('Company name is required');
      }

      // Map UI data to database field names (only Updateable fields)
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (updates.name !== undefined) {
        updateData.Name = updates.name.trim();
        updateData.name_c = updates.name.trim();
      }
      if (updates.industry !== undefined) updateData.industry_c = updates.industry;
      if (updates.website !== undefined) updateData.website_c = updates.website;
      if (updates.phone !== undefined) updateData.phone_c = updates.phone;
      if (updates.email !== undefined) updateData.email_c = updates.email;
      if (updates.address !== undefined) updateData.address_c = updates.address;
      if (updates.employeeCount !== undefined) updateData.employee_count_c = updates.employeeCount;
      if (updates.revenue !== undefined) updateData.revenue_c = updates.revenue;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.contactCount !== undefined) updateData.contact_count_c = updates.contactCount;
      if (updates.dealCount !== undefined) updateData.deal_count_c = updates.dealCount;
      if (updates.totalValue !== undefined) updateData.total_value_c = updates.totalValue;
      if (updates.status !== undefined) updateData.status_c = updates.status;
      
      // Always update the timestamp
      updateData.updated_at_c = new Date().toISOString();

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Error updating company:', response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update company:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update company');
        }
        
        if (successful.length > 0) {
          const updatedCompany = successful[0].data;
          toast.success(`Company "${updatedCompany.name_c || updatedCompany.Name}" updated successfully`);
          
          // Return in UI-friendly format
          return {
            Id: updatedCompany.Id,
            name: updatedCompany.name_c || updatedCompany.Name,
            industry: updatedCompany.industry_c || '',
            website: updatedCompany.website_c || '',
            phone: updatedCompany.phone_c || '',
            email: updatedCompany.email_c || '',
            address: updatedCompany.address_c || '',
            employeeCount: updatedCompany.employee_count_c || '1-10',
            revenue: updatedCompany.revenue_c || '',
            description: updatedCompany.description_c || '',
            contactCount: updatedCompany.contact_count_c || 0,
            dealCount: updatedCompany.deal_count_c || 0,
            totalValue: updatedCompany.total_value_c || 0,
            status: updatedCompany.status_c || 'Active',
            createdAt: updatedCompany.created_at_c,
            updatedAt: updatedCompany.updated_at_c
          };
        }
      }
    } catch (error) {
      console.error('Error updating company:', error?.response?.data?.message || error);
      if (!error.message.includes('required') && !error.message.includes('update')) {
        toast.error('Failed to update company');
      }
      throw error;
    }
  },

  // Delete company
  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error('Error deleting company:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        if (successful.length > 0) {
          toast.success('Company deleted successfully');
          return { success: true };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting company:', error?.response?.data?.message || error);
      toast.error('Failed to delete company');
      return false;
    }
  }
};