// index.js

import { combineReducers } from 'redux';
import { authenticationReducer } from './authReducers';
import projectReducer from './projectReducers';
import organizationReducer from './organizationReducers';
import milestonesReducer from './milestoneReducers';
import tasksReducer from './taskReducers';
import { analyticsReducer } from './analyticsReducers';



const rootReducer = combineReducers({
  auth: authenticationReducer,
  projects: projectReducer,
  organizations: organizationReducer,
  milestones: milestonesReducer,
  tasks: tasksReducer,
  analytics: analyticsReducer,
});

export default rootReducer;
