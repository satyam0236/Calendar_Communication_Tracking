// src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import CompanyList from './CompanyManagement/CompanyList';
import CompanyForm from './CompanyManagement/CompanyForm';
import MethodList from './CommunicationMethods/MethodList';
import MethodForm from './CommunicationMethods/MethodForm';
import Modal from '../shared/Modal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleAdd = () => {
    setEditItem(null); // Clear any existing edit item
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditItem(null); // Clear edit item when closing
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="card inline-flex p-1">
        <button
          onClick={() => setActiveTab('companies')}
          className={`btn ${
            activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Company Management
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={`btn ml-1 ${
            activeTab === 'methods' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Communication Methods
        </button>
      </div>

      {/* Content */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === 'companies' ? 'Companies' : 'Communication Methods'}
          </h2>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
          >
            Add {activeTab === 'companies' ? 'Company' : 'Method'}
          </button>
        </div>

        <div className="card-body">
          {activeTab === 'companies' ? (
            <CompanyList onEdit={handleEdit} />
          ) : (
            <MethodList onEdit={handleEdit} />
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleClose}
          title={`${editItem ? 'Edit' : 'Add'} ${
            activeTab === 'companies' ? 'Company' : 'Method'
          }`}
        >
          {activeTab === 'companies' ? (
            <CompanyForm
              company={editItem}
              onClose={handleClose}
            />
          ) : (
            <MethodForm
              method={editItem}
              onClose={handleClose}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;