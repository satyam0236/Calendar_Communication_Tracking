// src/components/admin/CompanyManagement/CompanyForm.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

const CompanyForm = ({ company = null, onClose }) => {
  const { addCompany, updateCompany } = useAdmin();
  const [formData, setFormData] = useState({
    name: company?.name || '',
    location: company?.location || '',
    linkedInProfile: company?.linkedInProfile || '',
    emails: company?.emails || [''],
    phone: company?.phone || '',
    comments: company?.comments || '',
    communicationPeriodicity: company?.communicationPeriodicity || 30,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company) {
      updateCompany(company.id, formData);
    } else {
      addCompany(formData);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };

  const removeEmailField = (index) => {
    if (formData.emails.length > 1) {
      const newEmails = formData.emails.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, emails: newEmails }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
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
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
        <input
          type="url"
          name="linkedInProfile"
          value={formData.linkedInProfile}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Addresses
        </label>
        {formData.emails.map((email, index) => (
          <div key={index} className="flex gap-2 mt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm"
              placeholder="Enter email address"
            />
            <button
              type="button"
              onClick={() => removeEmailField(index)}
              className="text-red-600 hover:text-red-800"
              disabled={formData.emails.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEmailField}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add another email
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Communication Periodicity (days)
        </label>
        <input
          type="number"
          name="communicationPeriodicity"
          value={formData.communicationPeriodicity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min="1"
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
          {company ? 'Update' : 'Add'} Company
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;