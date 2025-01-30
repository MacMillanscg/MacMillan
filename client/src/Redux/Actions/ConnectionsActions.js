import axios from "axios";
import { getUser } from "../../storageUtils/storageUtils";
import { url } from "../../api";

export const FETCH_CONNECTIONS_REQUEST = "FETCH_CONNECTIONS_REQUEST";
export const FETCH_CONNECTIONS_SUCCESS = "FETCH_CONNECTIONS_SUCCESS";
export const FETCH_CONNECTIONS_FAILURE = "FETCH_CONNECTIONS_FAILURE";

const fetchConnectionsRequest = () => ({
  type: FETCH_CONNECTIONS_REQUEST,
});

const fetchConnectionsSuccess = (connections) => ({
  type: FETCH_CONNECTIONS_SUCCESS,
  payload: connections,
});

const fetchConnectionsFailure = (error) => ({
  type: FETCH_CONNECTIONS_FAILURE,
  payload: error,
});

export const fetchConnections = () => {
  return async (dispatch) => {
    dispatch(fetchConnectionsRequest());
    let userId = getUser();
    userId = userId._id;
    try {
      const response = await axios.get(`${url}/connections`);
      // const filteredConnections = response.data.filter(
      //   (connection) => connection.userId === userId
      // );
      dispatch(fetchConnectionsSuccess(response.data));
    } catch (error) {
      dispatch(fetchConnectionsFailure("Error fetching connections"));
    }
  };
};
