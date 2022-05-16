import {
  FETCH_POST_FORWARD_DETAILS,
  FETCH_POST_FORWARD_SUCCESS,
  FETCH_POST_FORWARD_ERROR,
} from "../actionTypes/post-forward-action-types";

const initialState = {
  fetchFiles: false,
  fetchingFilesDetails: false,
  fetchedFilesDetails: false,
  fetchedForwardDetails: false,
  forwardPostData: {},
};

const postForwardReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_POST_FORWARD_DETAILS:
      return {
        ...state,
        fetchingPostFwdCount: true,
        fetchedPostFwdCount: false,
      };
    case FETCH_POST_FORWARD_ERROR:
      return {
        ...state,
        fetchingPostFwdCount: true,
        fetchedPostFwdCount: false,
      };
    case FETCH_POST_FORWARD_SUCCESS:
      return {
        ...state,
        fetchedForwardDetails: true,
        postId: action.payload,
        forwardPostData: action.payload.data,
      };
    default:
      return state;
  }
};

export default postForwardReducer;
