import axios from 'axios';
import { base_url } from '../constants/constant';


export const FETCH_MILESTONES_REQUEST = 'FETCH_MILESTONES_REQUEST';
export const FETCH_MILESTONES_SUCCESS = 'FETCH_MILESTONES_SUCCESS';
export const FETCH_MILESTONES_FAIL = 'FETCH_MILESTONES_FAIL';
export const FETCH_TASK_PROGRESS_REQUEST = 'FETCH_TASK_PROGRESS_REQUEST';
export const FETCH_TASK_PROGRESS_SUCCESS = 'FETCH_TASK_PROGRESS_SUCCESS';
export const FETCH_TASK_PROGRESS_FAIL = 'FETCH_TASK_PROGRESS_FAIL';


// Action to fetch milestones
export const fetchMilestones = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MILESTONES_REQUEST });

    const token = localStorage.getItem('token');
    const response = await axios.get(`${base_url}api/analystics/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    dispatch({
      type: FETCH_MILESTONES_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_MILESTONES_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

// Action to fetch task progress for a specific milestone
export const fetchTaskProgress = (milestoneId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TASK_PROGRESS_REQUEST });

    const token = localStorage.getItem('token');
    const response = await axios.get(`${base_url}api/analystics/${milestoneId}/progress/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    dispatch({
      type: FETCH_TASK_PROGRESS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASK_PROGRESS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

