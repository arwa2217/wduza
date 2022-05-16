import UserConstants from "../../constants/user/user-constants";
import UserService from "../../services/user-service";
import History from "../../utilities/history";
import StatusCode from "../../constants/rest/status-codes";

import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";
import { AuthHeader } from "../../utilities/app-preference";
import { GetChannelListAction } from "./channelActions";
import {
  FETCH_USER_ACTIONS_REQUIRED,
  FETCH_USER_ACTIONS_REQUIRED_SUCCESS,
  FETCH_USER_ACTIONS_REQUIRED_ERROR,
  FETCH_USER_PERSONAL_INFO,
  FETCH_USER_PERSONAL_INFO_SUCCESS,
  FETCH_USER_PERSONAL_INFO_ERROR,
  FETCH_USER_SEARCH_LIST,
  FETCH_USER_SEARCH_LIST_SUCCESS,
  FETCH_USER_SEARCH_LIST_ERROR,
  POST_USER_ACTIONS_REQUIRED,
  POST_USER_ACTIONS_REQUIRED_SUCCESS,
  POST_USER_ACTIONS_REQUIRED_ERROR,
  RESET_SEARCH_LIST,
} from "../actionTypes/user-action-type";
import { MENU_ITEMS } from "../../constants/menu-items";

/*
 *Possible list of User actions and state update to be done for same
 */

function signup(user) {
  return (dispatch) => {
    dispatch(request(user));

    UserService.signup(user).then(
      (user) => {
        dispatch(success());
      },
      (error) => {
        if (error.code === StatusCode.SIGNUP_FAIL_UID) {
          error = {
            ...error,
            signupFailUid: true,
            signupFailEmail: false,
            signupFail: false,
          };
        } else if (error.code === StatusCode.SIGNUP_FAIL_EMAIL) {
          error = {
            ...error,
            signupFailUid: false,
            signupFailEmail: true,
            signupFail: false,
          };
        } else {
          error = {
            ...error,
            signupFailUid: false,
            signupFailEmail: false,
            signupFail: true,
          };
        }
        dispatch(failure(user, error));
      }
    );
  };

  function request(user) {
    return { type: UserConstants.REQUEST_SIGNUP, user };
  }
  function success(user) {
    return { type: UserConstants.SUCCESS_SIGNUP, user };
  }
  function failure(user, error) {
    return { type: UserConstants.FAILURE_SIGNUP, user, error };
  }
}

function signin(username, password, clear_cache) {
  return (dispatch) => {
    dispatch(request({ username }));

    UserService.signin(username, password, clear_cache).then(
      (user) => {
        dispatch(success(user));
        History.push(MENU_ITEMS.COLLECTIONS);
      },
      (error) => {
        error = { ...error, errorCode: error.code };
        dispatch(failure(error));
      }
    );
  };

  function request(user) {
    return { type: UserConstants.REQUEST_SIGNIN, user };
  }
  function success(user) {
    return { type: UserConstants.SUCCESS_SIGNIN, user };
  }
  function failure(error) {
    return { type: UserConstants.FAILURE_SIGNIN, error };
  }
}

function signout() {
  return (dispatch) => {
    UserService.signout().then(
      (data) => {
        dispatch(success());
      },
      (error) => {
        error = { ...error, signoutFailed: true };
        dispatch(failure(error));
      }
    );
  };
  function success() {
    return { type: UserConstants.REQUEST_SIGNOUT };
  }
  function failure(error) {
    return { type: UserConstants.REQUEST_SIGNOUT_FAIL, error };
  }
}

function cleanSignoutFail() {
  return { type: UserConstants.CLEAN_SIGNOUT_FAILED };
}

function availabilityCheck(name) {
  return (dispatch) => {
    dispatch(request(name));

    UserService.screenName(name).then(
      (name) => dispatch(success(name)),
      (error) => {
        if (error.code === StatusCode.SCREEN_NAME_FAIL) {
          error = { ...error, screenNameError: true, apiError: false };
        } else {
          error = { ...error, screenNameError: false, apiError: true };
        }

        dispatch(failure(name, error));
      }
    );
  };
  function request(name) {
    return { type: UserConstants.REQUEST_NAME_AVAILABLE, name };
  }
  function success(name) {
    return { type: UserConstants.SUCCESS_NAME_AVAILABLE, name };
  }
  function failure(name, error) {
    return { type: UserConstants.FAILURE_NAME_AVAILABLE, name, error };
  }
}

function resetAvailabilityCheck() {
  return (dispatch) => {
    dispatch(cleanAvailabilityStatus());
  };
  function cleanAvailabilityStatus() {
    return { type: UserConstants.CLEAN_NAME_AVAILABLE };
  }
}

