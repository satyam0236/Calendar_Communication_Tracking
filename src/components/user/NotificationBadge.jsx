// src/components/user/NotificationBadge.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBadge = ({ overdue, dueToday, onAcknowledgeAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const total = overdue + dueToday;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" />
        {total > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {total}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed right-4 mt-2 w-80 bg-white rounded-lg shadow-lg"
          style={{
            zIndex: 9999,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              {total > 0 && (
                <button
                  onClick={() => {
                    onAcknowledgeAll();
                    setIsOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Acknowledge All
                </button>
              )}
            </div>

            {total === 0 ? (
              <p className="text-gray-500">No pending notifications</p>
            ) : (
              <div className="space-y-4">
                {overdue > 0 && (
                  <div className="text-red-600">
                    {overdue} overdue communication{overdue !== 1 && 's'}
                  </div>
                )}
                {dueToday > 0 && (
                  <div className="text-yellow-600">
                    {dueToday} communication{dueToday !== 1 && 's'} due today
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;