import {
  EDITING_STARTED,
  EDITING_ENDED,
  EDITING_RESET,
} from "../actionTypes/edit-post-action-type";

const PostEditAction = (channelId, postId) => {
  return (dispatch) => {
    dispatch({ type: EDITING_STARTED, channelId: channelId, postId: postId });
  };
};
const PostEditEndAction = () => {
  return (dispatch) => {
    dispatch({ type: EDITING_ENDED });
  };
};
const PostEditResetAction = () => {
  return (dispatch) => {
    dispatch({ type: EDITING_RESET });
  };
};
export { PostEditAction, PostEditEndAction, PostEditResetAction };
