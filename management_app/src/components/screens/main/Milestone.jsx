import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMilestones, createMilestone, updateMilestone, deleteMilestone } from '../../../actions/milestoneActions';
import { getProjects } from '../../../actions/projectActions';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import Spinner from '../../common/Spinner';
import Alert from '../../common/Alert';
import CreateMilestoneModal from '../../common/CreateMilestoneModal';
import UpdateMilestoneModal from '../../common/UpdateMilestoneModal';
import ConfirmModal from '../../common/ConfirmModal';

const Milestone = () => {
  const dispatch = useDispatch();

  const milestoneList = useSelector((state) => state.milestones.milestoneList);
  const { loading: milestoneLoading, error: milestoneError, milestones } = milestoneList;

  const projectList = useSelector((state) => state.projects);
  const { loading: projectLoading, error: projectError, projects } = projectList;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(listMilestones());
    dispatch(getProjects());
  }, [dispatch]);

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setDueDate('');
    setProject('');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openUpdateModal = () => {
    if (selectedMilestone) {
      setName(selectedMilestone.name);
      setDescription(selectedMilestone.description);
      setStartDate(selectedMilestone.start_date);
      setDueDate(selectedMilestone.due_date);
      setProject(selectedMilestone.project.id);
      setIsUpdateModalOpen(true);
    }
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const openConfirmModal = (milestone) => {
    setSelectedMilestone(milestone);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    dispatch(
      createMilestone({
        name,
        description,
        start_date: startDate,
        due_date: dueDate,
        project,
      })
    ).then(() => {
      setSuccessMessage('Milestone created successfully.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      closeCreateModal();
      dispatch(listMilestones());
    }).catch(() => {
      setErrorMessage('Failed to create milestone.');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    });
  };

  const handleUpdateMilestone = (e) => {
    e.preventDefault();
    if (selectedMilestone) {
      dispatch(
        updateMilestone(selectedMilestone.id, {
          name,
          description,
          start_date: startDate,
          due_date: dueDate,
          project,
        })
      ).then(() => {
        setSuccessMessage('Milestone updated successfully.');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        closeUpdateModal();
        dispatch(listMilestones());
      }).catch(() => {
        setErrorMessage('Failed to update milestone.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      });
    }
  };

  const handleDeleteMilestone = () => {
    if (selectedMilestone) {
      dispatch(deleteMilestone(selectedMilestone.id))
        .then(() => {
          setSuccessMessage('Milestone deleted successfully.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
          dispatch(listMilestones());
        })
        .catch(() => {
          setErrorMessage('Failed to delete milestone.');
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
        });
      closeConfirmModal();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4">Milestones</h1>
        <button
          className="flex items-center bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          onClick={openCreateModal}
        >
          <FiPlus className="mr-2" /> Create Milestone
        </button>
      </div>

      {milestoneLoading || projectLoading ? (
        <Spinner />
      ) : milestoneError || projectError ? (
        <Alert message={milestoneError || projectError} type="error" />
      ) : (
        <>
          {successMessage && <Alert message={successMessage} type="success" />}
          {errorMessage && <Alert message={errorMessage} type="error" />}

          <div className="grid bg-white grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-orange-300 p-4 rounded shadow"
                onClick={() => {
                  setSelectedMilestone(milestone);
                  openUpdateModal();
                }}
              >
                <h2 className="text-lg font-bold mb-2">{milestone.name}</h2>
                <p className="text-gray-700 mb-2">{milestone.description}</p>
                <p className="text-gray-600 text-sm mb-2">
                  Start Date: {milestone.start_date}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Due Date: {milestone.due_date}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Project: {milestone.project.name}
                </p>
                {milestone.project.owner === user.id ? (
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMilestone(milestone);
                        openUpdateModal();
                      }}
                    >
                      <FiEdit className="mr-2" />
                    </button>
                    <button
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirmModal(milestone);
                      }}
                    >
                      <FiTrash2 className="mr-2" />
                    </button>
                  </div>
                ): ""
              }
              </div>
            ))}
          </div>

          {isCreateModalOpen && (
            <CreateMilestoneModal
              onClose={closeCreateModal}
              onSubmit={handleCreateMilestone}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              project={project}
              setProject={setProject}
              projects={projects}
            />
          )}

          {/* {isUpdateModalOpen && selectedMilestone && (
            <UpdateMilestoneModal
              onClose={closeUpdateModal}
              onSubmit={handleUpdateMilestone}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              project={project}
              setProject={setProject}
              projects={projects}
            />
          )} */}

          {isConfirmModalOpen && (
            <ConfirmModal
              message={`Are you sure you want to delete this milestone?`}
              onClose={closeConfirmModal}
              onConfirm={handleDeleteMilestone}
              submitName="Delete"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Milestone;
