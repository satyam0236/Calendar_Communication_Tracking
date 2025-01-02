// src/components/user/LogCommunicationModal.jsx
import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useAdmin } from '../../contexts/AdminContext';

const LogCommunicationModal = ({ isOpen, onClose, company }) => {
  const { communicationMethods, communications, addCommunication } = useAdmin();
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    companyId: company?.id
  });
  const [validationError, setValidationError] = useState('');

  const validateCommunicationSequence = (selectedType) => {
    // Get company's previous communications
    const companyCommunications = communications
      .filter(c => c.companyId === company.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (companyCommunications.length === 0) {
      // First communication must be the first in sequence
      const firstMethod = sortedMethods[0];
      return selectedType === firstMethod.name ? '' : `First communication must be ${firstMethod.name}`;
    }

    const lastComm = companyCommunications[0];
    const lastMethodIndex = sortedMethods.findIndex(m => m.name === lastComm.type);
    const selectedMethodIndex = sortedMethods.findIndex(m => m.name === selectedType);

    // Can only move forward in sequence or repeat current method
    if (selectedMethodIndex < lastMethodIndex) {
      return `Cannot use ${selectedType} after ${lastComm.type}. Please follow the sequence.`;
    }

    // If skipping methods, check if any mandatory ones were missed
    if (selectedMethodIndex > lastMethodIndex + 1) {
      const skippedMandatory = sortedMethods
        .slice(lastMethodIndex + 1, selectedMethodIndex)
        .filter(m => m.isMandatory)
        .map(m => m.name);

      if (skippedMandatory.length > 0) {
        return `Must complete mandatory methods first: ${skippedMandatory.join(', ')}`;
      }
    }

    return '';
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    const error = validateCommunicationSequence(selectedType);
    setValidationError(error);
    setFormData(prev => ({ ...prev, type: selectedType }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validationError) return;

    addCommunication({
      ...formData,
      id: Date.now(),
      date: new Date(formData.date).toISOString()
    });
    onClose();
  };

  // Sort methods by sequence
  const sortedMethods = [...communicationMethods].sort((a, b) => a.sequence - b.sequence);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Communication - ${company?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Communication Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select type</option>
            {sortedMethods.map(method => (
              <option
                key={method.id}
                value={method.name}
                className={method.isMandatory ? 'font-bold' : ''}
              >
                {method.name} {method.isMandatory ? '(Required)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
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
            Log Communication
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LogCommunicationModal;