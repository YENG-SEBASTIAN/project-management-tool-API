// src/redux/reducers.js
import {
    FETCH_MILESTONES_REQUEST,
    FETCH_MILESTONES_SUCCESS,
    FETCH_MILESTONES_FAIL,
    FETCH_TASK_PROGRESS_REQUEST,
    FETCH_TASK_PROGRESS_SUCCESS,
    FETCH_TASK_PROGRESS_FAIL
  } from '../actions/analyticsActions';


const initialState = {
  milestones: [],
  taskProgress: {},
  loadingMilestones: false,
  errorMilestones: null,
  loadingTaskProgress: false,
  errorTaskProgress: null,
};

export const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MILESTONES_REQUEST:
      return {
        ...state,
        loadingMilestones: true,
        errorMilestones: null,
      };
    case FETCH_MILESTONES_SUCCESS:
      return {
        ...state,
        loadingMilestones: false,
        milestones: action.payload,
      };
    case FETCH_MILESTONES_FAIL:
      return {
        ...state,
        loadingMilestones: false,
        errorMilestones: action.payload,
      };
    case FETCH_TASK_PROGRESS_REQUEST:
      return {
        ...state,
        loadingTaskProgress: true,
        errorTaskProgress: null,
      };
    case FETCH_TASK_PROGRESS_SUCCESS:
      return {
        ...state,
        loadingTaskProgress: false,
        taskProgress: {
          ...state.taskProgress,
          [action.payload.milestoneId]: action.payload.data,
        },
      };
    case FETCH_TASK_PROGRESS_FAIL:
      return {
        ...state,
        loadingTaskProgress: false,
        errorTaskProgress: action.payload,
      };
    default:
      return state;
  }
};
