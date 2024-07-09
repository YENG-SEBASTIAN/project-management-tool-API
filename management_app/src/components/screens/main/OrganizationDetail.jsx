import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganizationById, deleteOrganization, updateOrganization } from '../../../actions/organizationActions';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ConfirmModal from '../../common/ConfirmModal';
import UpdateModal from '../../common/UpdateModal';

const OrganizationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { organizations, loading, error } = useSelector(state => state.organizations);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getOrganizationById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (organizations.length > 0) {
      setCurrentOrganization(organizations[0]);
    }
  }, [organizations]);

  const handleDelete = async () =>{
    await dispatch(deleteOrganization(id));
    return navigate('dashboard/organization')
  }

  if (loading) {
    return <Spinner />;
  }

  if (error || !currentOrganization) {
    return <Alert message={error || "Organization not found"} type="error" />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Org. Name: {currentOrganization.name}</h1>
        <div className="flex space-x-2">
          <button
            className="text-red-500"
            onClick={() => setConfirmModal(true)}
          >
            <AiOutlineDelete size={24} />
          </button>
          <button
            className="text-blue-500"
            onClick={() => setShowUpdateModal(true)}
          >
            <AiOutlineEdit size={24} />
          </button>
        </div>
      </div>
      <p className="text-lg">Description: {currentOrganization.description}</p>
      <h2 className="mt-4 text-xl font-bold">Members</h2>
      <ul className="mt-2">
        {currentOrganization.members_emails.map((email, index) => (
          <li key={index} className="py-1">{email}</li>
        ))}
      </ul>

      {showConfirmModal && (
        <ConfirmModal
          onClose={() => setConfirmModal(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this organization?"
          submitName="Delete"
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          organization={currentOrganization}
          onUpdate={(updatedData) => dispatch(updateOrganization(id, updatedData))}
        />
      )}
    </div>
  );
};

export default OrganizationDetail;
