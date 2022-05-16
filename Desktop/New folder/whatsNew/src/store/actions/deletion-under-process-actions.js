import {
  SHOW_DELETION_MODAL,
  HIDE_DELETION_MODAL,
  SHOW_DELETION_FOOTER,
} from "../actionTypes/deleteion-under-process-action-types";

const showDeletionUnderProcess = () => {
  return {
    type: SHOW_DELETION_MODAL,
  };
};

const hideDeletionUnderProcess = () => {
  return {
    type: HIDE_DELETION_MODAL,
  };
};

const showDeletionFooter = () => {
  return {
    type: SHOW_DELETION_FOOTER,
  };
};

export {
  showDeletionUnderProcess,
  hideDeletionUnderProcess,
  showDeletionFooter,
};
