import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UploadStatus } from "../../../constants/channel/file-upload-status";
import {
  LOAD,
  SUBMIT,
  NEXT,
  FILE_UPLOADED,
  FILES_UPLOADED,
  HIDE_MODAL,
  RESET,
  UPDATE_NAME,
  DELETE_FILE,
  UPDATE_TOTAL_FILES,
  LOAD_INIT,
} from "../../../store/actionTypes/file-attachment-action-types";
import AttachmentReducer from "../../../store/reducers/file-attachment-reducer";
import services from "../../../outlook/apiService";

const FileUploadHelper = () => {
  const fileAttachmentReducer = useSelector(
    (state) => state.OutlookMailReducer.fileAttachments
  );
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
  const [state, dispatch] = useReducer(AttachmentReducer, initialState);
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState([]);
  const activeDraftMailId = useSelector(
    (state) => state.OutlookMailReducer?.activeDraftMailId
  );
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
  const readUploadedFileAsBytes = async (file) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result.split(",")[1]);
      };
      temporaryFileReader.readAsDataURL(file);
    });
  };
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
    (e) => {
      if (state.files.length) {
        dispatch({ type: SUBMIT });
      }
    },
    [state.files.length]
  );

  const convertFiles = async (arrFiles) => {
    const files = [];
    for (let i = 0; i < arrFiles.length; i++) {
      const file = arrFiles[i];

      const src = window.URL.createObjectURL(file);
      const contentBytes = await readUploadedFileAsBytes(file);
      files.push({
        file,
        id: Math.random(),
        src,
        contentBytes,
      });
    }
    return files;
  };
  const onChangeAttach = async (e) => {
    if (e.target && e.target.files) {
      if (e.target.files.length) {
        const arrFiles = Array.from(e.target.files);
        const files = await convertFiles(arrFiles);
        dispatch({ type: LOAD, files });
      }
    } else if (e.dataTransfer && e.dataTransfer.files) {
      if (e.dataTransfer.files.length) {
        const arrFiles = Array.from(e.dataTransfer.files);
        const files = await convertFiles(arrFiles);
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

  const DeleteFile = async (id) => {
    dispatch({ type: DELETE_FILE, payload: { id: id } });
    //await services.deleteMailAttachment(activeDraftMailId, id);
  };

  async function remove(removeFileId, outlookId) {
    let success = false;
    let remainingIds = [];
    remainingIds = fileId.filter((el) => el.id !== removeFileId);
    setFileId(remainingIds);
    setIsFileAdded(false);
    success = true;
    if (outlookId) {
      await services.deleteMailAttachment(activeDraftMailId, outlookId);
    }
    return {
      success: success,
      remainingFile: remainingIds.length === 0 ? [] : remainingIds,
    };
  }

  useEffect(() => {
    if (fileAttachmentReducer.length > 0) {
      const formatData = fileAttachmentReducer.map((item) => {
        return {
          file: {
            lastModified: item.lastModifiedDateTime,
            name: item.name,
            size: item.size,
            type: item.contentType,
          },
          id: item.id,
          contentBytes: item.contentBytes,
          src: "",
          outlookId: item.id,
          isOutLook: true,
          isInline: item.isInline,
        };
      });
      setFileId(fileAttachmentReducer);
      state.isFileAdded = true;
      state.files = formatData;
      dispatch({ type: LOAD_INIT, payload: { files: formatData || [] } });
    } else {
      reset();
    }
  }, [fileAttachmentReducer]);

  useEffect(() => {
    dispatch({ type: LOAD_INIT, payload: { files: [] } });
  }, [activeDraftMailId]);

  // Sets the next file when it detects that its ready to go
  useEffect(() => {
    if (state.pending.length && state.next == null) {
      const next = state.pending[0];
      // Call API to add file attachment to mail
      const uploadOutlookAttachment = async (fileName, contentBytes) => {
        const fileBody = {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: fileName,
          contentBytes: contentBytes,
        };
        const result = await services.addMailAttachment(
          activeDraftMailId,
          fileBody
        );
        next.outlookId = result.id;
        next.isInline = false;
      };
      try {
        if (activeDraftMailId) {
          uploadOutlookAttachment(next.file.name, next.contentBytes);
        }
      } catch (e) {}
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
      let fileIdObj = {};
      fileIdObj.id = next.id;
      fileIdObj.cc = "";
      fileIdObj.fileId = next.id;
      setFileId([...fileId, fileIdObj]);
      const prev = next;
      const pending = state.pending.slice(1);
      dispatch({ type: FILE_UPLOADED, prev, pending });
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
    setFileId,
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
    DeleteFile,
  };
};

export default FileUploadHelper;
