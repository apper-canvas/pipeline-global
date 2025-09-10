import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import DealModal from "@/components/organisms/DealModal";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";
import { dealService } from "@/services/api/dealService";

const Deals = () => {
  const { toggleSidebar } = useOutletContext();
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDealUpdate = (updatedDeal) => {
    setSelectedDeal(updatedDeal);
    setRefreshKey(prev => prev + 1);
  };

  const handleDealDelete = () => {
    setSelectedDeal(null);
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateDeal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSave = () => {
    setIsCreateModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const headerActions = [
    {
      label: "Add Deal",
      icon: "Plus",
      onClick: handleCreateDeal,
      variant: "primary"
    }
  ];

  return (
    <div className="p-4 lg:p-8 h-screen flex flex-col">
      <Header 
        title="Deals" 
        onMenuToggle={toggleSidebar}
        actions={headerActions}
      />
      
      <div className="mt-8 flex-1 overflow-hidden">
        <KanbanBoard 
          key={refreshKey}
          onDealClick={handleDealClick}
        />
      </div>

      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleDealUpdate}
        onDelete={handleDealDelete}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deal"
        size="lg"
      >
        <DealForm
          onSave={handleCreateSave}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Deals;