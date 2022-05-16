import UserConstants from "../../constants/user/user-constants";

import StatusCode from "../../constants/rest/status-codes";
import { getAuthToken, removeAuthToken } from "../../utilities/app-preference";
/*
 *Updates state of users variables
 */

function UserReducer(state = {}, action) {
  switch (action.type) {
    case UserConstants.REQUEST_GETALL:
      return {
        loading: true,
      };
    case UserConstants.SUCCESS_GETALL:
      return {
        items: action.users,
      };
    case UserConstants.FAILURE_GETALL:
      return {
        error: action.error,
      };
    case UserConstants.REQUEST_REMOVE:
      return {
        ...state,
        items: state.items.map((user) =>
          user.id === action.id ? { ...user, removing: true } : user
        ),
      };
    case UserConstants.SUCCESS_REMOVE:
      // remove deleted user from state
      return {
        items: state.items.filter((user) => user.id !== action.id),
      };
    case UserConstants.FAILURE_REMOVE:
      return {
        ...state,
        items: state.items.map((user) => {
          if (user.id === action.id) {
            const { removing, ...userCopy } = user;
            return { ...userCopy, removeError: action.error };
          }
          return user;
        }),
      };
    case UserConstants.REQUEST_NAME_AVAILABLE:
      return {
        nameCheck: undefined,
        name: action.name,
      };
    case UserConstants.SUCCESS_NAME_AVAILABLE:
      return {
        nameCheck: true,
        name: action.name,
      };
    case UserConstants.FAILURE_NAME_AVAILABLE:
      return {
        nameCheck: !action.error.screenNameError,
        apiError: action.error.apiError,
        name: action.name,
      };
    case UserConstants.CLEAN_NAME_AVAILABLE:
      return {
        nameCheck: undefined,
      };
    case UserConstants.CLEAN_SCREEN_API_FLAG:
      return {
        apiError: false,
        user: action.user,
      };
    case UserConstants.CLEAR_RESET_PASSWORD_FLAG:
      return {
        ...state,
        resetting: false,
        resetSuccess: false,
        resetFail: false,
        resetFailEmail: false,
      };
    case UserConstants.REQUEST_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetting: true,
      };
    case UserConstants.REQUEST_RESET_PASSWORD_REQUEST_SUCCESS:
      let success = false;
      if (
        action.payload &&
        action.payload.code === StatusCode.RESET_REQUEST_SUCCESS
      ) {
        success = true;
      }
      return {
        ...state,
        resetSuccess: success,
        resetFail: !success,
        resetting: false,
      };
    case UserConstants.REQUEST_RESET_PASSWORD_REQUEST_FAILURE:
      let failureEmail = false;
      if (
        action.payload &&
        action.payload.code === StatusCode.RESET_REQUEST_FAIL_EMAIL
      ) {
        failureEmail = true;
      }
      return {
        ...state,
        resetSuccess: false,
        resetting: false,
        resetFail: true && !failureEmail,
        resetFailEmail: failureEmail,
      };
    case UserConstants.VALIDATE_RESET_PASSWORD_REQUEST:
      let params = JSON.parse(action.params);
      return {
        ...state,
        resetEmail: params.data.email,
        resetPasswordCode: params.data.resetPasswordCode,
      };
    case UserConstants.CLEAR_UPDATE_PASSWORD_FLAG:
      return {
        ...state,
        passwordResetting: false,
        passwordResetSuccess: false,
        passwordResetApiError: false,
        passwordResetFail: false,
      };
    case UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        passwordResetting: true,
      };
    case UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST_SUCCESS:
      if (getAuthToken()) {
        removeAuthToken();
      }
      let updated = false;
      if (
        action.payload &&
        action.payload.code === StatusCode.UPDATE_PASSWORD_SUCCESS
      ) {
        updated = true;
      }
      return {
        ...state,
        passwordResetSuccess: updated,
        passwordResetFail: !updated,
        passwordResetting: false,
      };
    case UserConstants.REQUEST_UPDATE_PASSWORD_REQUEST_FAILURE:
      let failureUpdate = false;
      if (
        action.payload &&
        action.payload.code === StatusCode.RESET_REQUEST_FAIL_EMAIL
      ) {
        failureUpdate = true;
      }
      return {
        ...state,
        passwordResetSuccess: false,
        passwordResetting: false,
        passwordResetApiError: true && !failureEmail,
        passwordResetFail: failureEmail,
      };
    default:
      return state;
  }
}

export default UserReducer;
