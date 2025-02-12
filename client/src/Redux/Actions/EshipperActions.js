import axios from "axios";
import { url } from "../../api";
import { eShipperUrl } from "../../api";

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

export const verifyEShipperCredentials = (
  id,
  principal,
  credential,
  openEShipperPopup
) => {
  return async (dispatch) => {
    dispatch(fetchEshipperRequest());
    try {
      const response = await axios.post(
        `${url}/connections/${id}/verify-eshipper`,
        {
          url:eShipperUrl,
          // url: "https://ww2.eshipper.com/api/v2/authenticate",
          principal,
          credential,
        }
      );

      if (response.data.token) {
        dispatch(fetchEshipperSuccess(response.data.token.token));
        openEShipperPopup();
        console.log("Credentials verified successfully!");
      }
    } catch (error) {
      dispatch(fetchEshipperFailed(error));
    }
  };
};
