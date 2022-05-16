import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";

import {
  FETCH_TASK_HISTORY,
  FETCH_TASK_HISTORY_SUCCESS,
  FETCH_TASK_HISTORY_ERROR,
  FETCH_TASK_DETAILS,
  FETCH_TASK_DETAILS_SUCCESS,
  FETCH_TASK_DETAILS_ERROR,
  UPDATE_SELECTED_FILTER,
  UPDATE_SELECTED_ASSIGNEE,
} from "../actionTypes/tasks-action-types";
import { store } from "../store";

const fetchTaskDetails = (queryParams) => {
  const { channelId, offset, count, assignee, taskStatus, author } =
    queryParams;
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/task?channelId=${channelId}&offset=${offset}&count=${count}` +
      (assignee && assignee !== "ASSIGN_BY_ME" ? "&assignee=" + assignee : "") +
      (taskStatus.length > 0 ? "&taskStatus=" + taskStatus : "") +
      (author ? "&author=" + author : ""),
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_TASK_DETAILS,
      {
        type: FETCH_TASK_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                userId: store.getState().AuthReducer.user.id,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
          };
        },
      },
      FETCH_TASK_DETAILS_ERROR,
    ],
  });
};

const fetchHistoryDetails = (postId) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/task/${postId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_TASK_HISTORY,
      FETCH_TASK_HISTORY_SUCCESS,
      FETCH_TASK_HISTORY_ERROR,
    ],
  });
};

const updateSelectedFilter = (filterValue) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SELECTED_FILTER,
      payload: {
        data: filterValue,
      },
    });
  };
};

const updateSelectedAssignee = (assignee) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SELECTED_ASSIGNEE,
      payload: {
        data: assignee,
      },
    });
  };
};
export {
  fetchTaskDetails,
  fetchHistoryDetails,
  updateSelectedFilter,
  updateSelectedAssignee,
};
