// src/components/user/CompanyGrid.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const CompanyGrid = ({ onLogCommunication }) => {
  const {
    companies,
    getCompanyCommunications,
    getDueStatus
  } = useAdmin();

  const [tooltipContent, setTooltipContent] = useState(null);

  const getStatusColor = (companyId) => {
    const status = getDueStatus(companyId);
    switch (status) {
      case 'overdue':
        return 'border-l-4 border-red-500';
      case 'due':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  const handleCommunicationHover = (comm) => {
    if (comm.notes) {
      setTooltipContent({
        content: comm.notes,
        type: comm.type,
        date: comm.date
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map(company => {
        const recentCommunications = getCompanyCommunications(company.id).slice(0, 5);

        return (
          <div
            key={company.id}
            className={`bg-white rounded-lg shadow ${getStatusColor(company.id)} p-4`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">{company.name}</h3>
              <button
                onClick={() => onLogCommunication(company)}
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
                        onMouseEnter={() => handleCommunicationHover(comm)}
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
  );
};

export default CompanyGrid;