// src/components/user/NotificationBadge.jsx
import React from 'react';

const NotificationBadge = ({ overdue, dueToday }) => {
  const total = overdue + dueToday;

  return (
    <div className="flex items-center space-x-4">
      {total > 0 && (
        <div className="relative">
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {total}
          </span>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      )}
      {overdue > 0 && (
        <span className="text-red-600 text-sm">
          {overdue} overdue
        </span>
      )}
      {dueToday > 0 && (
        <span className="text-yellow-600 text-sm">
          {dueToday} due today
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;