import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Deals = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Deals" 
        onMenuToggle={toggleSidebar}
      />
      
      <div className="mt-8">
        <Card className="max-w-2xl mx-auto">
          <Card.Content className="text-center py-16">
            <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <ApperIcon name="Briefcase" className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Deal Pipeline Coming Soon
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Track your sales pipeline with kanban boards, deal stages, and revenue forecasting. 
              This feature is currently in development and will be available soon.
            </p>
            <div className="bg-slate-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-slate-900 mb-3">Planned Features:</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <ApperIcon name="Check" className="h-4 w-4 text-emerald-500 mr-2" />
                  Kanban-style deal pipeline
                </li>
                <li className="flex items-center">
                  <ApperIcon name="Check" className="h-4 w-4 text-emerald-500 mr-2" />
                  Customizable deal stages
                </li>
                <li className="flex items-center">
                  <ApperIcon name="Check" className="h-4 w-4 text-emerald-500 mr-2" />
                  Revenue forecasting
                </li>
                <li className="flex items-center">
                  <ApperIcon name="Check" className="h-4 w-4 text-emerald-500 mr-2" />
                  Deal activity timeline
                </li>
              </ul>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Deals;