// Action Types
export const SET_SELECTED_CLIENT = "SET_SELECTED_CLIENT";
export const SET_SELECTED_CLIENT_INTEGRATIONS =
  "SET_SELECTED_CLIENT_INTEGRATIONS";

// Action Creators
export const setSelectedClient = (client) => ({
  type: SET_SELECTED_CLIENT,
  payload: client,
});

export const setSelectedClientIntegrations = (integrations) => ({
  type: SET_SELECTED_CLIENT_INTEGRATIONS,
  payload: integrations,
});
