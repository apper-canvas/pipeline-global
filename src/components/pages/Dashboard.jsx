import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import RecentActivity from "@/components/organisms/RecentActivity";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ui/ApperIcon";
import { dashboardService } from "@/services/api/dashboardService";

const Dashboard = () => {
  const { toggleSidebar } = useOutletContext();
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [metricsData, activitiesData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivity()
      ]);
      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <Header title="Dashboard" onMenuToggle={toggleSidebar} />
        <div className="mt-8">
          <Loading type="cards" />
          <div className="mt-8">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <Header title="Dashboard" onMenuToggle={toggleSidebar} />
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Dashboard" 
        onMenuToggle={toggleSidebar}
      />
      
      <div className="mt-8 space-y-8">
        <DashboardMetrics metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentActivity activities={activities} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
                  <div className="bg-primary-100 rounded-lg p-2 mr-3">
                    <ApperIcon name="UserPlus" className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="font-medium text-slate-900">Add Contact</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
                  <div className="bg-emerald-100 rounded-lg p-2 mr-3">
                    <ApperIcon name="Briefcase" className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-medium text-slate-900">Create Deal</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
                  <div className="bg-purple-100 rounded-lg p-2 mr-3">
                    <ApperIcon name="Building2" className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-slate-900">Add Company</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;