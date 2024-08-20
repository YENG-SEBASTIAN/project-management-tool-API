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
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-4">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <div className="space-y-4 mb-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="font-bold">{task.name}</p>
                <p>Assignee: {task.assignee}</p>
                <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-2">Progress</h3>
          <div className="text-gray-700 space-y-1">
            <p>Total Tasks: {progressData.total_tasks}</p>
            <p>Completed Tasks: {progressData.completed_tasks}</p>
            <p>Progress: {progressData.progress}%</p>
          </div>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 md:pl-4 flex justify-center items-center">
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressDetail;
