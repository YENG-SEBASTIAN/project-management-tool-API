import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganizationById, deleteOrganization, patchOrganization } from '../../../actions/organizationActions';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineUserAdd } from 'react-icons/ai';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ConfirmModal from '../../common/ConfirmModal';
import UpdateModal from '../../common/UpdateModal';
import AddMemberModal from '../../common/AddMemberModal';

const OrganizationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organization, loading, error } = useSelector(state => state.organizations);
  const user = JSON.parse(localStorage.getItem('user'));

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    dispatch(getOrganizationById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deleteOrganization(id));
    navigate('/dashboard/organizations');
  };

  const handleAddMembers = async (members) => {
    const updatedData = { members };
    await dispatch(patchOrganization(id, updatedData));
    setShowAddMemberModal(false);
    dispatch(getOrganizationById(id)); // Refresh the organization details
  };

  const handleMemberDelete = (email) => {
    setMemberToDelete(email);
    setShowConfirmModal(true);
  };

  const confirmDeleteMember = async () => {
    if (memberToDelete) {
      const updatedMembers = organization.members_display.filter(member => member !== memberToDelete);
      const updatedData = { members: updatedMembers };
      await dispatch(patchOrganization(id, updatedData));
      setShowConfirmModal(false);
      dispatch(getOrganizationById(id)); // Refresh the organization details
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!organization) {
    return <Alert message="Organization not found" type="error" />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Org. Name: {organization.name}</h1>
        {organization.owner === user.id ? 
          <div className="flex space-x-2">
            <button className="text-red-500" onClick={() => setShowConfirmModal(true)}>
              <AiOutlineDelete size={24} />
            </button>
            <button className="text-blue-500" onClick={() => setShowUpdateModal(true)}>
              <AiOutlineEdit size={24} />
            </button>
            <button className="text-green-500" onClick={() => setShowAddMemberModal(true)}>
              <AiOutlineUserAdd size={24} />
            </button>
          </div>
          : ""
        }
      </div>
      <p className="text-lg">Description: {organization.description}</p>
      <h2 className="mt-4 text-xl font-bold">Members</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            {organization.owner === user.id && <th className="py-2 px-4 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {organization.members_display && organization.members_display.map((email, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{email}</td>
              {organization.owner === user.id &&
                <td className="py-2 px-4 border-b">
                  <button className="text-red-500" onClick={() => handleMemberDelete(email)}>
                    <AiOutlineDelete size={20} />
                  </button>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmModal && (
        <ConfirmModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteMember}
          title="Confirm Deletion"
          message={`Are you sure you want to remove ${memberToDelete} from this organization?`}
          submitName="Delete"
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          organization={organization}
          onUpdate={(updatedData) => dispatch(patchOrganization(id, updatedData))}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMembers}
        />
      )}
    </div>
  );
};

export default OrganizationDetail;
