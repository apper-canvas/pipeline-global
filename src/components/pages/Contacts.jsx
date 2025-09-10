import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import ContactProfile from "@/components/organisms/ContactProfile";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";

const Contacts = () => {
  const { toggleSidebar } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredContacts(contacts);
      return;
    }

const filtered = contacts.filter(contact => {
      const fullName = `${contact.first_name_c} ${contact.last_name_c}`.toLowerCase();
      const searchLower = term.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        contact.email_c.toLowerCase().includes(searchLower) ||
        contact.company_c.toLowerCase().includes(searchLower) ||
        contact.status_c.toLowerCase().includes(searchLower)
      );
    });
    setFilteredContacts(filtered);
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
    setShowContactProfile(false);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowContactProfile(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      let result;
      
      if (editingContact) {
        result = await contactService.update(editingContact.Id, formData);
        setContacts(prev => prev.map(contact => 
          contact.Id === editingContact.Id ? result : contact
        ));
        toast.success("Contact updated successfully!");
      } else {
        result = await contactService.create(formData);
        setContacts(prev => [...prev, result]);
        toast.success("Contact created successfully!");
      }
      
      handleSearch(searchTerm);
      setShowContactForm(false);
      setEditingContact(null);
    } catch (err) {
      toast.error("Failed to save contact. Please try again.");
      console.error("Error saving contact:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      handleSearch(searchTerm);
      toast.success("Contact deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete contact. Please try again.");
      console.error("Error deleting contact:", err);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const headerActions = [
    {
      label: "Add Contact",
      icon: "Plus",
      onClick: handleCreateContact,
      variant: "primary"
    }
  ];

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <Header 
          title="Contacts" 
          onMenuToggle={toggleSidebar}
          actions={headerActions}
        />
        <div className="mt-8">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <Header 
          title="Contacts" 
          onMenuToggle={toggleSidebar}
          actions={headerActions}
        />
        <Error message={error} onRetry={loadContacts} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Contacts" 
        onMenuToggle={toggleSidebar}
        actions={headerActions}
      />
      
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SearchBar
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-96"
          />
          <div className="text-sm text-slate-600">
            {filteredContacts.length} of {contacts.length} contacts
          </div>
        </div>

        {filteredContacts.length === 0 && !searchTerm ? (
          <Empty
            title="No contacts yet"
            description="Get started by adding your first contact to start building your customer relationships."
            actionLabel="Add Contact"
            onAction={handleCreateContact}
            icon="Users"
          />
        ) : filteredContacts.length === 0 && searchTerm ? (
          <Empty
            title="No contacts found"
            description={`No contacts match "${searchTerm}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onAction={() => {
              setSearchTerm("");
              setFilteredContacts(contacts);
            }}
            icon="Search"
          />
        ) : (
          <ContactTable
            contacts={filteredContacts}
            onContactClick={handleContactClick}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </div>

      {/* Contact Form Modal */}
      <Modal
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          setEditingContact(null);
        }}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowContactForm(false);
            setEditingContact(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Contact Profile Modal */}
      <Modal
        isOpen={showContactProfile}
        onClose={() => {
          setShowContactProfile(false);
          setSelectedContact(null);
        }}
        title="Contact Details"
        size="lg"
      >
        {selectedContact && (
          <ContactProfile
            contact={selectedContact}
            onEdit={handleEditContact}
            onClose={() => {
              setShowContactProfile(false);
              setSelectedContact(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Contacts;