function register(user, nameCheck) {
  return (dispatch) => {
    dispatch(request(user));
    if (nameCheck) {
      UserService.register(user).then(
        (user) => dispatch(success(user)),
        (error) => dispatch(failure(user, error.toString()))
      );
    } else {
      UserService.screenName(user).then(
        (data) => {
          if (data.code === StatusCode.SCREEN_NAME_SUCCESS) {
            UserService.register(user).then(
              (user) => dispatch(success(user)),
              (error) => dispatch(failure(user, error.toString()))
            );
          } else {
            let error;
            if (data.code === StatusCode.SCREEN_NAME_FAIL) {
              error = { ...error, screenNameError: false, apiError: false };
            } else {
              error = { ...error, screenNameError: false, apiError: true };
            }

            dispatch(screenFailure(user, error));
            dispatch(
              failure(user, "Registration Failed: Screen Name Not Available")
            );
          }
        },
        (error) => {
          if (error.code === StatusCode.SCREEN_NAME_FAIL) {
            error = { ...error, screenNameError: true, apiError: false };
          } else {
            error = { ...error, screenNameError: false, apiError: true };
          }

          dispatch(screenFailure(user, error));
          dispatch(
            failure(user, "Registration Failed: Screen Name Not Available")
          );
        }
      );
    }
  };
  function request(user) {
    return { type: UserConstants.REQUEST_FINISH_REGISTRATION, user };
  }
  function success(user) {
    return { type: UserConstants.SUCCESS_FINISH_REGISTRATION, user };
  }
  function failure(user, error) {
    return { type: UserConstants.FAILURE_FINISH_REGISTRATION, user, error };
  }
  function screenFailure(user, error) {
    return { type: UserConstants.FAILURE_NAME_AVAILABLE, user, error };
  }
}

function resetRegistration() {
  return (dispatch) => {
    dispatch(resetApiFailFlag());
    dispatch(resetRegistrationFlags());
  };
  function resetApiFailFlag() {
    return { type: UserConstants.CLEAN_SCREEN_API_FLAG };
  }
  function resetRegistrationFlags() {
    return { type: UserConstants.CLEAN_REGISTER_FLAG };
  }
}

function clearSignup() {
  return (dispatch) => {
    dispatch(resetSignupFlags());
  };
  function resetSignupFlags() {
    return { type: UserConstants.CLEAN_SIGNUP_FLAG };
  }
}

function clearSignin() {
  return (dispatch) => {
    dispatch(resetSigninFlags());
  };
  function resetSigninFlags() {
    return { type: UserConstants.CLEAN_SIGNIN_FLAG };
  }
}

function validateSignup(val) {
  return (dispatch) => {
    dispatch(request(val));
  };
  function request(val) {
    return { type: UserConstants.REQUEST_SIGNUP_URL_VERIFICATION, val };
  }
}

function validateRegister(val) {
  return (dispatch) => {
    dispatch(request(val));
  };
  function request(val) {
    return { type: UserConstants.REQUEST_REGISTER_URL_VERIFICATION, val };
  }
}

function resendEmail(user) {
  return (dispatch) => {
    dispatch(request(user));

    UserService.resendEmail(user).then(
      (user) => dispatch(success(user)),
      (error) => dispatch(failure(user, error.toString()))
    );
  };
  function request(user) {
    return { type: UserConstants.REQUEST_EMAIL_RESEND, user };
  }
  function success(user) {
    return { type: UserConstants.SUCCESS_EMAIL_RESEND, user };
  }
  function failure(user, error) {
    return { type: UserConstants.FAILURE_EMAIL_RESEND, user, error };
  }
}

const GetProfile = (uid) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.UIDS +
      uid,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      UserConstants.REQUEST_USER_PROFILE,
      UserConstants.SUCCESS_USER_PROFILE,
      UserConstants.FAILURE_USER_PROFILE,
    ],
  });

const UpdateProfile = (user) =>
  createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + "user",
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify(user),
    types: [
      UserConstants.USER_PROFILE_UPDATE_REQUEST,
      {
        type: UserConstants.USER_PROFILE_UPDATE_SUCCESS,
        payload: { userPayload: user },
      },
      UserConstants.USER_PROFILE_UPDATE_FAILURE,
    ],
  });

const ResetUpdateProfile = () => {
  return (dispatch) => {
    dispatch({ type: UserConstants.USER_PROFILE_UPDATE_RESET });
  };
};

