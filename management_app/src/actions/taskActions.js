import axios from 'axios';
import { base_url } from '../constants/constant';

// Action Types
export const TASK_LIST_REQUEST = 'TASK_LIST_REQUEST';
export const TASK_LIST_SUCCESS = 'TASK_LIST_SUCCESS';
export const TASK_LIST_FAIL = 'TASK_LIST_FAIL';

export const TASK_DETAILS_REQUEST = 'TASK_DETAILS_REQUEST';
export const TASK_DETAILS_SUCCESS = 'TASK_DETAILS_SUCCESS';
export const TASK_DETAILS_FAIL = 'TASK_DETAILS_FAIL';

export const TASK_CREATE_REQUEST = 'TASK_CREATE_REQUEST';
export const TASK_CREATE_SUCCESS = 'TASK_CREATE_SUCCESS';
export const TASK_CREATE_FAIL = 'TASK_CREATE_FAIL';

export const TASK_UPDATE_REQUEST = 'TASK_UPDATE_REQUEST';
export const TASK_UPDATE_SUCCESS = 'TASK_UPDATE_SUCCESS';
export const TASK_UPDATE_FAIL = 'TASK_UPDATE_FAIL';

export const TASK_UPDATE_PARTIAL_REQUEST = 'TASK_UPDATE_PARTIAL_REQUEST';
export const TASK_UPDATE_PARTIAL_SUCCESS = 'TASK_UPDATE_PARTIAL_SUCCESS';
export const TASK_UPDATE_PARTIAL_FAIL = 'TASK_UPDATE_PARTIAL_FAIL';

export const TASK_DELETE_REQUEST = 'TASK_DELETE_REQUEST';
export const TASK_DELETE_SUCCESS = 'TASK_DELETE_SUCCESS';
export const TASK_DELETE_FAIL = 'TASK_DELETE_FAIL';

// List Tasks
export const listTasks = () => async (dispatch) => {
  try {
    dispatch({ type: TASK_LIST_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${base_url}api/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

// Get Task by ID
export const getTaskDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DETAILS_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${base_url}api/tasks/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_DETAILS_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

// Create Task
export const createTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_CREATE_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.post(`${base_url}api/tasks/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

// Update Task (PUT)
export const updateTask = (id, taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_UPDATE_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${base_url}api/tasks/${id}/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_UPDATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

// Update Task (PATCH)
export const updateTaskPartial = (id, taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_UPDATE_PARTIAL_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.patch(`${base_url}api/tasks/${id}/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_UPDATE_PARTIAL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TASK_UPDATE_PARTIAL_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

// Delete Task
export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST });

    const token = localStorage.getItem('token');
    await axios.delete(`${base_url}api/tasks/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: TASK_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: TASK_DELETE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};
