import {
  SET_SELECTED_CLIENT,
  SET_SELECTED_CLIENT_INTEGRATIONS,
} from "../Actions/SelectedIntegrationActions";

const initialState = {
  selectedClient: null,
  selectedClientIntegrations: [],
};

export const selectedIntegrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CLIENT:
      return {
        ...state,
        selectedClient: action.payload,
      };
    case SET_SELECTED_CLIENT_INTEGRATIONS:
      return {
        ...state,
        selectedClientIntegrations: action.payload,
      };
    default:
      return state;
  }
};
