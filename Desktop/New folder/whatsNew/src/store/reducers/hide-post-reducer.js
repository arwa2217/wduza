import {
  HIDE_POST,
  HIDE_POST_SUCCESS,
  HIDE_POST_ERROR,
} from "../actionTypes/edit-post-action-type";

const initialState = {
  channelId: "",
  isHidePost: false,
  postId: "",
};
const hidePostReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case HIDE_POST_SUCCESS:
      return {
        ...state,
        isHidePost: true,
        postId: action.postId,
      };
    case HIDE_POST:
      return {
        ...state,
        isHidePost: false,
      };
    case HIDE_POST_ERROR:
      return {
        ...state,
        isHidePost: false,
      };

    default:
      return state;
  }
};

export default hidePostReducer;
