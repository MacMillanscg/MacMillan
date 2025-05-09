import {
  VERIFY_ESHIPPER_CREDENTIALS,
  VERIFY_ESHIPPER_CREDENTIALS_SUCCESS,
  VERIFY_ESHIPPER_CREDENTIALS_FAILURE,
} from "../Actions/SummaryActions";

const initialState = {
  token: null,
  loading: false,
  error: null,
};

export const summaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_ESHIPPER_CREDENTIALS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case VERIFY_ESHIPPER_CREDENTIALS_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload,
      };
    case VERIFY_ESHIPPER_CREDENTIALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
