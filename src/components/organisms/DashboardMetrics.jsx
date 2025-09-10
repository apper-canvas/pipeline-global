import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DashboardMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: "Total Contacts",
      value: metrics.totalContacts,
      change: "+12%",
      changeType: "positive",
      icon: "Users",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Deals",
      value: metrics.activeDeals,
      change: "+5%", 
      changeType: "positive",
      icon: "Briefcase",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Revenue",
      value: `$${metrics.revenue.toLocaleString()}`,
      change: "+18%",
      changeType: "positive", 
      icon: "DollarSign",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      change: "+3%",
      changeType: "positive",
      icon: "TrendingUp", 
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-2">
                    {metric.value}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-emerald-600">
                      {metric.change}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${metric.gradient} rounded-lg p-3`}>
                  <ApperIcon 
                    name={metric.icon} 
                    className="h-6 w-6 text-white" 
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardMetrics;