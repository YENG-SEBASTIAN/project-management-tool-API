
import axios from 'axios';
import { base_url } from '../constants/constant';
// types.js
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const LOAD_USER = 'LOAD_USER';

// Action creator to load user data into Redux store
export const loadUser = (userData) => ({
  type: LOAD_USER,
  payload: userData
});

// Register User
export const register = ({ email, username, password }) => async dispatch => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const res = await axios.post(`${base_url}accounts/register/`, { email, username, password });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    return res.data; // Return user data on successful registration
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.detail || 'Registration failed'
    });
    throw err; // Throw the error to be caught in the component
  }
};

// Login User
export const login = ({ email, password }) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const res = await axios.post(`${base_url}accounts/login/`, { email, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data  // Backend sends back user data and token
    });

    // Save token to localStorage
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    // Dispatch action to load user data into Redux store
    dispatch(loadUser(res.data.user));


    return res.data;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.detail  // Backend sends error message
    });
    throw err; // Throw the error to be caught in the component
  }
};

// Logout User
export const logout = () => {
  localStorage.removeItem('token');
  return { type: LOGOUT };
};
