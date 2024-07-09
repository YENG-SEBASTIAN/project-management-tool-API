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
    MILESTONE_PATCH_REQUEST,
    MILESTONE_PATCH_SUCCESS,
    MILESTONE_PATCH_FAIL,
    MILESTONE_DETAILS_REQUEST,
    MILESTONE_DETAILS_SUCCESS,
    MILESTONE_DETAILS_FAIL,
  } from '../actions/milestoneActions';
  
  export const milestoneListReducer = (state = { milestones: [] }, action) => {
    switch (action.type) {
      case MILESTONE_LIST_REQUEST:
        return { loading: true, milestones: [] };
      case MILESTONE_LIST_SUCCESS:
        return { loading: false, milestones: action.payload };
      case MILESTONE_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const milestoneCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case MILESTONE_CREATE_REQUEST:
        return { loading: true };
      case MILESTONE_CREATE_SUCCESS:
        return { loading: false, success: true, milestone: action.payload };
      case MILESTONE_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const milestoneUpdateReducer = (state = { milestone: {} }, action) => {
    switch (action.type) {
      case MILESTONE_UPDATE_REQUEST:
        return { loading: true };
      case MILESTONE_UPDATE_SUCCESS:
        return { loading: false, success: true, milestone: action.payload };
      case MILESTONE_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const milestoneDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case MILESTONE_DELETE_REQUEST:
        return { loading: true };
      case MILESTONE_DELETE_SUCCESS:
        return { loading: false, success: true };
      case MILESTONE_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const milestonePatchReducer = (state = { milestone: {} }, action) => {
    switch (action.type) {
      case MILESTONE_PATCH_REQUEST:
        return { loading: true };
      case MILESTONE_PATCH_SUCCESS:
        return { loading: false, success: true, milestone: action.payload };
      case MILESTONE_PATCH_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const milestoneDetailsReducer = (state = { milestone: {} }, action) => {
    switch (action.type) {
      case MILESTONE_DETAILS_REQUEST:
        return { loading: true };
      case MILESTONE_DETAILS_SUCCESS:
        return { loading: false, milestone: action.payload };
      case MILESTONE_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  



const milestonesReducer = combineReducers({
    milestoneList: milestoneListReducer,
    milestoneCreate: milestoneCreateReducer,
    milestoneUpdate: milestoneUpdateReducer,
    milestoneDelete: milestoneDeleteReducer,
    milestonePatch: milestonePatchReducer,
    milestoneDetail: milestoneDetailsReducer,
});

export default milestonesReducer;