import axios from "axios";
import { url } from "./restApis";

export const VERIFY_ESHIPPER_CREDENTIALS = "VERIFY_ESHIPPER_CREDENTIALS";
export const VERIFY_ESHIPPER_CREDENTIALS_SUCCESS =
  "VERIFY_ESHIPPER_CREDENTIALS_SUCCESS";
export const VERIFY_ESHIPPER_CREDENTIALS_FAILURE =
  "VERIFY_ESHIPPER_CREDENTIALS_FAILURE";

const fetchEshipperRequest = () => ({
  type: VERIFY_ESHIPPER_CREDENTIALS,
});

const fetchEshipperSuccess = (token) => ({
  type: VERIFY_ESHIPPER_CREDENTIALS_SUCCESS,
  payload: token,
});

const fetchEshipperFailed = (error) => ({
  type: VERIFY_ESHIPPER_CREDENTIALS_FAILURE,
  payload: error,
});

export const verifyEShipperCredentials = (principal, credential) => {
  return async (dispatch) => {
    dispatch(fetchEshipperRequest());
    try {
      const response = await axios.post(`${url}/summary/verify-eshipper`, {
        url: "https://uu2.eshipper.com/api/v2/authenticate",
        principal,
        credential,
      });

      if (response.data.token) {
        dispatch(fetchEshipperSuccess(response.data.token.token));

        console.log("Credentials verified successfully!");
      }
    } catch (error) {
      dispatch(fetchEshipperFailed(error));
    }
  };
};
