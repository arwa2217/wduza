import React from "react";
import Toast from "react-bootstrap/Toast";
import Close from "../../../assets/icons/close.svg";

const Snackbar = (props) => {
  const { show, handleClose, message } = props;

  return (
    <Toast
      show={show}
      key={"1"}
      onClose={() => handleClose(false)}
      autohide
      delay={10000}
      style={{
        display: "flex",
        maxWidth: "100vw",
        margin: "0 auto",
        left: "0",
        right: "0",
        marginTop: "10px",
        backgroundColor: "#F16354",
        textAlign: "center",
        position: "absolute",
        zIndex: "99999",
        bottom: "0",
      }}
    >
      <Toast.Body
        style={{ flex: "auto", color: "white", padding: "12px 0 !important" }}
      >
        {message}
      </Toast.Body>
      <img
        style={{
          marginLeft: "30px",
          width: "25px",
          height: "17px",
          position: "initial",
          marginTop: "5px",
          cursor: "pointer",
          display: "none",
        }}
        src={Close}
        className="rounded mr-2"
        alt="close"
        onClick={() => handleClose(false)}
      />
    </Toast>
  );
};

export default Snackbar;
