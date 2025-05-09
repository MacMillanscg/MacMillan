import {
  FETCH_CONNECTIONS_FAILURE,
  FETCH_CONNECTIONS_REQUEST,
  FETCH_CONNECTIONS_SUCCESS,
} from "../Actions/ConnectionsActions";

const initialState = {
  connections: [],
  loading: false,
  error: null,
};

export const connectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONNECTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CONNECTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        connections: action.payload,
      };
    case FETCH_CONNECTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
