// src/components/user/CalendarView.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const CalendarView = ({ onLogCommunication }) => {
  const { companies, communications, getNextScheduledCommunication } = useAdmin();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCommunicationsForDate = (date) => {
    if (!date) return [];
    return communications.filter(comm => {
      const commDate = new Date(comm.date);
      return (
        commDate.getDate() === date.getDate() &&
        commDate.getMonth() === date.getMonth() &&
        commDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getScheduledCommunicationsForDate = (date) => {
    if (!date) return [];
    return companies.filter(company => {
      const nextDate = getNextScheduledCommunication(company.id);
      if (!nextDate) return false;

      return (
        nextDate.getDate() === date.getDate() &&
        nextDate.getMonth() === date.getMonth() &&
        nextDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const CommunicationItem = ({ comm }) => {
    const company = companies.find(c => c.id === comm.companyId);

    if (!company) return null;

    return (
      <div
        className="text-xs p-1 mb-1 bg-green-100 text-green-800 rounded cursor-pointer"
        title={`Type: ${comm.type}
Date: ${new Date(comm.date).toLocaleDateString()}
Notes: ${comm.notes || 'No notes'}`}
      >
        {company.name}
      </div>
    );
  };

  const handleDayClick = (date) => {
    if (!date) return;

    // Get all companies that have communications due on this date
    const dueCompanies = getScheduledCommunicationsForDate(date);

    if (dueCompanies.length > 0) {
      onLogCommunication(dueCompanies);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header with Navigation */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Today
          </button>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>

        <h2 className="text-lg font-medium">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>

        {/* Month/Year Picker */}
        <input
          type="month"
          value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-');
            setCurrentDate(new Date(year, month - 1));
          }}
          className="px-2 py-1 border rounded"
        />
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {generateCalendarDays().map((date, index) => (
          <div
            key={index}
            className={`bg-white min-h-[120px] p-2 ${
              date ? 'hover:bg-gray-50 cursor-pointer' : ''
            } ${isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            onClick={() => handleDayClick(date)}
          >
            {date && (
              <>
                <div className={`text-sm font-medium mb-1 ${
                  isPastDate(date) ? 'text-gray-500' :
                  isToday(date) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>

                {/* Past Communications */}
                {getCommunicationsForDate(date).map(comm => (
                  <CommunicationItem
                    key={comm.id}
                    comm={comm}
                  />
                ))}

                {/* Scheduled Communications */}
                {getScheduledCommunicationsForDate(date).map(company => (
                  <div
                    key={company.id}
                    className="text-xs p-1 mb-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                    onClick={() => onLogCommunication(company)}
                  >
                    {company.name} (Due)
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;