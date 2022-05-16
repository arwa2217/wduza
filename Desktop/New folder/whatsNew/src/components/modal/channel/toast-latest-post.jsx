import React from "react";
import Toast from "react-bootstrap/Toast";
import "./toast-latest-post.css";
import BackToBottom from "../../../assets/icons/back-to-bottom.svg";

const Snackbar = (props) => {
  const { show, message, handleClick, handleClose } = props;

  return (
    <Toast
      show={show}
      key={"1"}
      onClose={() => handleClose(false)}
      autohide
      delay={5000}
      className="toast"
    >
      <Toast.Body className="toast-body">{message}</Toast.Body>
      <img
        src={BackToBottom}
        className="rounded mr-2 toast-image"
        alt="close"
        onClick={() => handleClick()}
      />
    </Toast>
  );
};

export default Snackbar;
