import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchTaskProgress } from '../../../actions/analyticsActions';
import { useParams } from 'react-router-dom';

// Register the components
Chart.register(ArcElement, Tooltip, Legend);

const MilestoneProgressDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { taskProgress, loadingTaskProgress, errorTaskProgress } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchTaskProgress(id));
  }, [dispatch, id]);

  const progressData = taskProgress[id] || { total_tasks: 0, completed_tasks: 0, progress: 0 };
  const tasks = taskProgress[id]?.tasks || [];

  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [progressData.completed_tasks, progressData.total_tasks - progressData.completed_tasks],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  if (loadingTaskProgress) return <p className="text-center text-gray-500">Loading tasks...</p>;
  if (errorTaskProgress) return <p className="text-center text-red-500">Error: {errorTaskProgress}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Progress Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-bold">{task.name}</p>
              <p>Assignee: {task.assignee}</p>
              <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Progress</h3>
          <p className="text-gray-700">Total Tasks: {progressData.total_tasks}</p>
          <p className="text-gray-700">Completed Tasks: {progressData.completed_tasks}</p>
          <p className="text-gray-700">Progress: {progressData.progress}%</p>
          <div className="mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressDetail;
