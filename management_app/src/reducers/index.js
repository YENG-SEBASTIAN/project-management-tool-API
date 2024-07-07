// index.js

import { combineReducers } from 'redux';
import { authenticationReducer } from './authReducers';
import projectReducer from './projectReducers';
import organizationReducer from './organizationReducers';

const rootReducer = combineReducers({
  auth: authenticationReducer,
  projects: projectReducer,
  organizations: organizationReducer,
});

export default rootReducer;
