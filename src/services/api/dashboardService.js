import contactsData from "@/services/mockData/contacts.json";
import activitiesData from "@/services/mockData/activities.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  async getMetrics() {
    await delay(500);
    
    const totalContacts = contactsData.length;
    const activeDeals = 24; // Mock data
    const revenue = 487500; // Mock data
    const conversionRate = 32; // Mock data

    return {
      totalContacts,
      activeDeals,
      revenue,
      conversionRate
    };
  },

  async getRecentActivity() {
    await delay(400);
    return [...activitiesData];
  }
};