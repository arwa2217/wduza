import server from "server";
import { AuthHeader, removeAuthToken } from "../utilities/app-preference";
import RestConstants from "../constants/rest/rest-constants";
import axios from "axios";
import { store } from "../store/store";
import { showToast } from "../store/actions/toast-modal-actions";
import i18next from "i18next";

function handleResponse(response) {
  return response.text().then((text) => {
    const parsedJSON = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        location.reload(true); // eslint-disable-line
      }

      const error = parsedJSON || response.statusText;
      return Promise.reject(error);
    }

    return parsedJSON.data;
  });
}

function getAccounts() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts",
    requestOptions
  ).then(handleResponse);
}

function exportAccount(memberData) {
  let date = new Date();
  let csv_file =
    "accounts_" +
    date.getFullYear() +
    date.getMonth() +
    date.getDate() +
    "_" +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds() +
    ".csv";
  const dispatch = store.dispatch;
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob",
    })
    .post(`/ent/v1/admin/user-export`, JSON.stringify(memberData))
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "text/csv",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", csv_file);
      link.click();
      window.URL.revokeObjectURL(url);
      dispatch(
        showToast(
          i18next.t("admin:account.management:user.export:success.message"),
          3000,
          "success"
        )
      );
    })
    .catch((error) => {
      dispatch(
        showToast(
          i18next.t("admin:account.management:user.export:fail.message"),
          3000,
          "failure"
        )
      );
      return error;
    });
}

function getUIDs() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/uids",
    requestOptions
  ).then(handleResponse);
}

function postUIDs(accounts) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(accounts),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/uids",
    requestOptions
  ).then(handleResponse);
}

function registerAccounts(accounts) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(accounts),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/register",
    requestOptions
  ).then(handleResponse);
}

function deleteAccounts(accounts) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(accounts),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/delete",
    requestOptions
  ).then(handleResponse);
}

function changeDiscussionOwner(changeOwner) {
  const requestOptions = {
    method: "PATCH",
    headers: AuthHeader(),
    body: JSON.stringify(changeOwner),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/change-owner",
    requestOptions
  ).then(handleResponse);
}

function getAdminEmail() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "accounts/admin-email",
    requestOptions
  ).then(handleResponse);
}

const AdminService = {
  getAccounts,
  getUIDs,
  postUIDs,
  registerAccounts,
  deleteAccounts,
  changeDiscussionOwner,
  getAdminEmail,
  exportAccount,
};

export default AdminService;
