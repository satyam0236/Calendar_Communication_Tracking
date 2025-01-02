import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';

const ActionButtons = ({ onEdit, onDelete, itemName = 'item' }) => {
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
        title={`Edit ${itemName}`}
      >
        <FiEdit size={18} />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
        title={`Delete ${itemName}`}
      >
        <RiDeleteBinLine size={18} />
      </button>
    </div>
  );
};

export default ActionButtons;