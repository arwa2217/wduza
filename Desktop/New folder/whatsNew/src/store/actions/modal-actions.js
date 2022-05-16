import ModalConstants from "../../constants/modal/modal-constants";

function showModal(mType, mProps) {
  console.log(
    "ModalAction showModal: modalType=" + mType + " , modalProps=" + mProps
  );
  return (dispatch) => {
    dispatch({
      type: ModalConstants.SHOW_MODAL,
      modalType: mType,
      modalProps: mProps,
    });
  };
}

function hideModal(mType) {
  console.log("ModalAction hideModal: modalType=" + mType);
  return (dispatch) => {
    dispatch({
      type: ModalConstants.HIDE_MODAL,
      modalType: mType,
    });
  };
}

const ModalActions = {
  showModal,
  hideModal,
};

export default ModalActions;
