import {
  SHOW_ARCHIVAL_MODAL,
  HIDE_ARCHIVAL_MODAL,
} from "../actionTypes/archival-under-process-action-types";

const showArchivalUnderProcess = () => {
  return {
    type: SHOW_ARCHIVAL_MODAL,
  };
};

const hideArchivalUnderProcess = () => {
  return {
    type: HIDE_ARCHIVAL_MODAL,
  };
};

export { showArchivalUnderProcess, hideArchivalUnderProcess };
