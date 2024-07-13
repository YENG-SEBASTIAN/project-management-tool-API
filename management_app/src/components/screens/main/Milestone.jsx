import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMilestones, createMilestone, updateMilestone, deleteMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import Modal from '../../common/Modal';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import { useNavigate } from 'react-router-dom';

const Milestone = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const milestoneList = useSelector((state) => state.milestones.milestoneList);
  const { loading: milestoneLoading, error: milestoneError, milestones } = milestoneList;

  const projectList = useSelector((state) => state.projects);
  const { loading: projectLoading, error: projectError, projects } = projectList;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(listMilestones());
    dispatch(getProjects());
  }, [dispatch]);

  const openModal = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setDueDate('');
    setProject('');
    setIsModalOpen(true);
    setIsEdit(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMilestone(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await dispatch(updateMilestone(selectedMilestone.id, { name, description, start_date: startDate, due_date: dueDate, project }));
        setSuccessMessage('Milestone updated successfully.');
      } else {
        await dispatch(createMilestone({ name, description, start_date: startDate, due_date: dueDate, project, owner: user.id }));
        setSuccessMessage('Milestone created successfully.');
      }
      dispatch(listMilestones());
      closeModal();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save milestone.');
    }
  };

  const handleDelete = async (milestoneId) => {
    try {
      await dispatch(deleteMilestone(milestoneId));
      setSuccessMessage('Milestone deleted successfully.');
      dispatch(listMilestones());
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete milestone.');
    }
  };

  const handleOpenDetails = (milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const openEditForm = () => {
    if (selectedMilestone) {
      setName(selectedMilestone.name);
      setDescription(selectedMilestone.description);
      setStartDate(selectedMilestone.start_date);
      setDueDate(selectedMilestone.due_date);
      setProject(selectedMilestone.project.id);
      setIsEdit(true);
    }
  };

  return (
    <div className="p-4">
      {milestoneLoading || projectLoading ? (
        <Spinner />
      ) : milestoneError || projectError ? (
        <Alert message={milestoneError || projectError} type="error" />
      ) : (
        <>
          {successMessage && <Alert message={successMessage} type="success" />}
          {errorMessage && <Alert message={errorMessage} type="error" />}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Milestones</h1>
            <button
              className="bg-orange-600 text-white py-2 px-4 rounded flex items-center"
              onClick={openModal}
            >
              <FiPlus className="mr-2" /> Create
            </button>
          </div>
          {milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AiOutlineSearch size={48} className="mb-4" />
              <p className="text-gray-500">No milestones available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="cursor-pointer p-4 bg-white rounded shadow-md"
                  onClick={() => handleOpenDetails(milestone)}
                >
                  <h2 className="text-xl font-bold">{milestone.name}</h2>
                  <p className="text-gray-500">Start Date: {milestone.start_date}</p>
                  <p className="text-gray-500">Due Date: {milestone.due_date}</p>
                </div>
              ))}
            </div>
          )}
          {isModalOpen && (
            <Modal onClose={closeModal}>
              <div className="p-6">
                {selectedMilestone ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Milestone Details</h2>
                    <p><strong>Name:</strong> {selectedMilestone.name}</p>
                    <p><strong>Description:</strong> {selectedMilestone.description}</p>
                    <p><strong>Start Date:</strong> {selectedMilestone.start_date}</p>
                    <p><strong>Due Date:</strong> {selectedMilestone.due_date}</p>
                    <p><strong>Project:</strong> {selectedMilestone.project.name}</p>
                    <div className="flex mt-4">
                      {selectedMilestone.project.owner === user.id ? (
                        <>
                          <button
                            className="py-2 px-4 bg-blue-600 text-white rounded mr-4"
                            onClick={openEditForm}
                          >
                            <FiEdit className="mr-2" /> Update
                          </button>
                          <button
                            className="py-2 px-4 bg-red-600 text-white rounded"
                            onClick={() => handleDelete(selectedMilestone.id)}
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </>
                      ) : null}
                      <button
                        className="py-2 px-4 bg-gray-300 text-white rounded ml-auto"
                        onClick={closeModal}
                      >
                        <FiX className="mr-2" /> Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">Create Milestone</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-2">
                        <label className="block text-gray-700">Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">Due Date</label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700">Project</label>
                        <select
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                          required
                        >
                          <option value="">Select Project</option>
                          {projects.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                              {proj.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 bg-orange-600 text-white rounded"
                      >
                        {isEdit ? 'Update' : 'Create'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Milestone;
