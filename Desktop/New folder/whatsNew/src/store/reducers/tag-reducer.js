import {
  FETCH_TAG_DETAILS,
  FETCH_TAG_DETAILS_SUCCESS,
  FETCH_TAG_DETAILS_ERROR,
  UPDATE_TAG_LIST,
  FETCH_HISTORY_POST,
  FETCH_HISTORY_POST_SUCCESS,
  FETCH_HISTORY_POST_ERROR,
} from "../actionTypes/tag-action-types";
const initialState = {
  fetchTags: false,
  fetchedTagDetails: false,
  fetchedPostDetails: false,
  channelTagList: [],
  channelTagCount: 0,
  historyPostList: [],
  activeTag: "All",
  showMore: false,
};
const tagReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_TAG_DETAILS:
      return {
        ...state,
        fetchedTagDetails: false,
      };
    case FETCH_TAG_DETAILS_ERROR:
      return {
        ...state,
        fetchedTagDetails: false,
      };
    case FETCH_TAG_DETAILS_SUCCESS:
      let tempTagsPost = action.payload.data?.PostTagList?.filter(
        (item) =>
          (item.contents !== "" && !item.isHidden) ||
          (item.contents &&
            JSON.parse(item.contents).userId === action.payload.userId)
      );
      let totalSavePostCount =
        action.payload.data.TotalCount -
        action.payload.data?.PostTagList?.length +
        tempTagsPost?.length;
      if (tempTagsPost && tempTagsPost.length === 0) {
        tempTagsPost = undefined;
      }
      return {
        ...state,
        fetchedTagDetails: true,
        channelTagCount: totalSavePostCount,
        channelTagList: tempTagsPost,
        activeTag: action.payload.activeTag,
        showMore:
          action.payload.data.TotalCount -
            action.payload.data?.PostTagList?.length >
          0
            ? true
            : false,
      };
    case UPDATE_TAG_LIST:
      return {
        ...state,
        eventUpdate: Math.random(),
      };
    case FETCH_HISTORY_POST:
      return {
        ...state,
        fetchedPostDetails: false,
      };
    case FETCH_HISTORY_POST_ERROR:
      return {
        ...state,
        fetchedPostDetails: false,
      };

    case FETCH_HISTORY_POST_SUCCESS:
      return {
        ...state,
        historyPostList: action.payload,
      };

    default:
      return state;
  }
};

export default tagReducer;
