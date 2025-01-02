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

  const handleEdit = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'companies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              onClick={() => setActiveTab('companies')}
            >
              Companies
            </button>
            <button
              className={`${
                activeTab === 'methods'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('methods')}
            >
              Communication Methods
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add {activeTab === 'companies' ? 'Company' : 'Method'}
        </button>
      </div>

      {activeTab === 'companies' ? (
        <CompanyList onEdit={handleEdit} />
      ) : (
        <MethodList onEdit={handleEdit} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={`${editItem ? 'Edit' : 'Add'} ${
          activeTab === 'companies' ? 'Company' : 'Method'
        }`}
      >
        {activeTab === 'companies' ? (
          <CompanyForm company={editItem} onClose={handleClose} />
        ) : (
          <MethodForm method={editItem} onClose={handleClose} />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;