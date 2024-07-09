import axios from 'axios';
import { base_url } from '../constants/constant';

// Action Types
export const GET_PROJECTS_REQUEST = 'GET_PROJECTS_REQUEST';
export const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';
export const GET_PROJECTS_FAIL = 'GET_PROJECTS_FAIL';

export const ADD_PROJECT_REQUEST = 'ADD_PROJECT_REQUEST';
export const ADD_PROJECT_SUCCESS = 'ADD_PROJECT_SUCCESS';
export const ADD_PROJECT_FAIL = 'ADD_PROJECT_FAIL';

export const UPDATE_PROJECT_REQUEST = 'UPDATE_PROJECT_REQUEST';
export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const UPDATE_PROJECT_FAIL = 'UPDATE_PROJECT_FAIL';

export const DELETE_PROJECT_REQUEST = 'DELETE_PROJECT_REQUEST';
export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export const DELETE_PROJECT_FAIL = 'DELETE_PROJECT_FAIL';

// Get Projects
export const getProjects = () => async dispatch => {
  dispatch({ type: GET_PROJECTS_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${base_url}api/projects/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: GET_PROJECTS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROJECTS_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
  }
};

// Add Project
export const addProject = ({ name, description, owner, organization }) => async dispatch => {
  dispatch({ type: ADD_PROJECT_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${base_url}api/projects/`,
      { name, description, owner, organization },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: ADD_PROJECT_SUCCESS,
      payload: res.data
    });

    return res.data; // Return the new project data if needed
  } catch (err) {
    dispatch({
      type: ADD_PROJECT_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Update Project
export const updateProject = (id, { name, description, owner, organization }) => async dispatch => {
  dispatch({ type: UPDATE_PROJECT_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(
      `${base_url}api/projects/${id}/`,
      { name, description, owner, organization },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: UPDATE_PROJECT_SUCCESS,
      payload: res.data
    });

    return res.data; // Return the updated project data if needed
  } catch (err) {
    dispatch({
      type: UPDATE_PROJECT_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Delete Project
export const deleteProject = id => async dispatch => {
  dispatch({ type: DELETE_PROJECT_REQUEST });

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${base_url}api/projects/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: DELETE_PROJECT_SUCCESS,
      payload: id
    });

    return true; // Return true indicating successful deletion
  } catch (err) {
    dispatch({
      type: DELETE_PROJECT_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};
