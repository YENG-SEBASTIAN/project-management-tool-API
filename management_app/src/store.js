import { createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk'; // Correct import statement for thunk middleware
import rootReducer from './reducers';

// Initial state (if any)
const initialState = {};

// Middleware setup
const middleware = [thunk];

// Compose with Redux DevTools if available, else just compose
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
