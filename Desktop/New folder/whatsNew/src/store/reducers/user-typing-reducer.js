import {
  CLEAR_TYPING_FLAG,
  USER_TYPING,
} from "../actionTypes/user-typing-actionTypes";
const initialState = {
  userTypingData: {},
};

const UserTypingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_TYPING_FLAG: {
      return {
        ...state,
        userTypingData: {},
      };
    }
    case USER_TYPING: {
      return {
        ...state,
        userTypingData: action.payload,
      };
    }
    default:
      return state;
  }
};
export default UserTypingReducer;
