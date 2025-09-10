import companiesData from '@/services/mockData/companies.json';
import { toast } from 'react-toastify';

// Mock service for companies management
// When database becomes available, replace with actual API calls

let companies = [...companiesData];
let nextId = Math.max(...companies.map(c => c.Id)) + 1;

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  // Get all companies
  async getAll() {
    await delay(300);
    // Return copies to prevent direct mutation
    return companies.map(company => ({ ...company }));
  },

  // Get company by ID
  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  // Create new company
  async create(companyData) {
    await delay(500);
    
    // Validate required fields
    if (!companyData.name) {
      throw new Error('Company name is required');
    }
    
    // Create new company with auto-generated ID
    const newCompany = {
      Id: nextId++,
      name: companyData.name.trim(),
      industry: companyData.industry || 'Other',
      website: companyData.website || '',
      phone: companyData.phone || '',
      email: companyData.email || '',
      address: companyData.address || '',
      employeeCount: companyData.employeeCount || '1-10',
      revenue: companyData.revenue || '',
      description: companyData.description || '',
      contactCount: 0,
      dealCount: 0,
      totalValue: 0,
      status: companyData.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    
    toast.success(`Company "${newCompany.name}" created successfully`);
    return { ...newCompany };
  },

  // Update existing company
  async update(id, updates) {
    await delay(500);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    // Validate required fields
    if (updates.name && !updates.name.trim()) {
      throw new Error('Company name is required');
    }
    
    const updatedCompany = {
      ...companies[index],
      ...updates,
      name: updates.name ? updates.name.trim() : companies[index].name,
      Id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    companies[index] = updatedCompany;
    
    toast.success(`Company "${updatedCompany.name}" updated successfully`);
    return { ...updatedCompany };
  },

  // Delete company
  async delete(id) {
    await delay(300);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    const company = companies[index];
    companies.splice(index, 1);
    
    toast.success(`Company "${company.name}" deleted successfully`);
    return { success: true };
  }
};