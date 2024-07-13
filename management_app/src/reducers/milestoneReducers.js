import { combineReducers } from 'redux';

import {
  MILESTONE_LIST_REQUEST,
  MILESTONE_LIST_SUCCESS,
  MILESTONE_LIST_FAIL,
  MILESTONE_CREATE_REQUEST,
  MILESTONE_CREATE_SUCCESS,
  MILESTONE_CREATE_FAIL,
  MILESTONE_UPDATE_REQUEST,
  MILESTONE_UPDATE_SUCCESS,
  MILESTONE_UPDATE_FAIL,
  MILESTONE_DELETE_REQUEST,
  MILESTONE_DELETE_SUCCESS,
  MILESTONE_DELETE_FAIL,
  MILESTONE_DETAILS_REQUEST,
  MILESTONE_DETAILS_SUCCESS,
  MILESTONE_DETAILS_FAIL,
} from '../actions/milestoneActions';

export const milestoneListReducer = (state = { milestones: [], loading: false, error: null }, action) => {
  switch (action.type) {
    case MILESTONE_LIST_REQUEST:
      return { ...state, loading: true, milestones: [], error: null };
    case MILESTONE_LIST_SUCCESS:
      return { ...state, loading: false, milestones: action.payload, error: null };
    case MILESTONE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const milestoneCreateReducer = (state = { loading: false, success: false, milestone: null, error: null }, action) => {
  switch (action.type) {
    case MILESTONE_CREATE_REQUEST:
      return { ...state, loading: true, success: false, milestone: null, error: null };
    case MILESTONE_CREATE_SUCCESS:
      return { ...state, loading: false, success: true, milestone: action.payload, error: null };
    case MILESTONE_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const milestoneUpdateReducer = (state = { loading: false, success: false, milestone: null, error: null }, action) => {
  switch (action.type) {
    case MILESTONE_UPDATE_REQUEST:
      return { ...state, loading: true, success: false, milestone: null, error: null };
    case MILESTONE_UPDATE_SUCCESS:
      return { ...state, loading: false, success: true, milestone: action.payload, error: null };
    case MILESTONE_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const milestoneDeleteReducer = (state = { loading: false, success: false, error: null }, action) => {
  switch (action.type) {
    case MILESTONE_DELETE_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case MILESTONE_DELETE_SUCCESS:
      return { ...state, loading: false, success: true, error: null };
    case MILESTONE_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const milestoneDetailsReducer = (state = { loading: false, milestone: null, error: null }, action) => {
  switch (action.type) {
    case MILESTONE_DETAILS_REQUEST:
      return { ...state, loading: true, milestone: null, error: null };
    case MILESTONE_DETAILS_SUCCESS:
      return { ...state, loading: false, milestone: action.payload, error: null };
    case MILESTONE_DETAILS_FAIL:
      return { ...state, loading: false, milestone: null, error: action.payload };
    default:
      return state;
  }
};

const milestonesReducer = combineReducers({
  milestoneList: milestoneListReducer,
  milestoneCreate: milestoneCreateReducer,
  milestoneUpdate: milestoneUpdateReducer,
  milestoneDelete: milestoneDeleteReducer,
  milestoneDetails: milestoneDetailsReducer,
});

export default milestonesReducer;
