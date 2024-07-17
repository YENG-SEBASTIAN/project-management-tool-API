import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTaskDetails, updateTaskPartial } from '../../../actions/taskActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import Modal from '../../common/Modal';

const TaskDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { task, loading, error } = useSelector(state => state.tasks.taskDetails);

  useEffect(() => {
    dispatch(getTaskDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setCompleted(task.completed);
    }
  }, [task]);

  const handleSubmit = () => {
    dispatch(updateTaskPartial(id, { completed }));
    setIsModalOpen(false);
  };

  const assigneeEmail = task?.milestone_details?.project?.organization_detail?.members_display?.find(
    member => member.id === task.assignee_id
  )?.email;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {error && <Alert message={error} type="error" />}
      {loading ? (
        <Spinner />
      ) : task ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
          <p className="text-gray-700 mb-4">{task.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Milestone</h2>
              <p className="text-gray-700">{task.milestone_details?.name}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Assignee</h2>
              <p className="text-gray-700">{assigneeEmail}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Start Date</h2>
              <p className="text-gray-700">{new Date(task.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Due Date</h2>
              <p className="text-gray-700">{new Date(task.due_date).toLocaleDateString()}</p>
            </div>
          </div>

          {task.file && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Attached File</h2>
              <a
                href={task.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                Download File
              </a>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              className="bg-orange-600 text-white py-2 px-4 rounded"
              onClick={() => window.history.back()}
            >
              Back to Tasks
            </button>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Task not found.</p>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Submit to complete Tasks</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Completed</label>
            <input
              type="checkbox"
              checked={completed}
              onChange={() => setCompleted(!completed)}
              className="mt-1"
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TaskDetail;
