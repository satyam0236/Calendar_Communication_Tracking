// src/components/admin/CompanyManagement/CompanyList.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import ActionButtons from '../../shared/ActionButtons';

const CompanyList = ({ onEdit }) => {
  const { companies, deleteCompany } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(id);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Company Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodicity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCompanies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {company.name}
                  </div>
                  {company.linkedInProfile && (
                    <div className="text-sm text-gray-500">
                      <a
                        href={company.linkedInProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.location || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {company.emails?.map((email, index) => (
                      <div key={index}>
                        {email || '-'}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {company.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.communicationPeriodicity} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionButtons
                    onEdit={() => onEdit(company)}
                    onDelete={() => handleDelete(company.id)}
                    itemName="company"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Data Message */}
        {paginatedCompanies.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No companies found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          {filteredCompanies.length > 0 ? (
            <>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of{' '}
              {filteredCompanies.length} entries
            </>
          ) : (
            'No entries to show'
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || filteredCompanies.length === 0}
            className={`px-3 py-1 border rounded
              ${(currentPage === 1 || filteredCompanies.length === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || filteredCompanies.length === 0}
            className={`px-3 py-1 border rounded
              ${(currentPage === totalPages || filteredCompanies.length === 0)
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

export default CompanyList;