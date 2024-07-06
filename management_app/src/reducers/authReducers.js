// authReducers.js
import { combineReducers } from 'redux';
import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
  } from '../actions/authActionTypes';
  
  const initialRegisterState = {
    loading: false,
    error: null
  };
  
  const initialLoginState = {
    loading: false,
    error: null
  };
  
  export const registerReducer = (state = initialRegisterState, action) => {
    const { type, payload } = action;
  
    switch(type) {
      case REGISTER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case REGISTER_SUCCESS:
        return {
          ...state,
          loading: false,
          error: null
        };
      case REGISTER_FAIL:
        return {
          ...state,
          loading: false,
          error: payload
        };
      default:
        return state;
    }
  };
  
  export const loginReducer = (state = initialLoginState, action) => {
    const { type, payload } = action;
  
    switch(type) {
      case LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          error: null
        };
      case LOGIN_FAIL:
        return {
          ...state,
          loading: false,
          error: payload
        };
      case LOGOUT:
        return initialLoginState;  // Reset state on logout
      default:
        return state;
    }
  };
  

  export const authenticationReducer = combineReducers({
    register: registerReducer,
    login: loginReducer
  });
  