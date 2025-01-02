// src/components/admin/CommunicationMethods/MethodList.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import ActionButtons from '../../shared/ActionButtons';

const MethodList = ({ onEdit }) => {
  const { communicationMethods, deleteMethod } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter methods based on search term
  const filteredMethods = communicationMethods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMethods.length / itemsPerPage);
  const paginatedMethods = filteredMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this communication method?')) {
      deleteMethod(id);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search methods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Methods Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sequence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mandatory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedMethods.map((method) => (
              <tr key={method.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {method.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {method.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {method.sequence}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {method.isMandatory ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionButtons
                    onEdit={() => onEdit(method)}
                    onDelete={() => handleDelete(method.id)}
                    itemName="method"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Data Message */}
        {paginatedMethods.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No communication methods found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          {filteredMethods.length > 0 ? (
            <>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredMethods.length)} of{' '}
              {filteredMethods.length} entries
            </>
          ) : (
            'No entries to show'
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || filteredMethods.length === 0}
            className={`px-3 py-1 border rounded
              ${(currentPage === 1 || filteredMethods.length === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || filteredMethods.length === 0}
            className={`px-3 py-1 border rounded
              ${(currentPage === totalPages || filteredMethods.length === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodList;