// src/components/user/CalendarView.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const CalendarView = ({ onLogCommunication }) => {
  const { companies, communications, getNextScheduledCommunication } = useAdmin();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
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

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="p-4 border-b flex justify-between items-center">
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
        <h2 className="text-lg font-medium">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
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

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Week day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {generateCalendarDays().map((date, index) => (
          <div
            key={index}
            className={`bg-white min-h-[120px] p-2 ${
              date ? 'hover:bg-gray-50' : ''
            }`}
          >
            {date && (
              <>
                <div className="text-right text-sm text-gray-500">
                  {date.getDate()}
                </div>

                {/* Completed Communications */}
                {getCommunicationsForDate(date).map(comm => (
                  <div
                    key={comm.id}
                    className="text-xs p-1 mb-1 bg-green-100 text-green-800 rounded"
                  >
                    {companies.find(c => c.id === comm.companyId)?.name}
                  </div>
                ))}

                {/* Scheduled Communications */}
                {getScheduledCommunicationsForDate(date).map(company => (
                  <div
                    key={company.id}
                    className="text-xs p-1 mb-1 bg-blue-100 text-blue-800 rounded cursor-pointer"
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