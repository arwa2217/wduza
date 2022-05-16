import { TOAST_SHOW, TOAST_HIDE } from "../actionTypes/toast-action-types";

const initialState = {
  toastShow: false,
  toastMessage: "",
  toastDelay: 3000,
  toastType: "failure",
};
const ToastReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOAST_SHOW:
      return {
        ...state,
        toastShow: action.payload?.toastShow
          ? action.payload?.toastShow
          : false,
        toastMessage: action.payload?.toastShow
          ? action.payload?.toastMessage
          : false,
        toastDelay: action.payload?.toastShow
          ? action.payload?.toastDelay
          : false,
        toastType: action.payload?.toastShow
          ? action.payload?.type
            ? action.payload.type
            : initialState.toastType
          : false,
      };
    case TOAST_HIDE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default ToastReducer;
