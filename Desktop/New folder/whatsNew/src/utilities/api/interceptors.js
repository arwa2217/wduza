import { API_BASE_URL } from "../../constants";
import { showToast } from "../../store/actions/toast-modal-actions";
import UserActions from "../../store/actions/user-actions";

let dispatch;
const interceptorConfig = {
  headers: (origHeaders, state) => {
    const headers = Object.assign({}, origHeaders);
    // if (state.authorizeRequests) {
    //   headers["Authorization"] = `Bearer ${state.authToken}`;
    // }
    return headers;
  },
  getURL: (apiUrl, state) => {
    return apiUrl.match(/^(http|https)/) ? apiUrl : `${API_BASE_URL}${apiUrl}`;
  },
  onRequestInit: (state) => {
    //dispatch(action)
    // console.log("========onRequestInit====");
  },
  onRequestSuccess: (state, response) => {
    //console.log("=========onRequestSuccess===");
  },
  onRequestError: (state, response) => {
    console.log("=======onRequestError====");
    // logout the user if 401 response
    if (response.status_code === 401) {
      // logout user
      dispatch(UserActions.signout());
    }
    if (response.code === 4034) {
      dispatch(showToast("Cannot convert post to task"));
    }
    if (response.code === 4033) {
      dispatch(showToast("Cannot forward file"));
    }
  },
};

export default interceptorConfig;

const applyDispatch = (storeDispatch) => {
  dispatch = storeDispatch;
};

export { applyDispatch };
