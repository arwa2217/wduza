import { useCallback, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { PermissionConstants } from "../../../constants/permission-constants";
import FileAttachmentService from "../../../services/file-attachment-service";
import { UploadStatus } from "../../../constants/channel/file-upload-status";
import {
  LOAD,
  SUBMIT,
  NEXT,
  FILE_UPLOADED,
  FILES_UPLOADED,
  SET_UPLOAD_ERROR,
  HIDE_MODAL,
  RESET,
  UPDATE_NAME,
  DELETE_FILE,
  UPDATE_TOTAL_FILES,
} from "../../../store/actionTypes/file-attachment-action-types";
import { useTranslation } from "react-i18next";

import AttachmentReducer from "../../../store/reducers/file-attachment-reducer";
import { getFileSizeBytes } from "../../utils/file-utility";

const initialState = {
  showModal: false,
  files: [],
  pending: [],
  next: null,
  uploading: false,
  uploaded: {},
  rejected: {},
  status: "idle",
  fileName: [],
  isFileAdded: undefined,
  totalFiles: [],
};

const FileUploadHelper = () => {
  const [channelId, setChannelId] = useState(null);
  const [forwardCheck, setForwardCheck] = useState(null);
  const [folderId, setFolderId] = useState(null);

  const [internalPermission, setInternalPermission] = useState(null);
  const [externalPermission, setExternalPermission] = useState(null);
  const [state, dispatch] = useReducer(AttachmentReducer, initialState);
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState([]);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [internalPermissionOOO, setInternalPermissionOOO] = useState(null);

  const fileConfig = useSelector((state) => state.config.fileConfig);

  const { t } = useTranslation();
  function hideModal() {
    updateFileList(state.totalFiles);
    state.status = UploadStatus.FILES_UPLOADED;
    dispatch({
      type: HIDE_MODAL,
      payload: {
        totalFiles: state.totalFiles,
        status: UploadStatus.FILES_UPLOADED,
      },
    });
  }

  function reset() {
    state.totalFiles = initialState.totalFiles;
    state.files = initialState.files;
    updateFileList([]);
    setFileId([]);
    dispatch({ type: RESET });
  }

  const setIsFileAdded = (value) => {
    state.isFileAdded = value;
  };

  const onSubmit = useCallback(
    (e, id, internal, external, internalOOO, isDisabledCheckbox, folderId) => {
      setChannelId(id);
      setForwardCheck(isDisabledCheckbox);
      setFolderId(folderId);
      setInternalPermission(
        internal === PermissionConstants(t).VIEW
          ? PermissionConstants(t).VIEW_ENUM
          : PermissionConstants(t).DOWNLOAD_ENUM
      );
      setExternalPermission(
        external === PermissionConstants(t).VIEW
          ? PermissionConstants(t).VIEW_ENUM
          : external === PermissionConstants(t).DOWNLOAD
          ? PermissionConstants(t).DOWNLOAD_ENUM
          : PermissionConstants(t).NOT_ALLOWED_ENUM
      );
      setInternalPermissionOOO(
        internalOOO === PermissionConstants(t).VIEW
          ? PermissionConstants(t).VIEW_ENUM
          : internalOOO === PermissionConstants(t).DOWNLOAD
          ? PermissionConstants(t).DOWNLOAD_ENUM
          : PermissionConstants(t).NOT_ALLOWED_ENUM
      );
      if (state.files.length) {
        dispatch({ type: SUBMIT });
      } else {
        console.log("No Files to UPLOAD");
      }
    },
    [state.files.length]
  );

  const onChangeAttach = (e) => {
    if (e.target && e.target.files) {
      if (e.target.files.length) {
        const arrFiles = Array.from(e.target.files);
        const files = arrFiles.map((file, index) => {
          const src = window.URL.createObjectURL(file);
          return { file, id: Math.random(), src };
        });
        dispatch({ type: LOAD, files });
      }
    } else if (e.dataTransfer && e.dataTransfer.files) {
      if (e.dataTransfer.files.length) {
        const arrFiles = Array.from(e.dataTransfer.files);
        const files = arrFiles.map((file, index) => {
          const src = window.URL.createObjectURL(file);
          return { file, id: Math.random(), src };
        });
        dispatch({ type: LOAD, files });
      }
    }
  };

  const updateFileList = (myFiles) => {
    let cloneFiles = [];
    if (state.isFileAdded === true) {
      cloneFiles = [...state.files];
      cloneFiles = [...cloneFiles, ...myFiles];
      state.isFileAdded = undefined;
    } else if (state.isFileAdded === false) {
      cloneFiles = [...state.files];
      state.isFileAdded = undefined;
    } else {
      cloneFiles = [...myFiles];
    }
    state.files = cloneFiles;
    state.totalFiles = cloneFiles;
    dispatch({ type: UPDATE_TOTAL_FILES, payload: { totalFiles: cloneFiles } });
    return state.files;
  };

  const updateFileName = (id, names) => {
    dispatch({ type: UPDATE_NAME, payload: { id: id, names: names } });
  };

  const DeleteFile = (id) => {
    dispatch({ type: DELETE_FILE, payload: { id: id } });
  };

  async function remove(removeFileId, channelId) {
    var success = false;
    let selectedId = fileId.find((el) => el.id === removeFileId);
    let remainingIds = [];
    if (fileId.length > 0) {
      await FileAttachmentService.remove(selectedId.fileId, channelId)
        .then((response) => {
          if (response.status === 200) {
            remainingIds = fileId.filter((el) => el.id !== removeFileId);
            setFileId(remainingIds);
            setIsFileAdded(false);
            success = true;
          } else {
            setDeleteFailed(true);
          }
          return success;
        })
        .catch((error) => {
          setDeleteFailed(true);
          console.error(error);
          return success;
        });
    }
    return {
      success: success,
      remainingFile: remainingIds.length === 0 ? [] : remainingIds,
    };
  }
  // Sets the next file when it detects that its ready to go
  useEffect(() => {
    if (state.pending.length && state.next == null) {
      const next = state.pending[0];
      dispatch({ type: NEXT, next });
    }
  }, [state.next, state.pending]);

  useEffect(() => {
    if (
      state.pending.length &&
      state.next &&
      state.status !== UploadStatus.UPLOAD_ERROR
    ) {
      const { next } = state;
      setProgress(0);
      if (
        false &&
        (internalPermission === PermissionConstants(t).VIEW_ENUM ||
          externalPermission === PermissionConstants(t).VIEW_ENUM ||
          internalPermissionOOO === PermissionConstants(t).VIEW_ENUM)
      ) {
        if (
          (fileConfig &&
            fileConfig.mime.indexOf(next.file.type) !== -1 &&
            next.file.size < getFileSizeBytes(fileConfig.maxfilesize)) ||
          next.file.type.split("/")[0] === "image" ||
          next.file.type === "application/pdf"
        ) {
          let myFile = state.fileName.filter((el) => el.id === next.id)[0];
          FileAttachmentService.uploadMetaData(
            next.file,
            myFile,
            channelId,
            internalPermission,
            externalPermission,
            internalPermissionOOO
          )
            .then((response) => {
              let fileIdObj = {};
              fileIdObj.id = next.id;
              fileIdObj.fileId = response.data.data.fileId;
              setFileId([...fileId, fileIdObj]);

              FileAttachmentService.uploadFile(
                next.file,
                myFile,
                response.data.data.fileId,
                (event) => {
                  setProgress(Math.round((100 * event.loaded) / event.total));
                }
              )
                .then(() => {
                  const prev = next;
                  const pending = state.pending.slice(1);
                  dispatch({ type: FILE_UPLOADED, prev, pending });
                })
                .catch((error) => {
                  console.error(error);
                  const prev = next;
                  const pending = state.pending.slice(1);
                  dispatch({ type: SET_UPLOAD_ERROR, error, prev, pending });
                  setProgress(0);
                });
            })
            .catch((error) => {
              console.error(error);
              const prev = next;
              const pending = state.pending.slice(1);
              dispatch({ type: SET_UPLOAD_ERROR, error, prev, pending });
              setProgress(0);
            });
        } else {
          const prev = next;
          const error = "";
          const pending = state.pending.slice(1);
          // state.rejected = {
          //   ...state.rejected,
          //   [prev.id]: prev.file,
          // };
          // state.files = state.files.filter(el => el.id !== prev.id);
          // state.totalFiles = state.totalFiles.filter(el => el.id !== prev.id);
          dispatch({ type: SET_UPLOAD_ERROR, error, prev, pending });
          setProgress(0);
        }
      } else {
        let myFile = state.fileName.filter((el) => el.id === next.id)[0];
        FileAttachmentService.uploadMetaData(
          next.file,
          myFile,
          channelId,
          internalPermission,
          externalPermission,
          internalPermissionOOO,
          forwardCheck,
          folderId
        )
          .then((response) => {
            let fileIdObj = {};
            fileIdObj.id = next.id;
            fileIdObj.fileId = response.data.data.fileId;
            setFileId([...fileId, fileIdObj]);
            FileAttachmentService.uploadFile(
              next.file,
              myFile,
              response.data.data.fileId,
              (event) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
              }
            )
              .then(() => {
                const prev = next;
                const pending = state.pending.slice(1);
                dispatch({ type: FILE_UPLOADED, prev, pending });
              })
              .catch((error) => {
                console.error(error);
                const prev = next;
                const pending = state.pending.slice(1);
                dispatch({ type: SET_UPLOAD_ERROR, error, prev, pending });
                setProgress(0);
              });
          })
          .catch((error) => {
            console.error(error);
            const prev = next;
            const pending = state.pending.slice(1);
            dispatch({ type: SET_UPLOAD_ERROR, error, prev, pending });
            setProgress(0);
          });
      }
    }
  }, [state]);

  // Ends the upload process
  useEffect(() => {
    if (!state.pending.length && state.uploading) {
      dispatch({ type: FILES_UPLOADED });
    }
  }, [state.pending.length, state.uploading]);

  return {
    ...state,
    onSubmit,
    setIsFileAdded,
    onChangeAttach,
    updateFileList,
    hideModal,
    updateFileName,
    progress,
    reset,
    remove,
    fileId,
    deleteFailed,
    internalPermission,
    externalPermission,
    internalPermissionOOO,
    DeleteFile,
  };
};

export default FileUploadHelper;
