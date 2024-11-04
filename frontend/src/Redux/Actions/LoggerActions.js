import axios from "axios";
import { url } from "./restApis";

export const FETCH_LOGS_REQUEST = "FETCH_LOGS_REQUEST";
export const FETCH_LOGS_SUCCESS = "FETCH_LOGS_SUCCESS";
export const FETCH_LOGS_FAILURE = "FETCH_LOGS_FAILURE";
export const FETCH_LOGS_START = "FETCH_LOGS_START";

const fetchLogsRequest = () => ({
  type: FETCH_LOGS_REQUEST,
});

const fetchLogsSuccess = (logs) => ({
  type: FETCH_LOGS_SUCCESS,
  payload: logs,
});

const fetchLogsFailure = (error) => ({
  type: FETCH_LOGS_FAILURE,
  payload: error,
});

export const fetchLogs = () => {
  return async (dispatch) => {
    dispatch(fetchLogsRequest());
    try {
      const response = await axios.get(`${url}`);
      console.log("all response", response.data);
      dispatch(fetchLogsSuccess(response.data));
    } catch (error) {
      dispatch(fetchLogsFailure("Error fetching logs"));
    }
  };
};
