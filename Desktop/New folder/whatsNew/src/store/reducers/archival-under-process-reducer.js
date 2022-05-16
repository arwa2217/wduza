import {
  SHOW_ARCHIVAL_MODAL,
  HIDE_ARCHIVAL_MODAL,
} from "../actionTypes/archival-under-process-action-types";

const initialState = {
  showArchivingModal: false,
};
const ArchivalUnderProcessReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ARCHIVAL_MODAL:
      return {
        ...state,
        showArchivingModal: true,
      };
    case HIDE_ARCHIVAL_MODAL:
      return {
        ...state,
        showArchivingModal: false,
      };
    default:
      return state;
  }
};

export default ArchivalUnderProcessReducer;
