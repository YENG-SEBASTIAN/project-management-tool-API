// index.js

import { combineReducers } from 'redux';
import { authenticationReducer } from './authReducers';
import projectReducer from './projectReducers';

const rootReducer = combineReducers({
  auth: authenticationReducer,
  projects: projectReducer
});

export default rootReducer;
