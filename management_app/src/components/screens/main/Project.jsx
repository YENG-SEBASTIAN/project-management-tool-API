import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { addProject, getProjects, deleteProject } from '../../../actions/projectActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';

const Project = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector(state => state.projects);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const colors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100'
  ];

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleAddNewProject = async (e) => {
    e.preventDefault();
    const projectName = e.target.projectName.value;
    const projectDescription = e.target.projectDescription.value;

    try {
      await dispatch(addProject({ name: projectName, description: projectDescription }));
      setSuccessMessage('Project added successfully.');
      setIsAddModalOpen(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(projectId));
        setSuccessMessage('Project deleted successfully.');
      } catch (err) {
        setErrorMessage(err.message || 'Failed to delete project');
      }
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-4">
      {error && <Alert message={error} type="error" />}
      {successMessage && <Alert message={successMessage} type="success" />}
      {errorMessage && <Alert message={errorMessage} type="error" />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="bg-orange-600 text-white py-2 px-4 rounded flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Add New Project
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`p-4 rounded shadow cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleCardClick(project)}
            >
              <h2 className="text-xl font-bold">{project.name}</h2>
              <button
                className="mt-2 py-1 px-3 bg-red-600 text-white rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
            <form onSubmit={handleAddNewProject}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="projectDescription"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 py-2 px-4 bg-gray-300 rounded"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-orange-600 text-white rounded">
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedProject.name}</h2>
            <p className="mb-4">{selectedProject.description}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="py-2 px-4 bg-orange-600 text-white rounded"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
