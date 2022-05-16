import ModalConstants from "../../constants/modal/modal-constants";

const ModalReducer = (state = {}, action) => {
  switch (action.type) {
    case ModalConstants.SHOW_MODAL:
      return {
        ...state,
        modalType: action.modalType || action.payload.modalType,
        modalProps: action.modalProps || action.payload.modalProps,
      };
    case ModalConstants.HIDE_MODAL:
      return {
        ...state,
        modalType: null,
        modalProps: {},
      };
    default:
      return state;
  }
};

export default ModalReducer;
