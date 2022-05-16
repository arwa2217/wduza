import UserConstants from "../../constants/user/user-constants";
import {
  getAuthToken,
  getUID,
  removeAuthToken,
  removeSessionStorageToken,
} from "../../utilities/app-preference";
import NotificationSettings from "../../constants/websocket/notification-settings-constants";

/*
 *Updates state of authentication variables
 */

const initialUser = {
  CID: "",
  UID: "",
  email: "",
  screenName: "",
  companyName: "",
  department: "",
  firstName: "",
  lastName: "",
  onlineStatus: "",
  activationStatus: "",
  address: "",
  city: "",
  id: "",
  country: "",
  officeNumber: "",
  phoneNumber: "",
  deskExtension: "",
  timezone: "",
  userType: "",
  userImg: "",
  notificationFilter: NotificationSettings.NOTIFICATION_ALL,
  notifyByEmail: false,
};
let auth = getAuthToken();
let id = getUID();

let initialState = {
  user: initialUser,
  profileLoading: true,
  signingIn: false,
  signoutFailed: false,
  networkType: "",
};

initialState = auth
  ? { ...initialState, signedIn: true, token: auth }
  : { ...initialState };
initialState = id ? { ...initialState, uid: id } : { ...initialState };

function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case UserConstants.REQUEST_SIGNIN:
      return {
        ...state,
        signingIn: true,
        user: { ...state.user, email: action.user.email },
      };
    case UserConstants.SUCCESS_SIGNIN:
      return {
        ...state,
        signingIn: false,
        signedIn: true,
        uid: action.user.data.uid,
      };
    case UserConstants.FAILURE_SIGNIN:
      return {
        ...state,
        signingIn: false,
        signinFail: true,
        errorCode: action.error.errorCode,
      };
    case UserConstants.REQUEST_SIGNOUT:
      removeAuthToken();
      removeSessionStorageToken();
      // eslint-disable-next-line no-restricted-globals
      location.reload(true);
      return state;
    case UserConstants.REQUEST_SIGNOUT_FAIL:
      return { ...state, signoutFailed: action.error.signoutFailed };
    case UserConstants.CLEAN_SIGNOUT_FAILED:
      return { ...state, signoutFailed: false };
    case UserConstants.CLEAN_SIGNIN_FLAG:
      return {
        ...state,
        signinFail: false,
      };
    case UserConstants.REQUEST_USER_PROFILE:
      return {
        ...state,
        profileLoading: true,
      };
    case UserConstants.SUCCESS_USER_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload.data },
        profileLoading: false,
        profileLoaded: true,
      };
    case UserConstants.FAILURE_USER_PROFILE:
      return {
        ...state,
        profileLoading: true,
        profileLoaded: false,
      };
    case UserConstants.REQUEST_USER_STATUS_UPDATE:
      return {
        ...state,
        user: { ...state.user, onlineStatus: action.payload.state },
      };
    case UserConstants.REQUEST_USER_STATUS_UPDATE_SUCCESS:
      return {
        ...state,
        user: { ...state.user, onlineStatus: action.payload.state },
      };
    case UserConstants.REQUEST_USER_STATUS_UPDATE_FAILURE:
      return {
        ...state,
        user: { ...state.user, onlineStatus: action.payload.state },
      };
    case UserConstants.USER_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        userProfileUpdateSuccess: false,
        userProfileUpdateError: false,
      };

    case UserConstants.USER_PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        user: { ...action.payload.userPayload },
        userProfileUpdateSuccess: true,
        userProfileUpdateError: false,
      };
    case UserConstants.USER_PROFILE_UPDATE_FAILURE:
      return {
        ...state,
        userProfileUpdateSuccess: false,
        userProfileUpdateError: true,
      };
    case UserConstants.USER_PROFILE_UPDATE_RESET:
      return {
        ...state,
        userProfileUpdateSuccess: false,
        userProfileUpdateError: false,
      };
    case UserConstants.USER_NETWORK_TYPE:
      return { ...state, networkType: action.networkType };
    case UserConstants.UPDATE_USER_PROFILE_EVENT:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}

export default AuthReducer;
