import axios from 'axios';
import { base_url } from '../constants/constant';

// Action Types
export const GET_ORGANIZATIONS_REQUEST = 'GET_ORGANIZATIONS_REQUEST';
export const GET_ORGANIZATIONS_SUCCESS = 'GET_ORGANIZATIONS_SUCCESS';
export const GET_ORGANIZATIONS_FAIL = 'GET_ORGANIZATIONS_FAIL';

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
export const addOrganization = ({ name, description, owner, members_emails }) => async dispatch => {
  dispatch({ type: ADD_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${base_url}api/organizations/`,
      { name, description, owner, members_emails },
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
export const updateOrganization = (id, { name, description, members_emails }) => async dispatch => {
  dispatch({ type: UPDATE_ORGANIZATION_REQUEST });

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(
      `${base_url}api/organizations/${id}/`,
      { name, description, members_emails },
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
    dispatch({
      type: UPDATE_ORGANIZATION_FAIL,
      payload: err.response ? err.response.data.detail : 'Network Error'
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
