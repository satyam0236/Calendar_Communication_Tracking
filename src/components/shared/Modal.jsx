// src/components/shared/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-xl">
          <div className="sticky top-0 px-6 pt-6 pb-4 border-b bg-white rounded-t-lg z-20">
            <h3 className="text-lg font-medium text-gray-900 pr-8">{title}</h3>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 bg-white rounded-full border border-gray-300 hover:bg-gray-100 z-30"
              aria-label="Close modal"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="px-6 py-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;