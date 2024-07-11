import {
  GET_ORGANIZATIONS_REQUEST,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS_FAIL,
  GET_ORGANIZATION_REQUEST,
  GET_ORGANIZATION_SUCCESS,
  GET_ORGANIZATION_FAIL,
  ADD_ORGANIZATION_REQUEST,
  ADD_ORGANIZATION_SUCCESS,
  ADD_ORGANIZATION_FAIL,
  UPDATE_ORGANIZATION_REQUEST,
  UPDATE_ORGANIZATION_SUCCESS,
  UPDATE_ORGANIZATION_FAIL,
  DELETE_ORGANIZATION_REQUEST,
  DELETE_ORGANIZATION_SUCCESS,
  DELETE_ORGANIZATION_FAIL
} from '../actions/organizationActions';

const initialState = {
  organizations: [],
  organization: null,
  loading: false,
  error: null
};

const organizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANIZATIONS_REQUEST:
    case GET_ORGANIZATION_REQUEST:
    case ADD_ORGANIZATION_REQUEST:
    case UPDATE_ORGANIZATION_REQUEST:
    case DELETE_ORGANIZATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_ORGANIZATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        organizations: action.payload
      };
    case GET_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        organization: action.payload
      };
    case ADD_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        organizations: [...state.organizations, action.payload]
      };
    case UPDATE_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        organizations: state.organizations.map(org =>
          org.id === action.payload.id ? action.payload : org
        )
      };
    case DELETE_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        organizations: state.organizations.filter(org => org.id !== action.payload)
      };
    case GET_ORGANIZATIONS_FAIL:
    case GET_ORGANIZATION_FAIL:
    case ADD_ORGANIZATION_FAIL:
    case UPDATE_ORGANIZATION_FAIL:
    case DELETE_ORGANIZATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default organizationReducer;
