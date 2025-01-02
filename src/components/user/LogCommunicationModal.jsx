// src/components/user/LogCommunicationModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../shared/Modal';
import { useAdmin } from '../../contexts/AdminContext';

const LogCommunicationModal = ({ isOpen, onClose, company }) => {
  const { communicationMethods, communications, addCommunication } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    companyId: null
  });
  const [validationError, setValidationError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        companyId: company?.id
      });
      setValidationError('');
    }
  }, [isOpen, company]);

  // Sort communication methods by sequence
  const sortedMethods = useMemo(() => {
    return [...communicationMethods].sort((a, b) => a.sequence - b.sequence);
  }, [communicationMethods]);

  const validateCommunicationSequence = (selectedType) => {
    if (!company) return '';

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

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate required fields
    if (!formData.type || !formData.date) {
      setValidationError('Please fill in all required fields');
      return;
    }

    // Validate sequence
    const sequenceError = validateCommunicationSequence(formData.type);
    if (sequenceError) {
      setValidationError(sequenceError);
      return;
    }

    try {
      setIsSubmitting(true);
      await addCommunication({
        ...formData,
        id: Date.now(), // Temporary ID for demo
        date: new Date(formData.date).toISOString()
      });
      onClose();
    } catch (error) {
      setValidationError('Failed to log communication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          Log Communication - {company?.name}
        </h2>

        {validationError && (
          <div className="p-2 text-red-600 bg-red-50 rounded">
            {validationError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Communication Type*
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select type</option>
            {sortedMethods.map(method => (
              <option key={method.id} value={method.name}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date*
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
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LogCommunicationModal;