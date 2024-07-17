import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { listTasks, createTask } from '../../../actions/taskActions';
import { listMilestones } from '../../../actions/milestoneActions';
import { getOrganizations } from '../../../actions/organizationActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ItemList from '../../common/ItemList';

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, loading: tasksLoading, error: tasksError } = useSelector(state => state.tasks.taskList);
  const { milestones } = useSelector(state => state.milestones.milestoneList);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskMilestone, setTaskMilestone] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    dispatch(listTasks());
    dispatch(listMilestones());
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleAddNewTask = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const formData = new FormData();
    formData.append('name', taskName);
    formData.append('description', taskDescription);
    formData.append('milestone', taskMilestone);
    formData.append('assignee_email', taskAssignee); // Use 'assignee_email' field
    formData.append('start_date', taskStartDate);
    formData.append('due_date', taskDueDate);
    if (taskFile) {
      formData.append('file', taskFile);
    }

    try {
      await dispatch(createTask(formData));
      setSuccessMessage('Task created successfully.');
      setTaskName('');
      setTaskDescription('');
      setTaskMilestone('');
      setTaskAssignee('');
      setTaskStartDate('');
      setTaskDueDate('');
      setTaskFile(null);
      setIsAddModalOpen(false);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setFormErrors(err.response.data);
      } else {
        setErrorMessage(err.message || 'Failed to create task.');
      }
    }
  };

  const getAssigneeOptions = () => {
    const assigneeEmails = new Set();
    milestones.forEach(milestone => {
      milestone.project.organization_detail.members_display.forEach(email => {
        assigneeEmails.add(email);
      });
    });
    return Array.from(assigneeEmails);
  };

  const handleTaskClick = (id) => {
    navigate(`/dashboard/tasks/${id}`);
  };

  return (
    <div className="p-4">
      {tasksError && <Alert message={tasksError} type="error" />}
      {successMessage && <Alert message={successMessage} type="success" />}
      {errorMessage && <Alert message={errorMessage} type="error" />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          className="bg-orange-600 text-white py-2 px-4 rounded flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Add New Task
        </button>
      </div>

      {tasksLoading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <AiOutlineSearch size={48} className="mb-4" />
          <p className="text-gray-500">No Tasks available.</p>
        </div>
      ) : (
        <ItemList
          items={tasks}
          onItemClick={(id) => handleTaskClick(id)}
          emptyMessage="No Tasks available."
          itemKey="id"
          itemTitle="name"
          itemDescription="description"
        />
      )}

      {/* Add New Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleAddNewTask}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Task Name</label>
                <input
                  type="text"
                  name="taskName"
                  className="w-full px-3 py-2 border rounded"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="taskDescription"
                  className="w-full px-3 py-2 border rounded"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                />
                {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Milestone</label>
                <select
                  name="taskMilestone"
                  className="w-full px-3 py-2 border rounded"
                  value={taskMilestone}
                  onChange={(e) => setTaskMilestone(e.target.value)}
                  required
                >
                  <option value="">Select Milestone</option>
                  {milestones.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                {formErrors.milestone && <p className="text-red-500 text-sm">{formErrors.milestone}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Assignee</label>
                <select
                  name="taskAssignee"
                  className="w-full px-3 py-2 border rounded"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  required
                >
                  <option value="">Select Assignee</option>
                  {getAssigneeOptions().map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
                {formErrors.assignee && <p className="text-red-500 text-sm">{formErrors.assignee}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="taskStartDate"
                  className="w-full px-3 py-2 border rounded"
                  value={taskStartDate}
                  onChange={(e) => setTaskStartDate(e.target.value)}
                  required
                />
                {formErrors.start_date && <p className="text-red-500 text-sm">{formErrors.start_date}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="taskDueDate"
                  className="w-full px-3 py-2 border rounded"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                />
                {formErrors.due_date && <p className="text-red-500 text-sm">{formErrors.due_date}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">File</label>
                <input
                  type="file"
                  name="taskFile"
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => setTaskFile(e.target.files[0])}
                />
                {formErrors.file && <p className="text-red-500 text-sm">{formErrors.file}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white py-2 px-4 rounded mr-2"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-orange-600 text-white py-2 px-4 rounded">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
