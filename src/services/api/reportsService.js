import { contactService } from './contactService';
import { dealService } from './dealService';
import { companyService } from './companyService';
import activitiesData from '../mockData/activities.json';

class ReportsService {
  async getMetrics() {
    try {
      const [contacts, deals, companies] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        companyService.getAll()
      ]);

      const closedDeals = deals.filter(deal => deal.status === 'closed-won');
      const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const totalDeals = deals.length;
      const conversionRate = totalDeals > 0 ? (closedDeals.length / totalDeals) * 100 : 0;

      return {
        totalRevenue,
        totalDeals: closedDeals.length,
        totalContacts: contacts.length,
        totalCompanies: companies.length,
        conversionRate: Math.round(conversionRate * 10) / 10,
        averageDealValue: closedDeals.length > 0 ? Math.round(totalRevenue / closedDeals.length) : 0
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  async getDealPipeline() {
    try {
      const deals = await dealService.getAll();
      
      const pipeline = {
        'lead': deals.filter(d => d.status === 'lead').length,
        'qualified': deals.filter(d => d.status === 'qualified').length,
        'proposal': deals.filter(d => d.status === 'proposal').length,
        'negotiation': deals.filter(d => d.status === 'negotiation').length,
        'closed-won': deals.filter(d => d.status === 'closed-won').length,
        'closed-lost': deals.filter(d => d.status === 'closed-lost').length
      };

      return pipeline;
    } catch (error) {
      console.error('Error fetching deal pipeline:', error);
      throw error;
    }
  }

  async getRevenueData() {
    try {
      const deals = await dealService.getAll();
      const closedDeals = deals.filter(deal => deal.status === 'closed-won');

      // Group by month for the last 6 months
      const months = [];
      const revenues = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        
        months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        
        // Simulate monthly revenue distribution
        const monthRevenue = closedDeals
          .filter(() => Math.random() > 0.3) // Random distribution for demo
          .reduce((sum, deal) => sum + (deal.value || 0), 0) / 6;
          
        revenues.push(Math.round(monthRevenue));
      }

      return { months, revenues };
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }

  async getTopPerformers() {
    try {
      const [contacts, deals, companies] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        companyService.getAll()
      ]);

      // Top companies by deal value
      const companyDeals = {};
      deals.forEach(deal => {
        if (deal.companyId) {
          if (!companyDeals[deal.companyId]) {
            companyDeals[deal.companyId] = 0;
          }
          companyDeals[deal.companyId] += deal.value || 0;
        }
      });

      const topCompanies = companies
        .map(company => ({
          ...company,
          totalValue: companyDeals[company.Id] || 0
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

      return {
        topCompanies
      };
    } catch (error) {
      console.error('Error fetching top performers:', error);
      throw error;
    }
  }
}

export const reportsService = new ReportsService();