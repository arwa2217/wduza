import { TOAST_SHOW, TOAST_HIDE } from "../actionTypes/toast-action-types";

const showToast = (message, delay, type) => {
  return {
    type: TOAST_SHOW,
    payload: {
      toastShow: true,
      toastMessage: message ? message : "",
      toastDelay: delay ? delay : 3000,
      type,
    },
  };
};

const hideToast = () => {
  return {
    type: TOAST_HIDE,
  };
};

export { showToast, hideToast };
