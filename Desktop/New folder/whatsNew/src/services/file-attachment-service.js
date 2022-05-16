import server from "server";
import axios from "axios";
import { AuthHeader } from "../utilities/app-preference";
import {
  SET_IMAGE_FILE_SOURCE,
  RESET_IMAGE_FILE_SOURCE,
} from "../store/actionTypes/file-action-types";
import { deleteFiles } from "../store/actions/main-files-actions";
import { updateFilePanelState } from "../store/actions/config-actions";
function uploadMetaData(
  file,
  fileName,
  channelId,
  internalPermission,
  externalPermission,
  internalPermissionOOO,
  forwardCheck,
  folderId
) {
  let metaData = {
    channelId: channelId ? channelId.toString() : "",
    fileName: file.name,
    // fileRename:
    //   fileName  && fileName.oldName === file.name ? fileName.newName : file.name,

    // Do not remove this code will use in  multiple file upload
    fileRename:
      fileName === undefined
        ? file.name
        : fileName.names.oldName === file.name
        ? fileName.names.newName
        : file.name,

    fileSize: file.size,
    filePermission: {
      internal: internalPermission,
      external: externalPermission,
      internalOOO: internalPermissionOOO,
    },
    fileForwardDisabled: forwardCheck,
    folderId: folderId,
  };
  if (folderId) metaData.channelId = "";
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .post("/ent/v1/file", metaData);
}

function uploadFile(file, fileName, fileId, onUploadProgress) {
  let formData = new FormData();
  if (fileName && fileName.oldName === file.name) {
    formData.append("file", file, fileName.newName);
  } else {
    formData.append("file", file);
  }
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .post(`/ent/v1/file/${fileId}`, formData, {
      onUploadProgress,
    });
}
function remove(fileId, channelId) {
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .delete(`/ent/v1/file/${fileId}?channelId=${channelId}`);
}

function download(
  fileId,
  mimeType,
  fileName,
  channelId,
  postId,
  onDownloadProgress,
  folderId
) {
  axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob",
    })
    .get(
      `/ent/v1/filecontent/${fileId}?q=DL${
        folderId
          ? `&folderId=${folderId}`
          : `&channelId=${channelId}&postId=${postId}`
      }`,
      { onDownloadProgress }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: mimeType,
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log("DL ERROR IS", error);
    });
}

function downloadSignedFile(fileId, emailId, fileName, onDownloadProgress) {
  axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob",
    })
    .get(
      `/ent/v1/e-sign/filecontent/${fileId}?q=DL&email=${emailId}&wopiCapable=false&isFresh=true&page=1&requestedpages=5`,
      { onDownloadProgress }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log("DL ERROR IS", error);
    });
}

function fileDownloadFromFolder(
  fileId,
  mimeType,
  fileName,
  channelId,
  postId,
  onDownloadProgress,
  folderId,
  isAdmin
) {
  axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob",
    })
    .get(
      `${isAdmin ? "/ent/v1/admin/" : "/ent/v2/"}filecontent/${fileId}?q=DL${
        folderId
          ? `&folderId=${folderId}`
          : `&channelId=${channelId}&postId=${postId}`
      }`,
      { onDownloadProgress }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: mimeType,
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log("DL ERROR IS", error);
    });
}

function viewFile(fileId, mimeType, channelId, postId, dispatch, fromFolder) {
  axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob", // important
    })
    .get(
      `/ent/${
        fromFolder ? "v2" : "v1"
      }/filecontent/${fileId}?page=1&requestedpages=5&channelId=${channelId}&postId=${postId}`
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: mimeType,
        })
      );
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (!isSafari) {
        dispatch({
          type: SET_IMAGE_FILE_SOURCE,
          src: url + "#toolbar=0&navpanes=0&scrollbar=0",
        });
      } else {
        dispatch({
          type: SET_IMAGE_FILE_SOURCE,
          src: url,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: RESET_IMAGE_FILE_SOURCE,
      });
    });
}

function viewFileFromFolder(fileId, mimeType, folderId, dispatch) {
  axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
      responseType: "blob", // important
    })
    .get(`/ent/v2/filecontent/${fileId}?folderId=${folderId}`)
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: mimeType,
        })
      );
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (!isSafari) {
        dispatch({
          type: SET_IMAGE_FILE_SOURCE,
          src: url + "#toolbar=0&navpanes=0&scrollbar=0",
        });
      } else {
        dispatch({
          type: SET_IMAGE_FILE_SOURCE,
          src: url,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: RESET_IMAGE_FILE_SOURCE,
      });
    });
}

function removeFile(arrObj, isAdmin, dispatch) {
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .put(`/ent/v1${isAdmin ? "/admin" : ""}/file`, arrObj)
    .then((response) => {
      console.log("removed");
      if (isAdmin) {
        dispatch(updateFilePanelState(false));
      }
    })
    .catch((error) => {
      console.error("Failed to delete", error);
    });
}

// function adminRemoveFile(arrObj) {
//   return axios
//     .create({
//       baseURL: server.apiUrl,
//       headers: AuthHeader(),
//     })
//     .post(`/ent/v1/admin/file-delete`, arrObj)
//     .then((response) => {
//       console.log("removed");
//     })
//     .catch((error) => {
//       console.error("Failed to delete", error);
//     });
// }

function removeFilesById(fileObj, dispatch, isAdmin) {
  let filesFromFolder = {};
  let filesFromDiscussion = [];
  fileObj.map(({ fileId, postId, channelId, folderId }) => {
    if (folderId) {
      !filesFromFolder[folderId]
        ? (filesFromFolder[folderId] = [fileId])
        : filesFromFolder[folderId].push(fileId);
    } else if (channelId && postId)
      filesFromDiscussion.push({ fileId, postId, channelId });
  });
  if (Object.keys(filesFromFolder).length) {
    Object.keys(filesFromFolder).map((folder) => {
      dispatch(
        deleteFiles({
          folder: folder,
          files: [...filesFromFolder[folder]],
        })
      );
      return folder;
    });
  }
  if (Object.keys(filesFromDiscussion).length) {
    // isAdmin
    //   ? adminRemoveFile(filesFromDiscussion)
    // :
    removeFile(filesFromDiscussion, isAdmin, dispatch);
  }
}
async function getBlobByFileId(fileId, channelId, postId) {
  const configs = {
    baseURL: server.apiUrl,
    headers: AuthHeader(),
    responseType: "blob",
  };
  const url = `/ent/v1/filecontent/${fileId}?q=DL&channelId=${channelId}&postId=${postId}`;
  return await axios.create(configs).get(url);
}
function currentNetwork() {
  return "INTERNAL";
}

function resetImageFile(dispatch) {
  dispatch({
    type: RESET_IMAGE_FILE_SOURCE,
  });
}

function removeFolder(folderId) {
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .delete(`/ent/v1/folder/${folderId}?deleteFiles=true`)
    .then((response) => {})
    .catch((error) => {
      console.error("Failed to delete", error);
    });
}

const FileAttachmentService = {
  uploadMetaData,
  uploadFile,
  remove,
  download,
  viewFile,
  currentNetwork,
  removeFile,
  resetImageFile,
  fileDownloadFromFolder,
  viewFileFromFolder,
  removeFolder,
  removeFilesById,
  getBlobByFileId,
  downloadSignedFile,
};
export default FileAttachmentService;
