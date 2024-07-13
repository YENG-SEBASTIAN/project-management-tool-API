import {
  GET_PROJECTS_REQUEST,
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS_FAIL,
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
} from '../actions/projectActions';

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS_REQUEST:
    case ADD_PROJECT_REQUEST:
    case UPDATE_PROJECT_REQUEST:
    case DELETE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: action.payload,
      };
    case ADD_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: [...state.projects, action.payload],
      };
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: state.projects.filter((project) => project.id !== action.payload),
      };
    case GET_PROJECTS_FAIL:
    case ADD_PROJECT_FAIL:
    case UPDATE_PROJECT_FAIL:
    case DELETE_PROJECT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default projectReducer;
