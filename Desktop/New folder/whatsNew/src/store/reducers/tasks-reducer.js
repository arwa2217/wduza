import {
  FETCH_TASK_HISTORY,
  FETCH_TASK_HISTORY_SUCCESS,
  FETCH_TASK_HISTORY_ERROR,
  FETCH_TASK_DETAILS,
  FETCH_TASK_DETAILS_SUCCESS,
  FETCH_TASK_DETAILS_ERROR,
  UPDATE_TASK_LIST,
  UPDATE_SELECTED_FILTER,
  UPDATE_SELECTED_ASSIGNEE,
} from "../actionTypes/tasks-action-types";

const initialState = {
  loadingTask: true,
  taskHistory: [],
  error: [],

  fetchedTaskDetails: false,
  channelTaskLists: [],
  selectedFilter: [],
  selectedAssignee: null,
  showMore: false,
};

const tasksReducer = (state = { ...initialState }, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_TASK_DETAILS:
      return {
        ...state,
        fetchedTaskDetails: false,
      };
    case FETCH_TASK_DETAILS_ERROR:
      return {
        ...state,
        fetchedTaskDetails: false,
      };
    case FETCH_TASK_DETAILS_SUCCESS:
      let tempTaskPost = action.payload.data?.TaskMetadata?.filter(
        (item) =>
          (item?.post?.content !== "" && !item.isHidden) ||
          item?.userId === action.payload.userId
      );
      let totalSavePostCount =
        action.payload.data.count -
        action.payload.data?.TaskMetadata?.length +
        tempTaskPost?.length;
      if (tempTaskPost && tempTaskPost.length === 0) {
        tempTaskPost = undefined;
      }
      return {
        ...state,
        fetchedTaskDetails: true,
        channelTaskCount: totalSavePostCount,
        channelTaskLists: tempTaskPost,
        showMore:
          action.payload.data?.count -
            action.payload.data?.TaskMetadata?.length >
          0
            ? true
            : false,
      };

    case UPDATE_TASK_LIST:
      return {
        ...state,
        eventUpdate: Math.random(),
      };

    case FETCH_TASK_HISTORY:
      return {
        ...state,
        loadingTask: true,
        taskHistory: [],
      };
    case FETCH_TASK_HISTORY_SUCCESS:
      return {
        ...state,
        loadingTask: false,
        taskHistory: payload.data,
      };
    case FETCH_TASK_HISTORY_ERROR:
      return {
        ...state,
        loadingTask: false,
        taskHistory: [],
        errorTask: payload.data,
      };
    case UPDATE_SELECTED_FILTER:
      return {
        ...state,
        selectedFilter: payload.data,
      };
    case UPDATE_SELECTED_ASSIGNEE:
      return {
        ...state,
        selectedAssignee: payload.data,
      };

    default:
      return state;
  }
};

export default tasksReducer;
