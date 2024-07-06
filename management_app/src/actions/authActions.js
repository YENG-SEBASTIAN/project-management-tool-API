// authActions.js

import axios from 'axios';
import { base_url } from '../constants/constant';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../actions/authActionTypes'; // Ensure correct import path for action types

// Register User
export const register = ({ email, password }) => async dispatch => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await axios.post(`${base_url}/accounts/register/`, { email, password });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data  // Backend sends back user data and token
    });
  } catch (error) {
    console.log("Sabs print", error.response.data.detail)
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message  // Backend sends error message
    });
  }
};

// Login User
export const login = ({ email, password }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${base_url}/accounts/login/`, { email, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    });
    return response.data; // return access token
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data,
    });
    throw error;
  }
};

// Logout User
export const logout = () => {
  localStorage.removeItem('token');
  return { type: LOGOUT };
};
