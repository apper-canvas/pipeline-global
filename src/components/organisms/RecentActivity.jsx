import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/formatters";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      "contact_created": "UserPlus",
      "contact_updated": "Edit", 
      "deal_created": "Briefcase",
      "deal_won": "Trophy",
      "email_sent": "Mail",
      "call_made": "Phone"
    };
    return iconMap[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colorMap = {
      "contact_created": "text-emerald-600 bg-emerald-100",
      "contact_updated": "text-blue-600 bg-blue-100",
      "deal_created": "text-purple-600 bg-purple-100", 
      "deal_won": "text-yellow-600 bg-yellow-100",
      "email_sent": "text-slate-600 bg-slate-100",
      "call_made": "text-orange-600 bg-orange-100"
    };
    return colorMap[type] || "text-slate-600 bg-slate-100";
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Activity</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                <ApperIcon 
                  name={getActivityIcon(activity.type)} 
                  className="h-4 w-4"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {activity.description}
                </p>
                <p className="text-sm text-slate-500">
                  {activity.details}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <ApperIcon name="Activity" className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600">No recent activity</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;