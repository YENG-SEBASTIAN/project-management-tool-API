import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { addProject, getProjects, deleteProject, updateProject } from '../../../actions/projectActions';
import { getOrganizations } from '../../../actions/organizationActions';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import ItemList from '../../common/ItemList';

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

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleAddNewProject = async (e) => {
    e.preventDefault();
    try {
      const newProject = {
        name: projectName,
        description: projectDescription,
        owner: user,
        organization: projectOrganization
      };
      await dispatch(addProject(newProject));
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
      const updatedProject = {
        id: selectedProject.id,
        name: projectName,
        description: projectDescription,
        owner: selectedProject.owner,
        organization: projectOrganization
      };
      await dispatch(updateProject(selectedProject.id, updatedProject));
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

  const handleCardClick = (projectId) => {
    const project = projects.find(proj => proj.id === projectId);
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setProjectName(project.name || ''); // Ensure project.name is defined or set to empty string
    setProjectDescription(project.description || ''); // Ensure project.description is defined or set to empty string
    setProjectOrganization(project.organization?.id || ''); // Ensure project.organization.id is defined or set to empty string
    setIsUpdateModalOpen(true);
  };

  // Filter organizations to only include those created by the user
  const userOrganizations = organizations.filter(org => org.owner === user);

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
        <ItemList
          items={projects}
          onItemClick={handleCardClick}
          emptyMessage="No Projects available."
          itemKey="id"
          itemTitle="name"
          itemDescription="description"
        />
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
                  <option value="">Select Organization</option>
                  {userOrganizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
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
                  <option value="">Select Organization</option>
                  {userOrganizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white py-2 px-4 rounded mr-2"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-orange-600 text-white py-2 px-4 rounded">
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Project Name</label>
              <p className="border p-2 rounded">{selectedProject.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <p className="border p-2 rounded">{selectedProject.description}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Organization</label>
              <p className="border p-2 rounded">{selectedProject.organization}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded mr-2"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-orange-600 text-white py-2 px-4 rounded"
                onClick={() => openUpdateModal(selectedProject)}
              >
                Update
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded ml-2"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Project</h2>
            <p>Are you sure you want to delete the project "{selectedProject.name}"?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded mr-2"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded"
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
