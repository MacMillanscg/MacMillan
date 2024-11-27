import axios from "axios";
import { url } from "./restApis";

export const FETCH_CLIENTS_REQUEST = "FETCH_CLIENTS_REQUEST";
export const FETCH_CLIENTS_SUCCESS = "FETCH_CLIENTS_SUCCESS";
export const FETCH_CLIENTS_FAILURE = "FETCH_CLIENTS_FAILURE";

const fetchClientsRequest = () => ({
  type: FETCH_CLIENTS_REQUEST,
});

const fetchClientsSuccess = (clients) => ({
  type: FETCH_CLIENTS_SUCCESS,
  payload: clients,
});

const fetchClientsFailure = (error) => ({
  type: FETCH_CLIENTS_FAILURE,
  payload: error,
});

export const fetchClients = () => {
  return async (dispatch) => {
    dispatch(fetchClientsRequest());
    try {
      const response = await axios.get(`${url}/clients`);
      dispatch(fetchClientsSuccess(response.data));
    } catch (error) {
      dispatch(fetchClientsFailure("Error fetching clients"));
    }
  };
};
