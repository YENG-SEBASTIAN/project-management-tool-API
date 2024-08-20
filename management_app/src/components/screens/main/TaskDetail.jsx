import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTaskDetails, updateTaskPartial, updateTask, deleteTask } from '../../../actions/taskActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import Modal from '../../common/Modal';

const TaskDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [completed, setCompleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { task, loading, error } = useSelector(state => state.tasks.taskDetails);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(getTaskDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setCompleted(task.completed);
      setTaskDetails(task);
    }
  }, [task]);

  const handleUpdate = () => {
    dispatch(updateTask(id, taskDetails));
    setIsEditModalOpen(false);
  };

  const handleComplete = () => {
    dispatch(updateTaskPartial(id, { completed }))
      .then(() => {
        setSuccessMessage('Task marked as completed successfully!');
        setIsCompleteModalOpen(false);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setSuccessMessage('Failed to mark the task as completed.');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      });
  };

  const handleDelete = () => {
    dispatch(deleteTask(id));
    setIsDeleteModalOpen(false);
    window.history.back();
  };

  // Safely access nested properties
  const assigneeEmail = task?.milestone_details?.name || '';
  const projectOwner = task?.milestone_details?.project?.organization_detail?.owner || '';

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {error && <Alert message={error} type="error" />}
      {successMessage && <Alert message={successMessage} type="success" />}
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
                View File
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
            {task.assignee === user.id && !completed && (
              <button
                className="bg-green-600 text-white py-2 px-4 rounded"
                onClick={() => setIsCompleteModalOpen(true)}
              >
                Mark as Completed
              </button>
            )}
            {task.completed && (
              <p className="text-green-600 font-bold">This task has been completed successfully.</p>
            )}
            {!task.completed && projectOwner === user.id && (
              <>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Task
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Task
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Task not found.</p>
        </div>
      )}

      {isCompleteModalOpen && (
        <Modal onClose={() => setIsCompleteModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Submit to complete Task</h2>
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
              onClick={handleComplete}
            >
              Submit
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded"
              onClick={() => setIsCompleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={taskDetails.name}
              onChange={(e) => setTaskDetails({ ...taskDetails, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={taskDetails.description}
              onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this task?</p>
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-red-600 text-white py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded"
              onClick={() => setIsDeleteModalOpen(false)}
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