const GetRequiredActions = () =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.ACTIONS,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_USER_ACTIONS_REQUIRED,
      FETCH_USER_ACTIONS_REQUIRED_SUCCESS,
      FETCH_USER_ACTIONS_REQUIRED_ERROR,
    ],
  });
const GetUserPersonalInfo = () =>
  createAction({
    endpoint:
      API_BASE_URL + RestConstants.BASE_URL_V2 + "personalInfoAgreement",
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_USER_PERSONAL_INFO,
      FETCH_USER_PERSONAL_INFO_SUCCESS,
      FETCH_USER_PERSONAL_INFO_ERROR,
    ],
  });
const GetUserInviteList = (search, size, page) => {
  search = search.replace(/\s/g, "");
  search = encodeURIComponent(search);
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      `search?q=${search}&size=${size}&page=${page}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_USER_SEARCH_LIST,
      FETCH_USER_SEARCH_LIST_SUCCESS,
      FETCH_USER_SEARCH_LIST_ERROR,
    ],
  });
};
const PostRequiredActions = (body, dispatch, callback) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.ACTIONS,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: body,
    types: [
      POST_USER_ACTIONS_REQUIRED,
      {
        type: POST_USER_ACTIONS_REQUIRED_SUCCESS,
        payload: (action, state, res) => {
          dispatch(GetChannelListAction());
          if (callback) callback();
          return res.json().then((data) => data);
        },
      },
      POST_USER_ACTIONS_REQUIRED_ERROR,
    ],
  });

const UpdateStatus = (oldStatus, newStatus) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.USER_STATUS,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify({ status: newStatus.state }),
    types: [
      {
        type: UserConstants.REQUEST_USER_STATUS_UPDATE,
        payload: newStatus,
      },
      {
        type: UserConstants.REQUEST_USER_STATUS_UPDATE_SUCCESS,
        payload: newStatus,
      },
      {
        type: UserConstants.REQUEST_USER_STATUS_UPDATE_FAILURE,
        payload: oldStatus,
      },
    ],
  });

const ClearResetPassword = () => {
  return (dispatch) => {
    dispatch({ type: UserConstants.CLEAR_RESET_PASSWORD_FLAG });
  };
};

const ResetPassword = (user) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.REMEDIATION +
      RestConstants.QUERY_REMEDIATION_REASON_PASSWORD +
      RestConstants.QUERY_REMEDIATION_EMAIL +
      user.email,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      UserConstants.REQUEST_RESET_PASSWORD_REQUEST,
      UserConstants.REQUEST_RESET_PASSWORD_REQUEST_SUCCESS,
      UserConstants.REQUEST_RESET_PASSWORD_REQUEST_FAILURE,
    ],
  });

const validateResetPassword = (params) => {
  return (dispatch) => {
    dispatch({ type: UserConstants.VALIDATE_RESET_PASSWORD_REQUEST, params });
  };
};

const ClearUpdatePassword = () => {
  return (dispatch) => {
    dispatch({ type: UserConstants.CLEAR_UPDATE_PASSWORD_FLAG });
  };
};

const UpdatePassword = (user) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.REMEDIATION,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify({
      username: user.resetEmail,
      password: user.password,
      resetPasswordCode: user.resetPasswordCode,
    }),
    types: [
      UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST,
      UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST_SUCCESS,
      UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST_FAILURE,
    ],
  });

const userNetwork = (networkType) => {
  return (dispatch) => {
    dispatch({
      type: UserConstants.USER_NETWORK_TYPE,
      networkType: networkType,
    });
  };
};

const updateUserProfileEvent = (user) => {
  return (dispatch) => {
    dispatch({
      type: UserConstants.UPDATE_USER_PROFILE_EVENT,
      user: user,
    });
  };
};
export const cleanUserListState = () => {
  return {
    type: RESET_SEARCH_LIST,
  };
};
const UserActions = {
  signin,
  signout,
  signup,
  availabilityCheck,
  resetAvailabilityCheck,
  register,
  resetRegistration,
  clearSignup,
  clearSignin,
  validateSignup,
  resendEmail,
  validateRegister,
  GetUserPersonalInfo,
  cleanSignoutFail,
  userNetwork,
  GetUserInviteList,
  updateUserProfileEvent,
};

export {
  GetProfile,
  GetUserPersonalInfo,
  GetUserInviteList,
  UpdateProfile,
  ResetUpdateProfile,
  GetRequiredActions,
  PostRequiredActions,
  UpdateStatus,
  ClearResetPassword,
  ResetPassword,
  validateResetPassword,
  ClearUpdatePassword,
  UpdatePassword,
  userNetwork,
  updateUserProfileEvent,
};

export default UserActions;
