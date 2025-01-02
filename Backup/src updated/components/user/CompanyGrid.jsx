// // src/components/user/CompanyGrid.jsx
// import React from 'react';
// import { useAdmin } from '../../contexts/AdminContext';

// const CompanyGrid = ({ onLogCommunication }) => {
//   const { companies } = useAdmin();

//   const getStatusColor = (company) => {
//     // Add logic to determine status color (red for overdue, yellow for due today)
//     return 'bg-white';
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {companies.map(company => (
//         <div
//           key={company.id}
//           className={`${getStatusColor(company)} rounded-lg shadow p-4`}
//         >
//           <div className="flex justify-between items-start mb-4">
//             <h3 className="font-medium text-gray-900">{company.name}</h3>
//             <button
//               onClick={() => onLogCommunication(company)}
//               className="text-blue-600 text-sm hover:text-blue-800"
//             >
//               Log Communication
//             </button>
//           </div>

//           <div className="space-y-3">
//             <div>
//               <h4 className="text-sm font-medium text-gray-600">Last Communications</h4>
//               {/* Add last 5 communications list */}
//             </div>

//             <div>
//               <h4 className="text-sm font-medium text-gray-600">Next Scheduled</h4>
//               {/* Add next scheduled communication */}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CompanyGrid;

// src/components/user/CompanyGrid.jsx
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const CompanyGrid = ({ onLogCommunication }) => {
  const {
    companies,
    getCompanyCommunications,
    getDueStatus
  } = useAdmin();

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
                      <li key={comm.id} className="flex justify-between">
                        <span>{comm.type}</span>
                        <span className="text-gray-500">
                          {new Date(comm.date).toLocaleDateString()}
                        </span>
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