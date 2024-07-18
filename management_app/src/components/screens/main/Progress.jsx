// components/Progress.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMilestones } from '../../../actions/analyticsActions';

const Progress = () => {
  const dispatch = useDispatch();
  const { milestones, loadingMilestones, errorMilestones } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchMilestones());
  }, [dispatch]);

  if (loadingMilestones) return <p className="text-center text-gray-500">Loading milestones...</p>;
  if (errorMilestones) return <p className="text-center text-red-500">Error: {errorMilestones}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Milestones & Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.map(milestone => (
          <div key={milestone.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{milestone.name}</h2>
            <Link to={`/dashboard/milestonesprogress/${milestone.id}`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4">
                View Tasks and Progress
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
