

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMilestones, fetchTaskProgress } from '../../../actions/analysticsActions';
import { Doughnut } from 'react-chartjs-2';

const Progress = () => {
  const dispatch = useDispatch();
  const { milestones, loadingMilestones, errorMilestones } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchMilestones());
  }, [dispatch]);

  if (loadingMilestones) return <p>Loading milestones...</p>;
  if (errorMilestones) return <p>Error: {errorMilestones}</p>;

  return (
    <div>
      <h1>Milestones</h1>
      <ul>
        {milestones.map(milestone => (
          <li key={milestone.id}>
            <Milestone milestone={milestone} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Milestone = ({ milestone }) => {
  const dispatch = useDispatch();
  const { taskProgress, loadingTaskProgress, errorTaskProgress } = useSelector(state => state.analytics);

  const fetchTasks = () => {
    dispatch(fetchTaskProgress(milestone.id));
  };

  const progressData = taskProgress[milestone.id] || { total_tasks: 0, completed_tasks: 0, progress: 0 };

  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [progressData.completed_tasks, progressData.total_tasks - progressData.completed_tasks],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h2>{milestone.name}</h2>
      <button onClick={fetchTasks}>View Tasks and Progress</button>
      {loadingTaskProgress && <p>Loading tasks...</p>}
      {errorTaskProgress && <p>Error: {errorTaskProgress}</p>}
      {!loadingTaskProgress && taskProgress[milestone.id] && (
        <>
          <ul>
            {milestone.tasks.map(task => (
              <li key={task.id}>{task.name}</li>
            ))}
          </ul>
          <div>
            <h3>Progress</h3>
            <p>Total Tasks: {progressData.total_tasks}</p>
            <p>Completed Tasks: {progressData.completed_tasks}</p>
            <p>Progress: {progressData.progress}%</p>
            <Doughnut data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default Progress;
