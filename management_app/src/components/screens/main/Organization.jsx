import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { addOrganization, getOrganizations, updateOrganization } from '../../../actions/organizationActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ItemList from '../../common/ItemList';

const Organization = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, loading, error } = useSelector(state => state.organizations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateMembersModalOpen, setIsUpdateMembersModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');
  const [membersEmails, setMembersEmails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleAddNewOrganization = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(addOrganization({
        name: organizationName,
        description: organizationDescription,
        owner: user
      }));
      setSuccessMessage('Organization added successfully.');
      setOrganizationName('');
      setOrganizationDescription('');
      setIsAddModalOpen(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to add organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMembers = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(updateOrganization(selectedOrganizationId, {
        members_emails: membersEmails.split(',').map(email => email.trim())
      }));
      setSuccessMessage('Members updated successfully.');
      setMembersEmails('');
      setIsUpdateMembersModalOpen(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update members');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (organizationId) => {
    navigate(`/dashboard/organization/${organizationId}`);
  };

  const handleOpenUpdateMembersModal = (organizationId) => {
    setSelectedOrganizationId(organizationId);
    setIsUpdateMembersModalOpen(true);
  };

  return (
    <div className="p-4">
      {error && <Alert message={error} type="error" />}
      {successMessage && <Alert message={successMessage} type="success" />}
      {errorMessage && <Alert message={errorMessage} type="error" />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <button
          className="bg-orange-600 text-white py-2 px-4 rounded flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Add New Organization
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <ItemList
          items={organizations}
          onItemClick={handleCardClick}
          onItemSecondaryActionClick={handleOpenUpdateMembersModal}
          emptyMessage="Organization list is empty. You can add one."
          itemKey="id"
          itemTitle="name"
          itemDescription="description"
          secondaryActionLabel="Update Members"
        />
      )}

      {/* Add New Organization Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Organization</h2>
            <form onSubmit={handleAddNewOrganization}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  className="w-full px-3 py-2 border rounded"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="organizationDescription"
                  className="w-full px-3 py-2 border rounded"
                  value={organizationDescription}
                  onChange={(e) => setOrganizationDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 py-2 px-4 bg-gray-300 rounded"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-orange-600 text-white rounded flex items-center justify-center">
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Add Organization'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Members Modal */}
      {isUpdateMembersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Members</h2>
            <form onSubmit={handleUpdateMembers}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Members Emails (comma-separated)</label>
                <textarea
                  name="membersEmails"
                  className="w-full px-3 py-2 border rounded"
                  value={membersEmails}
                  onChange={(e) => setMembersEmails(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 py-2 px-4 bg-gray-300 rounded"
                  onClick={() => setIsUpdateMembersModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-orange-600 text-white rounded flex items-center justify-center">
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Update Members'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;
