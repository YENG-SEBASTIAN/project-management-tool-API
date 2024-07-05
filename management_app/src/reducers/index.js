
import { combineReducers } from 'redux';
import { authenticationReducer } from './authReducers';

const rootReducer = combineReducers({
  auth: authenticationReducer,
});

export default rootReducer;