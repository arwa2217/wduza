import {
  POST_CHANNEL_SAVE,
  POST_CHANNEL_SAVE_SUCCESS,
  POST_CHANNEL_SAVE_ERROR,
  REMOVE_SAVE,
  REMOVE_SAVE_SUCCESS,
  REMOVE_SAVE_ERROR,
  FETCH_SAVE_DETAILS,
  FETCH_SAVE_DETAILS_SUCCESS,
  FETCH_SAVE_DETAILS_ERROR,
  UPDATE_SAVE_LIST,
} from "../actionTypes/my-saves-action-types";
const initialState = {
  fetchedSaveDetails: false,
  channelSaveList: [],
  postId: "",
  showMore: false,
};
const mySaveReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case POST_CHANNEL_SAVE:
      return {
        ...state,
        fetchedSaveDetails: false,
      };
    case POST_CHANNEL_SAVE_ERROR:
      return {
        ...state,
        fetchedSaveDetails: false,
      };
    case POST_CHANNEL_SAVE_SUCCESS:
      return {
        ...state,
        fetchedSaveDetails: true,
        postId: action.payload,
        // channelSaveList: action.payload.data,
      };

    case REMOVE_SAVE:
    case REMOVE_SAVE_SUCCESS:
    case REMOVE_SAVE_ERROR:
    case FETCH_SAVE_DETAILS:
      return {
        ...state,
        fetchedSaveDetails: false,
      };
    case FETCH_SAVE_DETAILS_ERROR:
      return {
        ...state,
        fetchedSaveDetails: false,
      };
    case FETCH_SAVE_DETAILS_SUCCESS:
      let tempMySavePost = action.payload.data?.savedPostList?.filter(
        (item) =>
          (item.contents !== "" && !item.isHidden) ||
          (item.contents &&
            JSON.parse(item.contents).userId === action.payload.userId)
      );
      let totalSavePostCount =
        action.payload.data?.TotalCount -
        action.payload.data?.savedPostList?.length +
        tempMySavePost?.length;
      if (tempMySavePost && tempMySavePost.length === 0) {
        tempMySavePost = undefined;
      }
      return {
        ...state,
        fetchedTagDetails: true,
        channelSaveCount: totalSavePostCount,
        channelSaveList: tempMySavePost,
        showMore:
          action.payload.data?.TotalCount -
            action.payload.data?.savedPostList?.length >
          0
            ? true
            : false,
      };

    case UPDATE_SAVE_LIST:
      return {
        ...state,
        eventUpdate: Math.random(),
      };

    default:
      return state;
  }
};

export default mySaveReducer;
