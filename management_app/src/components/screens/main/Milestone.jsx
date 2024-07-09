import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMilestones, createMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';

const MilestoneList = ({ history }) => {
  const dispatch = useDispatch();

  const milestoneList = useSelector((state) => state.milestoneList);
  const { loading: milestoneLoading, error: milestoneError, milestones = [] } = milestoneList || {};

  const projectList = useSelector((state) => state.projectList);
  const { loading: projectLoading, error: projectError, projects = [] } = projectList || {};

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');

  useEffect(() => {
    dispatch(listMilestones());
    dispatch(getProjects());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createMilestone({ name, due_date: dueDate, project }));
    setName('');
    setDueDate('');
    setProject('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Milestones</h1>
      {milestoneLoading || projectLoading ? (
        <p>Loading...</p>
      ) : (milestoneError || projectError) ? (
        <p>Error: {milestoneError || projectError}</p>
      ) : (
        <>
          <ul className="mb-4">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="cursor-pointer p-2 bg-gray-100 rounded mb-2"
                onClick={() => history.push(`/dashboard/milestones/${milestone.id}`)}
              >
                {milestone.name}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mb-2">Create Milestone</h2>
          <form onSubmit={submitHandler}>
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
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              Create
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MilestoneList;
