// src/components/user/CompanyGrid.jsx
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const CompanyGrid = ({
  onLogCommunication,
  sortConfig,
  onSort,
  filterText,
  selectedCompanies,
  setSelectedCompanies,
  dueStatus
}) => {
  const {
    companies,
    getCompanyCommunications,
    getDueStatus,
    getNextScheduledCommunication
  } = useAdmin();
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleCommunicationHover = (comm, event) => {
    if (comm.notes) {
      const rect = event.target.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      setTooltipContent({
        content: comm.notes,
        type: comm.type,
        date: comm.date
      });
    }
  };

  const getStatusColor = (companyId) => {
    const nextDate = getNextScheduledCommunication(companyId);
    if (!nextDate) return '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(nextDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return 'border-l-4 border-red-500'; // Overdue
    } else if (dueDate.getTime() === today.getTime()) {
      return 'border-l-4 border-yellow-500'; // Due today
    }
    return ''; // Not due
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCompanies(filteredCompanies.map(c => c.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  // Apply sorting and filtering
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Apply filter
    if (filterText) {
      result = result.filter(company =>
        company.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Apply sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [companies, filterText, sortConfig]);

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={selectedCompanies.length === filteredCompanies.length}
            onChange={handleSelectAll}
          />
          <span className="ml-2">Select All</span>
        </label>
        {selectedCompanies.length > 0 && (
          <button
            onClick={() => onLogCommunication(selectedCompanies)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log Communication ({selectedCompanies.length})
          </button>
        )}
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => {
          const recentCommunications = getCompanyCommunications(company.id).slice(0, 5);

          return (
            <div
              key={company.id}
              className={`bg-white rounded-lg shadow ${getStatusColor(company.id)} p-4`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                    checked={selectedCompanies.includes(company.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCompanies([...selectedCompanies, company.id]);
                      } else {
                        setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
                      }
                    }}
                  />
                  <h3 className="font-medium text-gray-900">{company.name}</h3>
                </div>
                <button
                  onClick={() => onLogCommunication([company.id])}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  Log Communication
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Last Communications
                  </h4>
                  {recentCommunications.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {recentCommunications.map(comm => (
                        <li
                          key={comm.id}
                          className="flex justify-between"
                          onMouseEnter={(event) => handleCommunicationHover(comm, event)}
                          onMouseLeave={() => setTooltipContent(null)}
                        >
                          <span>{comm.type}</span>
                          <span className="text-gray-500">
                            {new Date(comm.date).toLocaleDateString()}
                          </span>
                          {tooltipContent && (
                            <div className="absolute z-10 p-2 bg-gray-800 text-white rounded shadow-lg">
                              <p className="font-medium">{tooltipContent.type}</p>
                              <p>{tooltipContent.content}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No communications logged</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600">Next Scheduled</h4>
                  <p className="text-sm text-gray-500">
                    Every {company.communicationPeriodicity} days
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute z-50 bg-black text-white p-2 rounded shadow-lg text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 5}px`
          }}
        >
          <div className="font-bold">{tooltipContent.type}</div>
          <div>{new Date(tooltipContent.date).toLocaleDateString()}</div>
          <div>{tooltipContent.content}</div>
        </div>
      )}
    </div>
  );
};

export default CompanyGrid;