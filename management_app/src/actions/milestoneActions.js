import axios from 'axios';
import { base_url } from '../constants/constant';

// Action Types
export const MILESTONE_LIST_REQUEST = 'MILESTONE_LIST_REQUEST';
export const MILESTONE_LIST_SUCCESS = 'MILESTONE_LIST_SUCCESS';
export const MILESTONE_LIST_FAIL = 'MILESTONE_LIST_FAIL';

export const MILESTONE_CREATE_REQUEST = 'MILESTONE_CREATE_REQUEST';
export const MILESTONE_CREATE_SUCCESS = 'MILESTONE_CREATE_SUCCESS';
export const MILESTONE_CREATE_FAIL = 'MILESTONE_CREATE_FAIL';

export const MILESTONE_UPDATE_REQUEST = 'MILESTONE_UPDATE_REQUEST';
export const MILESTONE_UPDATE_SUCCESS = 'MILESTONE_UPDATE_SUCCESS';
export const MILESTONE_UPDATE_FAIL = 'MILESTONE_UPDATE_FAIL';

export const MILESTONE_DELETE_REQUEST = 'MILESTONE_DELETE_REQUEST';
export const MILESTONE_DELETE_SUCCESS = 'MILESTONE_DELETE_SUCCESS';
export const MILESTONE_DELETE_FAIL = 'MILESTONE_DELETE_FAIL';

export const MILESTONE_PATCH_REQUEST = 'MILESTONE_PATCH_REQUEST';
export const MILESTONE_PATCH_SUCCESS = 'MILESTONE_PATCH_SUCCESS';
export const MILESTONE_PATCH_FAIL = 'MILESTONE_PATCH_FAIL';

export const MILESTONE_DETAILS_REQUEST = 'MILESTONE_DETAILS_REQUEST';
export const MILESTONE_DETAILS_SUCCESS = 'MILESTONE_DETAILS_SUCCESS';
export const MILESTONE_DETAILS_FAIL = 'MILESTONE_DETAILS_FAIL';

export const listMilestones = () => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_LIST_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${base_url}api/milestones/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MILESTONE_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

export const createMilestone = (milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_CREATE_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.post(`${base_url}api/milestones/`, milestone, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MILESTONE_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

export const updateMilestone = (id, milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_UPDATE_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.put(`${base_url}api/milestones/${id}/`, milestone, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MILESTONE_UPDATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

export const patchMilestone = (id, milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_PATCH_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.patch(`${base_url}api/milestones/${id}/`, milestone, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_PATCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MILESTONE_PATCH_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

export const deleteMilestone = (id) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_DELETE_REQUEST });

    const token = localStorage.getItem('token');
    await axios.delete(`${base_url}api/milestones/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: MILESTONE_DELETE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};

export const getMilestoneDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_DETAILS_REQUEST });

    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${base_url}api/milestones/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: MILESTONE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MILESTONE_DETAILS_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
    });
  }
};
