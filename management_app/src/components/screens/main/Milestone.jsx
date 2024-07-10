import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMilestones, createMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import Modal from '../../common/Modal';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import { useNavigate } from 'react-router-dom';

const MilestoneList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const milestoneList = useSelector((state) => state.milestones.milestoneList);
  const { loading: milestoneLoading, error: milestoneError, milestones } = milestoneList;

  const projectList = useSelector((state) => state.projects);
  const { loading: projectLoading, error: projectError, projects } = projectList;

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')).id);


  useEffect(() => {
    dispatch(listMilestones());
    dispatch(getProjects());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createMilestone({ name, start_date: startDate, due_date: dueDate, project, owner: user }));
      setSuccessMessage('Milestone created successfully.');
      setName('');
      setStartDate('');
      setDueDate('');
      setProject('');
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create milestone.');
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
              onClick={() => setIsModalOpen(true)}
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
                  onClick={() => navigate(`/dashboard/milestone/${milestone.id}`)}
                >
                  <h2 className="text-xl font-bold">{milestone.name}</h2>
                  <p className="text-gray-500">Start Date: {milestone.start_date}</p>
                  <p className="text-gray-500">Due Date: {milestone.due_date}</p>
                </div>
              ))}
            </div>
          )}
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Create Milestone</h2>
                <form onSubmit={submitHandler}>
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
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-4 py-2 px-4 bg-gray-300 rounded"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="py-2 px-4 bg-orange-600 text-white rounded">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default MilestoneList;
