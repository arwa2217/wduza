import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import styled from "styled-components";
import info from "../../assets/icons/info-white.svg";
import { hideToast } from "../../store/actions/toast-modal-actions";
import { useDispatch } from "react-redux";

const ToastWrapper = styled.div`
  position: fixed;
  top: 40px;
  left: ${(props) => props.leftValue}px;
  z-index: 1200;

  .toast {
    max-width: 660px;
    min-width: 100px;
    width: ${(props) => props.widthValue}px;
    min-height: 50px;
    // max-height: 50px;
    // height: 50px;
    background-color: ${({ type }) =>
      type === "failure" ? "#f36e3a" : type === "success" ? "#03BD5D" : ""};
    color: #ffffff;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-items: center;
  }
  .toast-body{
    display: flex;
    align-items: flex-start;

    .toast-info {
      width: 24px;
      height: 24px;
    }
    .toast-text {
      padding-left: 5px;
      line-height: 24px;
    }
  }
  
`;

function ErrorToast(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const updateMedia = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => {
      window.removeEventListener("resize", updateMedia);
    };
  }, []);

  return (
    <ToastWrapper
      leftValue={windowWidth * 0.27}
      widthValue={windowWidth * 0.46}
      type={(props.show && props.type).toString()}
    >
      <Toast
        show={props.show}
        onClose={() => dispatch(hideToast())}
        delay={props.delay}
        autohide
      >
        <Toast.Body>
          <img src={info} className="toast-info" alt="" />{" "}
          <span className="toast-text">{props.errorMessage}</span>
        </Toast.Body>
      </Toast>
    </ToastWrapper>
  );
}

export default ErrorToast;
