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
} from './types';

// Register User
export const register = ({ email, password }) => async dispatch => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const res = await axios.post(`${base_url}/accounts/register/`, { email, password });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data  // backend sends back user data and token
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.message  // backend sends error message
    });
  }
};

// Login User
export const login = ({ email, password }) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const res = await axios.post(`${base_url}/accounts/login/`, { email, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data  // backend sends back user data and token
    });

    // Save token to localStorage
    localStorage.setItem('token', res.data.access);
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message  // backend sends error message
    });
  }
};

// Logout User
export const logout = () => {
  localStorage.removeItem('token');
  return { type: LOGOUT };
};
