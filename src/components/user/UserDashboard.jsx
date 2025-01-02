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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { companies, communications, getNextScheduledCommunication } = useAdmin();

  // Calculate overdue and due today communications
  const getDueStatus = () => {
    const overdue = [];
    const dueToday = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    companies.forEach(company => {
      const nextDate = getNextScheduledCommunication(company.id);
      if (!nextDate) return;

      const dueDate = new Date(nextDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        overdue.push(company.id);
      } else if (dueDate.getTime() === today.getTime()) {
        dueToday.push(company.id);
      }
    });

    return { overdue, dueToday };
  };

  // Cache due status calculations
  const dueStatus = useMemo(() => getDueStatus(), [companies, getNextScheduledCommunication]);

  // Add notification acknowledgment
  const [acknowledgedNotifications, setAcknowledgedNotifications] = useState(new Set());

  const handleAcknowledgeNotification = (companyId) => {
    setAcknowledgedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.add(companyId);
      return newSet;
    });
  };

  // Filter notifications for display
  const activeNotifications = useMemo(() => {
    const { overdue, dueToday } = dueStatus;
    return {
      overdue: overdue.filter(id => !acknowledgedNotifications.has(id)),
      dueToday: dueToday.filter(id => !acknowledgedNotifications.has(id))
    };
  }, [dueStatus, acknowledgedNotifications]);

  const handleLogCommunication = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Notifications and View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NotificationBadge
            overdue={activeNotifications.overdue.length}
            dueToday={activeNotifications.dueToday.length}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('grid')}
            className={`px-4 py-2 rounded ${
              activeView === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded ${
              activeView === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'grid' ? (
        <CompanyGrid onLogCommunication={handleLogCommunication} />
      ) : (
        <CalendarView onLogCommunication={handleLogCommunication} />
      )}

      {/* Log Communication Modal */}
      <LogCommunicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
      />
    </div>
  );
};

export default UserDashboard;