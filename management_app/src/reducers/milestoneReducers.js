import axios from 'axios';
import { base_url } from '../constants/constant';
import {
  MILESTONE_LIST_REQUEST,
  MILESTONE_LIST_SUCCESS,
  MILESTONE_LIST_FAIL,
  MILESTONE_CREATE_REQUEST,
  MILESTONE_CREATE_SUCCESS,
  MILESTONE_CREATE_FAIL,
  MILESTONE_UPDATE_REQUEST,
  MILESTONE_UPDATE_SUCCESS,
  MILESTONE_UPDATE_FAIL,
  MILESTONE_DELETE_REQUEST,
  MILESTONE_DELETE_SUCCESS,
  MILESTONE_DELETE_FAIL,
  MILESTONE_PATCH_REQUEST,
  MILESTONE_PATCH_SUCCESS,
  MILESTONE_PATCH_FAIL,
} from '../actions/milestoneReducers';

export const listMilestones = () => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_LIST_REQUEST });
    const { data } = await axios.get(`${base_url}/milestones/`);
    dispatch({ type: MILESTONE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MILESTONE_LIST_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message });
  }
};

export const createMilestone = (milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_CREATE_REQUEST });
    const { data } = await axios.post(`${base_url}/milestones/`, milestone);
    dispatch({ type: MILESTONE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MILESTONE_CREATE_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message });
  }
};

export const updateMilestone = (id, milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_UPDATE_REQUEST });
    const { data } = await axios.put(`${base_url}/milestones/${id}/`, milestone);
    dispatch({ type: MILESTONE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MILESTONE_UPDATE_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message });
  }
};

export const deleteMilestone = (id) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_DELETE_REQUEST });
    await axios.delete(`${base_url}/milestones/${id}/`);
    dispatch({ type: MILESTONE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: MILESTONE_DELETE_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message });
  }
};

export const patchMilestone = (id, milestone) => async (dispatch) => {
  try {
    dispatch({ type: MILESTONE_PATCH_REQUEST });
    const { data } = await axios.patch(`${base_url}/milestones/${id}/`, milestone);
    dispatch({ type: MILESTONE_PATCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MILESTONE_PATCH_FAIL, payload: error.response && error.response.data.detail ? error.response.data.detail : error.message });
  }
};
