import { UploadStatus } from "../../constants/channel/file-upload-status";
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
  LOAD_INIT,
} from "../actionTypes/file-attachment-action-types";

const initialState = {
  showModal: false,
  files: [],
  pending: [],
  next: null,
  uploading: false,
  uploaded: {},
  status: "idle",
  fileName: [],
  totalFiles: [],
  rejected: {},
};

function AttachmentReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        files: action.files,
        status: UploadStatus.LOADED,
        showModal: true,
      };
    case SUBMIT:
      return {
        ...state,
        uploading: true,
        pending: state.files,
        status: UploadStatus.INIT,
        next: null,
      };
    case NEXT:
      return {
        ...state,
        next: action.next,
        status: UploadStatus.PENDING,
      };
    case FILE_UPLOADED:
      return {
        ...state,
        next: null,
        pending: action.pending,
        uploaded: {
          ...state.uploaded,
          [action.prev.id]: action.prev.file,
        },
      };
    case FILES_UPLOADED:
      return {
        ...state,
        uploading: false,
        status: UploadStatus.FILES_UPLOADED,
        showModal: false,
      };
    case SET_UPLOAD_ERROR:
      let stateFiles = state.files.filter((el) => el.id !== action.prev.id);
      let stateTotalFiles = state.totalFiles.filter(
        (el) => el.id !== action.prev.id
      );
      return {
        ...state,
        uploadError: action.error,
        status: UploadStatus.UPLOAD_ERROR,
        // uploading: false,
        next: null,
        pending: action.pending,
        rejected: {
          ...state.rejected,
          [action.prev.id]: action.prev.file,
        },
        files: stateFiles,
        totalFiles: stateTotalFiles,
      };
    case HIDE_MODAL:
      return {
        ...state,
        showModal: initialState.showModal,
        files: action.payload.totalFiles,
        // files: initialState.files,
        pending: initialState.pending,
        next: initialState.next,
        uploading: initialState.uploading,
        // uploaded: initialState.uploaded,
        // rejected: initialState.rejected,
        // status: initialState.status,
        status: action.payload.status,
        fileName: initialState.fileName,
      };
    case RESET:
      return {
        ...state,
        showModal: initialState.showModal,
        files: initialState.files,
        pending: initialState.pending,
        next: initialState.next,
        uploading: initialState.uploading,
        uploaded: initialState.uploaded,
        // rejected: initialState.rejected,
        status: initialState.status,
        fileName: initialState.fileName,
        totalFiles: initialState.totalFiles,
      };
    case UPDATE_NAME:
      let myFileName = [...state.fileName];
      let newFileObj = { id: action.payload.id, names: action.payload.names };
      if (myFileName.length === 0) {
        myFileName.push(newFileObj);
      } else {
        let selectedId = myFileName.find((el) => el.id === action.payload.id);
        if (selectedId === undefined) {
          myFileName.push(newFileObj);
        } else {
          selectedId.names = action.payload.names;
        }
      }
      return { ...state, fileName: myFileName };
    case DELETE_FILE:
      let myFiles = [...state.files];
      let remainingFiles = myFiles.filter((el) => el.id !== action.payload.id);
      return { ...state, files: remainingFiles };
    case UPDATE_TOTAL_FILES:
      return { ...state, totalFiles: action.payload.totalFiles };
    case LOAD_INIT:
      return {
        ...state,
        files: action.payload.files,
        status: UploadStatus.FILES_UPLOADED,
        totalFiles: action.payload.files,
      };
    default:
      return state;
  }
}

export default AttachmentReducer;
