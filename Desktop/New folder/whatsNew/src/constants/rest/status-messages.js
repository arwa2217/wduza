/*
 *Constants to be used for API RESPONSE values
 */
const StatusCode = {
  LOGIN_SUCCESS: "",
  LOGIN_FAIL_USERNAME: "Provided Username is invalid",
  LOGIN_FAIL_PASSWORD: "Invalid Password entered",

  SIGNUP_SUCCESS: "",
  SIGNUP_FAIL_UID: "Entered UID is Already Registered",
  SIGNUP_FAIL_EMAIL: "Entered Email is Already Registered",

  REGISTER_SUCCESS: "",
  REGISTER_FAIL: "Error while registering User",

  SCREEN_NAME_SUCCESS: "",
  SCREEN_NAME_FAIL: "Screen name Not Available",

  RESEND_EMAIL_SUCCESS: "",
  RESEND_EMAIL_FAIL: "Error While Sending Email",
};

export default StatusCode;
