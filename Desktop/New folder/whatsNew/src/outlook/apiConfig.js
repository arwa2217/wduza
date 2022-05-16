// First we need to import axios.js
import axios from "axios";
import { loginRequest } from "./config";
import msalInstance from "./instance";
// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: `https://graph.microsoft.com/v1.0`,
});
// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common["Authorization"] = "";

// Also add/ configure interceptors && all the other cool stuff
const refreshAccessToken = async () => {
  const account = msalInstance.getActiveAccount();
  const history = localStorage.getItem("historyTab")
    ? JSON.parse(localStorage.getItem("historyTab"))
    : "";
  try {
    const localStorageToken = localStorage.getItem("msalToken")
      ? localStorage.getItem("msalToken")
      : "";
    if (localStorageToken === "") {
      const token = await msalInstance.acquireTokenSilent({
        account,
        ...loginRequest,
      });
      localStorage.setItem("msalToken", token.accessToken);
      return token.accessToken;
    }
    return localStorageToken;
  } catch (error) {
    if (history.currentChannel === "Email") {
      await msalInstance.loginRedirect(loginRequest);
    }
  }
};
instance.interceptors.request.use(
  async function (config) {
    const token = await refreshAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 429) {
      return msalInstance
        .acquireTokenSilent(loginRequest)
        .then((resp) => {
          error.config.headers["Authorization"] = "Bearer " + resp.accessToken;
          localStorage.setItem("msalToken", resp.accessToken);
          return instance.request(error.config);
        })
        .catch(async (err) => {
          if (
            err?.errorCode === "interaction_required" ||
            err?.errorCode === "monitor_window_timeout" ||
            err?.errorCode === "login_required"
          ) {
            await msalInstance.loginRedirect(loginRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default instance;
