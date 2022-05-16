import server from "server";
import {
  AuthHeader,
  removeAuthToken,
  saveAuthToken,
  saveAuthTokenInSessionStorage,
} from "../utilities/app-preference";
import RestConstants from "../constants/rest/rest-constants";
import axios from "axios";
import ESignatureServices from "./esignature-services";

/*
 *Used to communicate with the backend services
 */

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        //signout();
        removeAuthToken();
        location.reload(true); // eslint-disable-line
      }

      const error = data || response.statusText;
      return Promise.reject(error);
    }
    /*
        Structure for data is :
                {
                    code : '',
                    message: '',
                    data : ''
                }
                use accordingly
        */
    return data;
  });
}

function signup(user) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(user, function replacer(key, value) {
      if (key === "uid") {
        return undefined;
      }

      return value;
    }),
  };

  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.UIDS +
      user.uid +
      RestConstants.ACCOUNT,
    requestOptions
  ).then(handleResponse);
}

function signin(username, password, clear_cache) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({ username, password, clear_cache }),
  };
  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.LOGIN,
    requestOptions
  )
    .then(handleResponse)
    .then((auth) => {
      // console.log("auth response user services>>>", auth);
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      saveAuthToken(auth.data.token, auth.data.uid);
      return auth;
    });
}

async function guestSignin(otlToken, email, channelId) {
  let user = null;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  await fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.GUEST_LOGIN +
      RestConstants.QUERY_GUEST_TOKEN +
      otlToken +
      RestConstants.QUERY_REMEDIATION_EMAIL +
      email +
      RestConstants.QUERY_CHANNEL_ID +
      channelId,
    requestOptions
  )
    .then(handleResponse)
    .then((auth) => {
      // store user details and jwt token in session storage to keep user logged in between page refreshes
      saveAuthTokenInSessionStorage(auth.data.token, auth.data.uid);
      user = auth;
    });
  return user;
}

