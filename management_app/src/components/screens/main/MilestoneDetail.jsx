import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMilestoneDetails, deleteMilestone, updateMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ConfirmModal from '../../common/ConfirmModal';
import Modal from '../../common/Modal';

const MilestoneDetail = () => {
  const { id: milestoneId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');

  const milestoneDetails = useSelector((state) => state.milestoneDetails);
  const { loading, error, milestone } = milestoneDetails || {};

  const projectList = useSelector((state) => state.projects);
  const { projects } = projectList || {};

  useEffect(() => {
    dispatch(getMilestoneDetails(milestoneId));
    dispatch(getProjects());
  }, [dispatch, milestoneId]);

  useEffect(() => {
    if (milestone) {
      setCurrentMilestone(milestone);
      setName(milestone.name);
      setDueDate(milestone.due_date);
      setProject(milestone.project);
    }
  }, [milestone]);

  const handleDelete = async () => {
    await dispatch(deleteMilestone(milestoneId));
    navigate('/dashboard/milestones');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateMilestone(milestoneId, { name, due_date: dueDate, project }));
    setShowUpdateModal(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!currentMilestone) {
    return <Alert message="Milestone not found" type="error" />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Milestone: {currentMilestone.name}</h1>
        <div className="flex space-x-2">
          <button
            className="text-red-500"
            onClick={() => setShowConfirmModal(true)}
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
      <p className="text-lg">Due Date: {currentMilestone.due_date}</p>
      <p className="text-lg">Project: {currentMilestone.project_name}</p>

      {showConfirmModal && (
        <ConfirmModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this milestone?"
          submitName="Delete"
        />
      )}

      {showUpdateModal && (
        <Modal onClose={() => setShowUpdateModal(false)}>
          <h2 className="text-2xl font-bold mb-4">Update Milestone</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-2">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Project</option>
                {projects && projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MilestoneDetail;
