import {
  MEMBER_DETAILS,
  MEMBER_DETAILS_ERROR,
  MEMBER_DETAILS_SUCCESS,
} from "../actionTypes/member-details-action";

var initialState = {
  memberDetails: false,
  memberData: [],
};

const memberDetailsReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case MEMBER_DETAILS:
      return {
        ...state,
        memberDetails: false,
      };
    case MEMBER_DETAILS_ERROR:
      return {
        ...state,
        memberDetails: false,
      };
    case MEMBER_DETAILS_SUCCESS: {
      return {
        ...state,
        memberDetails: true,
        memberData: action.payload.userList,
      };
    }
    default:
      return state;
  }
};

export default memberDetailsReducer;
