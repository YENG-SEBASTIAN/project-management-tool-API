import React, { useState } from 'react';
import Spinner from './Spinner';

const AddMemberModal = ({ onClose, onAdd }) => {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmails(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(emails.split(',').map(email => email.trim()));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Members</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Member Emails (comma-separated)</label>
            <input
              type="text"
              value={emails}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded flex items-center justify-center">
              {loading ? (
                <Spinner/>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
