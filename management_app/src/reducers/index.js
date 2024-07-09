// index.js

import { combineReducers } from 'redux';
import { authenticationReducer } from './authReducers';
import projectReducer from './projectReducers';
import organizationReducer from './organizationReducers';
import milestonesReducer from './milestoneReducers';

const rootReducer = combineReducers({
  auth: authenticationReducer,
  projects: projectReducer,
  organizations: organizationReducer,
  milestones: milestonesReducer,
});

export default rootReducer;
