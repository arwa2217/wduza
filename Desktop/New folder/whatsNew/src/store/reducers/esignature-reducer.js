import { SignatureState } from "../../components/e-signature/constants";
import { ITEM_COUNT } from "../../constants";
import {
  FETCH_ESIGNATURE_LIST,
  FETCH_ESIGNATURE_LIST_SUCCESS,
  SET_ESIGN_FILE_INFO,
  SET_ESIGN_RECIPIENT_LIST,
  SAVE_PRIVATE_MSG,
  SET_ESIGN_RECIPIENT_ORDER,
  SET_ESIGNATURE_FOLDER,
  SET_ESIGNATURE_TAB,
  SET_RECIPIENT_LIST,
  SET_SELECTED_ROWS,
  SET_ESIGN_ATTACHMENT,
  SET_ANNOTATIONS,
  SWITCH_PANEL_VIEW,
  TOGGLE_TOPBAR_BUTTON,
  FETCH_ESIGNATURE_SUMMARY_SUCCESS,
  SAVE_ESIGN_PREPARE_FILE,
  FETCH_ESIGNATURE_SUMMARY_RECIPIENTS_SUCCESS,
  FETCH_ESIGNATURE_SUMMARY_HISTORY_SUCCESS,
  ESIGN_ORDER_ENABLED,
  ESIGN_SEARCH_REQUEST,
  ESIGN_SEARCH_SUCCESS,
  ESIGN_SEARCH_ERROR,
  ESIGN_SEARCH_CLEAR,
} from "../actionTypes/esignature-action-types";

const initialState = {
  esignatureList: [],
  esignatureFolderSelected: "INBOX",
  esignatureTabSelected: "ALL",
  showTopBarButtons: false,
  selectedEsignRows: [],
  signatureState: SignatureState.DEFAULT,
  recipientList: [],
  esignatureSummaryData: {},
  esignPreparedFile: null,
  esignatureSummaryRecipients: [],
  esignatureSummaryHistory: [],
  isOrderEnabled: false,
  annotationType: "",
  fileData: null,
  privateMsgList: [],
  searchEnabled: false,
  searchTerm: "",
  searchCount: 0,
  searchResultData: [],
  searchFilters: { field: "all", date: "any", page: 1, size: ITEM_COUNT },
};

const updatePrivateMsgData = (data, statePrivateMsgList) => {
  if (statePrivateMsgList) {
    let msgAlreadyExist = false;
    let matchIndex = -1;

    var index;
    for (index = 0; index < statePrivateMsgList.length; index++) {
      var msg = statePrivateMsgList[index];
      if (msg?.email === data?.email) {
        matchIndex = index;
        msgAlreadyExist = true;
        break;
      }
    }

    if (msgAlreadyExist) {
      statePrivateMsgList[matchIndex] = data;
    } else {
      statePrivateMsgList.push(data);
    }
  }
  return statePrivateMsgList;
};
const esignatureReducer = (state = { ...initialState }, action) => {
  let statePrivateMsgList = state.privateMsgList;
  switch (action.type) {
    case FETCH_ESIGNATURE_LIST:
      return {
        ...state,
        esignatureList: [],
        allCount: 0,
        needToSignCount: 0,
        // selectedEsignRows: [],
        // recipientList: [],
        // showTopBarButtons: false,
        // esignatureSummaryRecipients: [],
        // esignatureSummaryHistory: [],
      };
    case FETCH_ESIGNATURE_LIST_SUCCESS:
      return {
        ...state,
        esignatureList: action.payload?.data?.result
          ? {
              list: action.payload?.data?.result,
              allCount: action.payload?.data?.filteredCount,
              needToSignCount: action.payload?.data?.needToSignCount,
            }
          : { list: [], allCount: 0, needToSignCount: 0 },
      };
    case SET_ESIGNATURE_FOLDER:
      return {
        ...state,
        esignatureFolderSelected: action.payload,
      };
    case SAVE_PRIVATE_MSG:
      return {
        ...state,
        privateMsgList: updatePrivateMsgData(
          action.payload,
          statePrivateMsgList
        ),
      };
    case SET_ESIGNATURE_TAB:
      return {
        ...state,
        esignatureTabSelected: action.payload,
      };
    case TOGGLE_TOPBAR_BUTTON:
      return {
        ...state,
        showTopBarButtons: action.payload,
      };
    case SET_ANNOTATIONS:
      return {
        ...state,
        annotationType: action.payload,
      };
    case SET_ESIGN_ATTACHMENT:
      return {
        ...state,
        fileData: action.payload,
      };
    case SET_SELECTED_ROWS:
      let showTopBarButtons = false;
      if (action.payload?.length > 0) {
        showTopBarButtons = true;
      }
      return {
        ...state,
        selectedEsignRows: action.payload,
        showTopBarButtons,
      };
    case SWITCH_PANEL_VIEW:
      return {
        ...state,
        signatureState: action.payload.panelView,
      };
    case SET_ESIGN_RECIPIENT_LIST:
      return {
        ...state,
        recipientList: action.payload.recipientList,
      };
    case SET_ESIGN_RECIPIENT_ORDER:
      return {
        ...state,
        recipientOrder: action.payload.recipientOrder,
      };
    case SET_ESIGN_FILE_INFO:
      return {
        ...state,
        fileInfo: action.payload.fileInfo,
      };
    case FETCH_ESIGNATURE_SUMMARY_SUCCESS:
      return {
        ...state,
        esignatureSummaryData: action.payload?.data,
      };
    case SAVE_ESIGN_PREPARE_FILE:
      return {
        ...state,
        esignPreparedFile: action.payload.file,
      };
    case FETCH_ESIGNATURE_SUMMARY_RECIPIENTS_SUCCESS:
      return {
        ...state,
        esignatureSummaryRecipients: action.payload?.data?.result,
      };
    case FETCH_ESIGNATURE_SUMMARY_HISTORY_SUCCESS:
      return {
        ...state,
        esignatureSummaryHistory: action.payload?.data?.history,
      };
    case ESIGN_ORDER_ENABLED:
      return {
        ...state,
        isOrderEnabled: action.payload,
      };

    case ESIGN_SEARCH_REQUEST:
      return {
        ...state,
      };
    case ESIGN_SEARCH_SUCCESS:
      let payload = action.payload;
      return {
        ...state,
        searchEnabled: true,
        searchTerm: payload.data.term,
        searchCount: payload.data.count,
        searchFilters: payload.searchFilter.filterData,
        searchResultData: payload?.data?.result
          ? {
              list: payload?.data?.result,
              allCount: payload?.data?.count,
            }
          : {
              list: [],
              allCount: 0,
            },
      };
    case ESIGN_SEARCH_ERROR:
      return {
        ...state,
        searchEnabled: false,
      };
    case ESIGN_SEARCH_CLEAR:
      return {
        ...state,
        searchEnabled: false,
        searchTerm: "",
        searchCount: 0,
        searchFilters: { field: "all", date: "any", page: 1, size: ITEM_COUNT },
        searchResultData: [],
      };
    default:
      return state;
  }
};

export default esignatureReducer;
