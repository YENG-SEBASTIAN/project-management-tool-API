import axios from 'axios';
import { base_url } from '../constants/constant';

// Action Types
export const GET_ORGANIZATIONS_REQUEST = 'GET_ORGANIZATIONS_REQUEST';
export const GET_ORGANIZATIONS_SUCCESS = 'GET_ORGANIZATIONS_SUCCESS';
export const GET_ORGANIZATIONS_FAIL = 'GET_ORGANIZATIONS_FAIL';

export const GET_ORGANIZATION_REQUEST = 'GET_ORGANIZATION_REQUEST';
export const GET_ORGANIZATION_SUCCESS = 'GET_ORGANIZATION_SUCCESS';
export const GET_ORGANIZATION_FAIL = 'GET_ORGANIZATION_FAIL';

export const ADD_ORGANIZATION_REQUEST = 'ADD_ORGANIZATION_REQUEST';
export const ADD_ORGANIZATION_SUCCESS = 'ADD_ORGANIZATION_SUCCESS';
export const ADD_ORGANIZATION_FAIL = 'ADD_ORGANIZATION_FAIL';

export const UPDATE_ORGANIZATION_REQUEST = 'UPDATE_ORGANIZATION_REQUEST';
export const UPDATE_ORGANIZATION_SUCCESS = 'UPDATE_ORGANIZATION_SUCCESS';
export const UPDATE_ORGANIZATION_FAIL = 'UPDATE_ORGANIZATION_FAIL';

export const DELETE_ORGANIZATION_REQUEST = 'DELETE_ORGANIZATION_REQUEST';
export const DELETE_ORGANIZATION_SUCCESS = 'DELETE_ORGANIZATION_SUCCESS';
export const DELETE_ORGANIZATION_FAIL = 'DELETE_ORGANIZATION_FAIL';

// Get Organizations
export const getOrganizations = () => async dispatch => {
  dispatch({ type: GET_ORGANIZATIONS_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${base_url}api/organizations/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: GET_ORGANIZATIONS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ORGANIZATIONS_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
  }
};

// Add Organization
export const addOrganization = ({ name, owner, description }) => async dispatch => {
  dispatch({ type: ADD_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${base_url}api/organizations/`,
      { name, owner, description },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: ADD_ORGANIZATION_SUCCESS,
      payload: res.data
    });

    return res.data; // Return the new organization data if needed
  } catch (err) {
    dispatch({
      type: ADD_ORGANIZATION_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Update Organization
export const updateOrganization = (id, { name, description, members }) => async dispatch => {
  dispatch({ type: UPDATE_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(
      `${base_url}api/organizations/${id}/`,
      { name, description, members },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: UPDATE_ORGANIZATION_SUCCESS,
      payload: res.data
    });

    return res.data; // Return the updated organization data if needed
  } catch (err) {
    const errorMessage = err.response ? err.response.data.detail : 'Network Error';
    dispatch({
      type: UPDATE_ORGANIZATION_FAIL,
      payload: errorMessage.includes('does not exist') ? 'One or more email addresses are invalid.' : errorMessage
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Patch Organization (Add Members)
export const patchOrganization = (id, { members }) => async dispatch => {
  dispatch({ type: UPDATE_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.patch(
      `${base_url}api/organizations/${id}/`,
      { members },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch({
      type: UPDATE_ORGANIZATION_SUCCESS,
      payload: res.data
    });

    return res.data; // Return the updated organization data if needed
  } catch (err) {
    const errorMessage = err.response ? err.response.data.detail : 'Network Error';
    dispatch({
      type: UPDATE_ORGANIZATION_FAIL,
      payload: errorMessage.includes('does not exist') ? 'One or more email addresses are invalid.' : errorMessage
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Delete Organization
export const deleteOrganization = id => async dispatch => {
  dispatch({ type: DELETE_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${base_url}api/organizations/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: DELETE_ORGANIZATION_SUCCESS,
      payload: id
    });

    return true; // Return true indicating successful deletion
  } catch (err) {
    dispatch({
      type: DELETE_ORGANIZATION_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
    throw err; // Rethrow the error to propagate it further if needed
  }
};

// Get Organization by ID
export const getOrganizationById = id => async dispatch => {
  dispatch({ type: GET_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${base_url}api/organizations/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: GET_ORGANIZATION_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ORGANIZATION_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
    });
  }
};
