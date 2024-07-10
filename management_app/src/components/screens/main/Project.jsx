import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { addProject, getProjects, deleteProject, updateProject } from '../../../actions/projectActions';
import { getOrganizations } from '../../../actions/organizationActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';

const Project = () => {
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
  const { organizations, loading: organizationsLoading, error: organizationsError } = useSelector(state => state.organizations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectOrganization, setProjectOrganization] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')).id);

  const colors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100'
  ];

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleAddNewProject = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addProject({ name: projectName, description: projectDescription, owner: user, organization: projectOrganization }));
      setSuccessMessage('Project added successfully.');
      setProjectName('');
      setProjectDescription('');
      setProjectOrganization('');
      setIsAddModalOpen(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add project');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProject(selectedProject.id, { name: projectName, description: projectDescription, owner: selectedProject.owner, organization: projectOrganization }));
      setSuccessMessage('Project updated successfully.');
      setProjectName('');
      setProjectDescription('');
      setProjectOrganization('');
      setIsUpdateModalOpen(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await dispatch(deleteProject(selectedProject.id));
      setSuccessMessage('Project deleted successfully.');
      setIsDeleteModalOpen(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to delete project');
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectOrganization(project.organization); // Assuming `project.organization` is the organization object
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="p-4">
      {projectsError && <Alert message={projectsError} type="error" />}
      {organizationsError && <Alert message={organizationsError} type="error" />}
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

      {projectsLoading || organizationsLoading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <AiOutlineSearch size={48} className="mb-4" />
          <p className="text-gray-500">No Projects available.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`p-4 rounded shadow cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => handleCardClick(project)}
            >
              <h2 className="text-xl font-bold">{project.name}</h2>
              {project.owner === user && (
                <div className="flex justify-between mt-2">
                  <button
                    className="py-1 px-3 bg-blue-600 text-white rounded flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdateModal(project);
                    }}
                  >
                    <FiEdit className="mr-1" /> Update
                  </button>
                  <button
                    className="py-1 px-3 bg-red-600 text-white rounded flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FiTrash />
                  </button>
                </div>
              )}
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
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="projectDescription"
                  className="w-full px-3 py-2 border rounded"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Organization</label>
                <select
                  name="projectOrganization"
                  className="w-full px-3 py-2 border rounded"
                  value={projectOrganization}
                  onChange={(e) => setProjectOrganization(e.target.value)}
                  required
                >
                  <option value="">Select an Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
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

      {/* Update Project Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  className="w-full px-3 py-2 border rounded"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="projectDescription"
                  className="w-full px-3 py-2 border rounded"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Organization</label>
                <select
                  name="projectOrganization"
                  className="w-full px-3 py-2 border rounded"
                  value={projectOrganization}
                  onChange={(e) => setProjectOrganization(e.target.value)}
                  required
                >
                  <option value="">Select an Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 py-2 px-4 bg-gray-300 rounded"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-orange-600 text-white rounded">
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedProject.name}</h2>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Organization:</strong> {selectedProject.organization.name}</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="py-2 px-4 bg-gray-300 rounded"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Project</h2>
            <p>Are you sure you want to delete this project?</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="mr-4 py-2 px-4 bg-gray-300 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-red-600 text-white rounded"
                onClick={handleDeleteProject}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
