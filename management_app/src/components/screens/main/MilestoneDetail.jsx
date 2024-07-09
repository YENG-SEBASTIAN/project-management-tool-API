import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMilestoneDetails, updateMilestone, patchMilestone, deleteMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';

const MilestoneDetail = ({ match, history }) => {
  const milestoneId = match.params.id;
  const dispatch = useDispatch();

  const milestoneDetails = useSelector((state) => state.milestoneDetails);
  const { loading, error, milestone } = milestoneDetails;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');

  useEffect(() => {
    dispatch(getMilestoneDetails(milestoneId));
    dispatch(getProjects());
  }, [dispatch, milestoneId]);

  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setDueDate(milestone.due_date);
      setProject(milestone.project);
    }
  }, [milestone]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateMilestone(milestoneId, { name, due_date: dueDate, project }));
    history.push('/dashboard/milestones');
  };

  const patchHandler = (e) => {
    e.preventDefault();
    dispatch(patchMilestone(milestoneId, { name, due_date: dueDate, project }));
    history.push('/dashboard/milestones');
  };

  const deleteHandler = () => {
    dispatch(deleteMilestone(milestoneId));
    history.push('/dashboard/milestones');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Milestone Detail</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
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
              Update
            </button>
            <button
              type="button"
              className="p-2 bg-yellow-500 text-white rounded ml-2"
              onClick={patchHandler}
            >
              Patch
            </button>
            <button
              type="button"
              className="p-2 bg-red-500 text-white rounded ml-2"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MilestoneDetail;
