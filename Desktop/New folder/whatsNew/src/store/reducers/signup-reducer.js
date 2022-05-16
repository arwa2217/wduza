import UserConstants from "../../constants/user/user-constants";

/*
 *Updates state of registration variables
 */

function SignupReducer(state = {}, action) {
  switch (action.type) {
    case UserConstants.REQUEST_SIGNUP:
      return { signingUp: true };
    case UserConstants.SUCCESS_SIGNUP:
      return {
        signedUp: true,
        user: action.user,
      };
    case UserConstants.FAILURE_SIGNUP:
      return {
        user: action.user,
        signupFailEmail: action.error.signupFailEmail,
        signupFailUid: action.error.signupFailUid,
        signupFail: action.error.signupFail,
      };
    case UserConstants.REQUEST_FINISH_REGISTRATION:
      return {
        registering: true,
        user: action.user,
      };
    case UserConstants.SUCCESS_FINISH_REGISTRATION:
      return {
        registered: true,
        user: action.user,
      };
    case UserConstants.FAILURE_FINISH_REGISTRATION:
      return {
        registerFail: true,
        user: action.user,
      };
    case UserConstants.CLEAN_REGISTER_FLAG:
      return {
        registerFail: false,
        registered: false,
        user: action.user,
      };
    case UserConstants.CLEAN_SIGNUP_FLAG:
      return {
        signupFailEmail: false,
        signupFailUid: false,
        signedUp: false,
        resendFail: false,
        signupFail: false,
        user: action.user,
      };
    case UserConstants.REQUEST_SIGNUP_URL_VERIFICATION:
      return {
        uid: action.val.uid,
      };
    case UserConstants.REQUEST_EMAIL_RESEND:
      return {
        submit: true,
        user: action.user,
        signedUp: true,
      };
    case UserConstants.SUCCESS_EMAIL_RESEND:
      return {
        submit: false,
        sent: true,
        user: action.user,
        signedUp: true,
      };
    case UserConstants.FAILURE_EMAIL_RESEND:
      return {
        submit: false,
        sent: false,
        resendFail: true,
        user: action.user,
        signedUp: false,
      };
    case UserConstants.REQUEST_REGISTER_URL_VERIFICATION:
      return {
        uid: action.val.uid,
        email: action.val.email,
      };
    default:
      return state;
  }
}

export default SignupReducer;
