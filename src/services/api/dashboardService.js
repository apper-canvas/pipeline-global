// Initialize ApperClient for dashboard data operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  async getMetrics() {
    await delay(500);
    
    try {
      // Get actual contact count from database
      const contactParams = {
        fields: [{"field": {"Name": "Id"}}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const contactResponse = await apperClient.fetchRecords('contact_c', contactParams);
      const totalContacts = contactResponse?.total || 0;
      
      // Other metrics remain mock for now
      const activeDeals = 24;
      const revenue = 487500;
      const conversionRate = 32;

      return {
        totalContacts,
        activeDeals,
        revenue,
        conversionRate
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data?.message || error);
      
      // Return default values on error
      return {
        totalContacts: 0,
        activeDeals: 24,
        revenue: 487500,
        conversionRate: 32
      };
    }
  },

  async getRecentActivity() {
    await delay(400);
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error?.response?.data?.message || error);
      return [];
    }
  }
};