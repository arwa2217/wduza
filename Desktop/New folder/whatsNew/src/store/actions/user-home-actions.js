import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";
import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAILURE,
  GET_NOTIFICATION_DATA,
  GET_NOTIFICATION_DATA_SUCCESS,
  GET_NOTIFICATION_DATA_FAILURE,
  GET_DASHBOARD_POST_DATA,
  GET_DASHBOARD_POST_DATA_SUCCESS,
  GET_DASHBOARD_POST_DATA_FAILURE,
  GET_DASHBOARD_TASK_DATA,
  GET_DASHBOARD_TASK_DATA_SUCCESS,
  GET_DASHBOARD_TASK_DATA_FAILURE,
  CLEAN_DASHBOARD_NOTIFICATION,
  CLEAN_DASHBOARD_TAGGED_POSTS,
  CLEAN_DASHBOARD_TASK_POSTS,
} from "../actionTypes/user-home-action-types";
import { store } from "../store";
import i18next from "i18next";

export const getDashboardData = () => {
  return createAction({
    endpoint:
      API_BASE_URL + RestConstants.BASE_URL + RestConstants.HOME_DASHBOARD,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      GET_DASHBOARD_DATA,
      GET_DASHBOARD_DATA_SUCCESS,
      GET_DASHBOARD_DATA_FAILURE,
    ],
  });
};
export const getNotificationData = (offset, count, type, subType) => {
  let requestParam = "";
  let encodedUrl = encodeURIComponent(subType);
  if (type !== undefined && subType !== undefined) {
    requestParam = `?offset=${offset}&count=${count}&type=${type}&subType=${encodedUrl}`;
  } else {
    requestParam = `?offset=${offset}&count=${count}`;
  }

  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.HOME_DASHBOARD +
      RestConstants.NOTIFICATION +
      requestParam,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      GET_NOTIFICATION_DATA,
      {
        type: GET_NOTIFICATION_DATA_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              let state = store.getState();
              let tempData = json.data;
              tempData.result &&
                tempData.result.map(async (message) => {
                  if (
                    message.type === "channel" &&
                    (message.subType === "added" ||
                      message.subType === "removed" ||
                      message.subType === "invited")
                  ) {
                    let post = {
                      content: `<b>${state.AuthReducer.user?.screenName}</b> ${message.subType} by <b>${message?.userScreenName}</b>`,
                      id: message.id,
                      type: "SYSTEM",
                      edited: false,
                      createdAt: message.timestamp * 1000,
                      updatedAt: message.timestamp * 1000,
                      forwarded: false,
                      forwardedPostID: false,
                    };
                    message.refPostdata.post = post;
                    let user = {
                      id: "monoly",
                      affiliation: i18next.t("monoly.label"),
                      userImg: i18next.t("monoly.label"),
                      userType: i18next.t("monoly.label"),
                      screenName: i18next.t("monoly.label"),
                      jobTitle: i18next.t("monoly.label"),
                      companyName: i18next.t("monoly.label"),
                      email: i18next.t("monoly.label"),
                      displayName: i18next.t("monoly.label"),
                    };
                    message.user = user;
                  }
                  return message;
                });
              return { data: json.data };
            });
          }
          return res;
        },
      },
      GET_NOTIFICATION_DATA_FAILURE,
    ],
  });
};
export const getDashboardPostData = (offset, count, tag_name) => {
  let requestParam = "";
  if (tag_name !== undefined) {
    requestParam = `?offset=${offset}&count=${count}&tag_name=${tag_name}`;
  } else {
    requestParam = `?offset=${offset}&count=${count}`;
  }
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.HOME_DASHBOARD +
      RestConstants.MESSAGES +
      requestParam,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      GET_DASHBOARD_POST_DATA,
      GET_DASHBOARD_POST_DATA_SUCCESS,
      GET_DASHBOARD_POST_DATA_FAILURE,
    ],
  });
};
export const getDashboardTasksData = (offset, count, task_type, assignee) => {
  let requestParam = "";
  if (task_type !== undefined) {
    requestParam = `?offset=${offset}&count=${count}&task_type=${task_type}&assignee=${
      assignee ? assignee : ""
    }`;
  } else {
    requestParam = `?offset=${offset}&count=${count}${
      assignee ? "&assignee=" + assignee : ""
    }`;
  }
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.HOME_DASHBOARD +
      RestConstants.TASK +
      requestParam,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      GET_DASHBOARD_TASK_DATA,
      GET_DASHBOARD_TASK_DATA_SUCCESS,
      GET_DASHBOARD_TASK_DATA_FAILURE,
    ],
  });
};
export const cleanDashboardNotificationState = () => {
  return {
    type: CLEAN_DASHBOARD_NOTIFICATION,
  };
};
export const cleanDashboardTaggedPostState = () => {
  return {
    type: CLEAN_DASHBOARD_TAGGED_POSTS,
  };
};
export const cleanDashboardTaskPostState = () => {
  return {
    type: CLEAN_DASHBOARD_TASK_POSTS,
  };
};
