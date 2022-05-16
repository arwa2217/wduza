import {
  CLEAR_USER_MENTION,
  USER_MENTION,
} from "../actionTypes/user-mention-action-types";
const initialState = {
  userMention: false,
};

const UserMentionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_USER_MENTION: {
      return {
        ...state,
        userMention: false,
      };
    }
    case USER_MENTION: {
      return {
        ...state,
        userMention: true,
      };
    }
    default:
      return state;
  }
};
export default UserMentionReducer;