async function sharedGuestFiles({ postObj, handleAuth, passCode }) {
  let data = null;
  const requestOptions = {
    method: "GET",
    headers: passCode
      ? {
          Authorization: "Basic " + window.btoa(`${postObj.id}:${passCode}`),
        }
      : { "Content-Type": "application/json" },
  };
  let queryString = "";
  if (postObj) {
    queryString =
      "?" +
      Object.keys(postObj)
        .map((key) => key + "=" + postObj[key])
        .join("&");
  }

  await fetch(
    `${server.apiUrl}${RestConstants.BASE_URL}${RestConstants.FILE_SHARE}${queryString}`,
    requestOptions
  )
    .then((res) => {
      return res.text().then((text) => {
        const resData = text && JSON.parse(text);
        if (!res.ok) {
          if (res.status === 401) {
            handleAuth();
            // data = resData;
            return resData;
          }
          const error = resData || res.statusText;
          return Promise.reject(error);
        }
        return resData;
      });
    })
    .then((res) => {
      data = res;
      return res;
    });
  return data;
}
async function guestESignFile(accessCode, fileId, id) {
  let data = {};
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessCode}`,
      "Content-Type": "application/json",
    },
  };

  // await fetch(
  //   `${server.apiUrl}${RestConstants.BASE_URL}e-sign/file/${fileId}/summary`,
  //   requestOptions
  // ).then((res) => {
  //   return res.text().then((text) => {
  //     const resData = text && JSON.parse(text);
  //     if (!res.ok) {
  //       if (res.status === 401) {
  //         // data = resData;
  //         return resData;
  //       }
  //       const error = resData || res.statusText;
  //       return Promise.reject(error);
  //     }
  //     return ESignatureServices.getRecipients(fileId);
  //     //   .then((res) => {
  //     //   if (res.data?.result?.length) {
  //     //     let recipientData = res.data.result.find((i) => i.email === id);
  //     //     data = { ...recipientData };
  //     //     return { ...resData.data, ...data };
  //     //   }
  //     // });
  //     // return { ...resData.data, ...data };
  //     // return resData;
  //   });
  // });

  return await Promise.all([
    fetch(
      `${server.apiUrl}${RestConstants.BASE_URL}e-sign/file/${fileId}/summary`,
      requestOptions
    ).then((res) => {
      return res.text().then((text) => {
        const resData = text && JSON.parse(text);
        if (!res.ok) {
          if (res.status === 401) {
            // data = resData;
            return resData;
          }
          const error = resData || res.statusText;
          return Promise.reject(error);
        }
        return resData;
      });
    }),
    ESignatureServices.getRecipients(fileId),
  ]).then((res) => {
    res.map((i) => (data = { ...data, ...(i?.data ?? {}) }));
    return data;
  });
  // console.log("promise all data --", data);
  // return data;
}

async function guestFileDownload(postObj, { name, mime_type, file_id }) {
  let data = null;
  let queryString = "";
  if (postObj) {
    queryString =
      "?" +
      Object.keys(postObj)
        .map((key) => key + "=" + postObj[key])
        .join("&");
  }
  await axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob",
    })
    .get(
      `${RestConstants.BASE_URL}${RestConstants.FILE_DOWNLOAD}${queryString}`
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: mime_type,
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      data = file_id;
      return error;
    });
  return data;
}

function signout() {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.LOGOUT,
    requestOptions
  ).then(handleResponse);
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };

  return fetch(`${server.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };

  return fetch(`${server.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: AuthHeader(),
    body: JSON.stringify(user),
  };

  return fetch(`${server.apiUrl}/users/${user.id}`, requestOptions).then(
    handleResponse
  );
}

function remove(id) {
  const requestOptions = {
    method: "DELETE",
    headers: AuthHeader(),
  };

  return fetch(`${server.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function screenName(name) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.USER +
      RestConstants.SCREEN_NAME +
      encodeURIComponent(name) +
      RestConstants.QUERY_AVAILABLE,
    requestOptions
  ).then(handleResponse);
}

function register(user) {
  const requestOptions = {
    method: "PUT",
    headers: AuthHeader(),
    body: JSON.stringify({
      username: user.email,
      "screen-name": user.displayName,
      password: user.password,
    }),
  };
  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.UIDS +
      user.uid +
      RestConstants.ACCOUNT,
    requestOptions
  ).then(handleResponse);
}

function resendEmail(user) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };

  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.UIDS +
      user.uid +
      RestConstants.ACCOUNT +
      RestConstants.RESEND_ACTIVATION +
      RestConstants.QUERY_RESEND_EMAIL +
      user.email,
    requestOptions
  ).then(handleResponse);
}

async function assignUuidToNewUser(postObj) {
  let data = null;
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(postObj),
  };

  await fetch(
    `${server.apiUrl}${RestConstants.BASE_URL}admin/assign-uid/registerbyuser`,
    requestOptions
  )
    .then((res) => {
      return res.text().then((text) => {
        const resData = text && JSON.parse(text);
        data = resData;
        return resData;
      });
    })
    .then((res) => {
      data = res;
      return res;
    });
  return data;
}

async function unassignUuid(postObj) {
  let data = null;
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(postObj),
  };

  await fetch(
    `${server.apiUrl}${RestConstants.BASE_URL}admin/unassign-uid`,
    requestOptions
  )
    .then((res) => {
      return res.text().then((text) => {
        const resData = text && JSON.parse(text);
        data = resData;
        return resData;
      });
    })
    .then((res) => {
      data = res;
      return res;
    });
  return data;
}

const UserService = {
  signin,
  signout,
  signup,
  getAll,
  getById,
  update,
  remove,
  screenName,
  register,
  resendEmail,
  guestSignin,
  guestFileDownload,
  sharedGuestFiles,
  assignUuidToNewUser,
  unassignUuid,
  guestESignFile,
};

export default UserService;
