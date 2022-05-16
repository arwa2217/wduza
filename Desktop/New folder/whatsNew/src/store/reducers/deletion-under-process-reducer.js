import {
  SHOW_DELETION_MODAL,
  HIDE_DELETION_MODAL,
  SHOW_DELETION_FOOTER,
} from "../actionTypes/deleteion-under-process-action-types";

const initialState = {
  showDeletingModal: false,
  showFooter: true,
};
const DeletionUnderProcessReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_DELETION_MODAL:
      return {
        ...state,
        showDeletingModal: true,
        showFooter: true,
      };
    case HIDE_DELETION_MODAL:
      return {
        ...state,
        showDeletingModal: false,
        showFooter: true,
      };
    case SHOW_DELETION_FOOTER:
      return {
        ...state,
        showDeletingModal: true,
        showFooter: false,
      };
    default:
      return state;
  }
};

export default DeletionUnderProcessReducer;
