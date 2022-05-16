import { AddUserAction } from "./add-user-actions";

const addUserReducer = (state, action) => {
  switch (action.type) {
    case AddUserAction.INPUT_CHANGE:
      return {
        ...state,
        [action.field]: action.payload,
      };
    case AddUserAction.IS_PASSCODE_VISIBLE:
      return {
        ...state,
        isPasscodeVisible: !action.payload,
        passcode: action.payload ? "" : state.passcode,
        sms: "",
        isSMSVisible: false,
      };
    case AddUserAction.IS_SMS_VISIBLE:
      return {
        ...state,
        isSMSVisible: !action.payload,
        sms: action.payload ? "" : state.sms,
        passcode: "",
        isPasscodeVisible: false,
      };
    case AddUserAction.REMOVE:
      return {
        ...state,
        isSMSVisible: !!action.payload,
        isPasscodeVisible: !!action.payload,
        [action.control]: "",
      };
    case AddUserAction.SIGNNEEDED:
      return {
        ...state,
        [action.field]: action.payload,
      };
    case AddUserAction.RECIPIENT_CID:
      return {
        ...state,
        [action.field]: action.payload,
      };
    case AddUserAction.USER_TYPE:
      return {
        ...state,
        [action.field]: action.payload,
      };
    case AddUserAction.RE_INITIALIZE_STATE:
        return {
          ...action.payload
        }
    default:
      return { ...state };
  }
};

export default addUserReducer;
