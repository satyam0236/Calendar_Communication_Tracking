// src/components/user/UserDashboard.jsx
import React, { useState, useMemo } from 'react';
import CompanyGrid from './CompanyGrid';
import CalendarView from './CalendarView';
import NotificationBadge from './NotificationBadge';
import LogCommunicationModal from './LogCommunicationModal';
import { useAdmin } from '../../contexts/AdminContext';

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const { companies, getNextScheduledCommunication } = useAdmin();
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [acknowledgedNotifications, setAcknowledgedNotifications] = useState(new Set());

  // Calculate overdue and due today communications
  const getDueStatus = () => {
    let overdue = 0;
    let dueToday = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    companies.forEach(company => {
      const nextDate = getNextScheduledCommunication(company.id);
      if (!nextDate) return;

      const dueDate = new Date(nextDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        overdue++;
      } else if (dueDate.getTime() === today.getTime()) {
        dueToday++;
      }
    });

    return { overdue, dueToday };
  };

  const handleAcknowledgeAll = () => {
    const { overdue, dueToday } = getDueStatus();
    setAcknowledgedNotifications(prev => {
      const newSet = new Set(prev);
      [...overdue, ...dueToday].forEach(id => newSet.add(id));
      return newSet;
    });
  };

  const handleLogCommunication = (companyOrCompanies) => {
    if (Array.isArray(companyOrCompanies)) {
      // If receiving array of IDs (from CompanyGrid)
      if (typeof companyOrCompanies[0] === 'string' || typeof companyOrCompanies[0] === 'number') {
        setSelectedCompanies(companyOrCompanies);
      } else {
        // If receiving array of company objects (from CalendarView)
        setSelectedCompanies(companyOrCompanies.map(c => c.id));
      }
    } else {
      // Single company case
      setSelectedCompanies([companyOrCompanies.id]);
    }
    setIsModalOpen(true);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Cache due status calculations
  const dueStatus = useMemo(() => getDueStatus(), [
    companies,
    getNextScheduledCommunication,
    acknowledgedNotifications
  ]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Notifications, Filters, and View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NotificationBadge
            overdue={dueStatus.overdue.length}
            dueToday={dueStatus.dueToday.length}
            onAcknowledgeAll={handleAcknowledgeAll}
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Filter companies..."
              className="px-4 py-2 border rounded-lg"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('grid')}
            className={`px-4 py-2 rounded ${
              activeView === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded ${
              activeView === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'grid' ? (
        <CompanyGrid
          onLogCommunication={handleLogCommunication}
          sortConfig={sortConfig}
          onSort={handleSort}
          filterText={filterText}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          dueStatus={dueStatus}
        />
      ) : (
        <CalendarView onLogCommunication={handleLogCommunication} />
      )}

      {/* Log Communication Modal */}
      <LogCommunicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompanies([]);
        }}
        companies={companies.filter(c => selectedCompanies.includes(c.id))}
      />
    </div>
  );
};

export default UserDashboard;