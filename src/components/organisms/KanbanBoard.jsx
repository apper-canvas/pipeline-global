import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import DealCard from "@/components/molecules/DealCard";
import { dealService } from "@/services/api/dealService";
import { formatCurrency } from "@/utils/formatters";
import Loading from "@/components/ui/Loading";

const STAGES = [
  { id: "Lead", label: "Lead", color: "bg-blue-50 border-blue-200" },
  { id: "Qualified", label: "Qualified", color: "bg-purple-50 border-purple-200" },
  { id: "Proposal", label: "Proposal", color: "bg-yellow-50 border-yellow-200" },
  { id: "Negotiation", label: "Negotiation", color: "bg-orange-50 border-orange-200" },
  { id: "Closed Won", label: "Closed Won", color: "bg-emerald-50 border-emerald-200" }
];

const KanbanBoard = ({ onDealClick }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const dealsData = await dealService.getAll();
      setDeals(dealsData);
    } catch (error) {
      console.error("Failed to load deals:", error);
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageTotal = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, stage) => {
    e.preventDefault();
    setDragOverColumn(stage);
  };

  const handleDragLeave = (e) => {
    // Only clear drag over if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedDeal || draggedDeal.stage === newStage) {
      return;
    }

    try {
      // Optimistic update
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id 
          ? { ...deal, stage: newStage }
          : deal
      ));

      await dealService.updateStage(draggedDeal.Id, newStage);
      toast.success(`Deal moved to ${newStage}`);
    } catch (error) {
      console.error("Failed to update deal stage:", error);
      toast.error("Failed to move deal");
      // Revert optimistic update
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id 
          ? { ...deal, stage: draggedDeal.stage }
          : deal
      ));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = getDealsByStage(stage.id);
          const total = getStageTotal(stage.id);
          const isDragOver = dragOverColumn === stage.id;

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <Card className={`h-full border-2 transition-all duration-200 ${
                isDragOver ? 'border-primary-400 bg-primary-50' : stage.color
              }`}>
                <Card.Header className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-slate-900">
                        {stage.label}
                      </h3>
                      <span className="ml-2 bg-slate-200 text-slate-600 text-sm px-2 py-1 rounded-full">
                        {stageDeals.length}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-700">
                    Total: {formatCurrency(total)}
                  </div>
                </Card.Header>
                
                <Card.Content className="h-full overflow-y-auto space-y-3 max-h-96">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <ApperIcon name="CircleDot" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <DealCard
                        key={deal.Id}
                        deal={deal}
                        onClick={() => onDealClick(deal)}
                        onDragStart={(e) => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    ))
                  )}
                </Card.Content>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;