import {
  EDITING_STARTED,
  EDITING_ENDED,
  EDITING_RESET,
} from "../actionTypes/edit-post-action-type";
const initialState = {
  channelId: "",
  isEditing: false,
  postId: "",
};
const editPostReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case EDITING_STARTED:
      return {
        ...state,
        isEditing: true,
        channelId: action.channelId,
        postId: action.postId,
      };
    case EDITING_ENDED:
      return {
        ...state,
        isEditing: false,
      };
    case EDITING_RESET:
      return {
        ...state,
        isEditing: false,
        channelId: "",
        postId: "",
      };

    default:
      return state;
  }
};

export default editPostReducer;
