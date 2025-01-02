// src/components/admin/CommunicationMethods/MethodForm.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

const MethodForm = ({ method = null, onClose }) => {
  const { addMethod, updateMethod } = useAdmin();
  const [formData, setFormData] = useState({
    name: method?.name || '',
    description: method?.description || '',
    sequence: method?.sequence || 1,
    isMandatory: method?.isMandatory || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method) {
      updateMethod(method.id, formData);
    } else {
      addMethod(formData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Method Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sequence</label>
        <input
          type="number"
          name="sequence"
          value={formData.sequence}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min="1"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isMandatory"
            checked={formData.isMandatory}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm"
          />
          <span className="ml-2 text-sm text-gray-700">Mandatory</span>
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md text-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {method ? 'Update' : 'Add'} Method
        </button>
      </div>
    </form>
  );
};

export default MethodForm;