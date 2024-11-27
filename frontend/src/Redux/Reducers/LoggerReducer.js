import {
  FETCH_LOGS_REQUEST,
  FETCH_LOGS_SUCCESS,
  FETCH_LOGS_FAILURE,
} from "../Actions/LoggerActions";

const initialState = {
  logs: [],
  loading: false,
  error: null,
};
console.log("Initestata", initialState);

export const logsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOGS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_LOGS_SUCCESS:
      return {
        ...state,
        logs: action.payload,
        loading: false,
      };

    case FETCH_LOGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
