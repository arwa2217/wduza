import React from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import "./style.css";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../e-signature/sign-document/styles";

const VoidSuccessModal = (props) => {
  const history = useHistory();
  let currentUser = useSelector((state) => state.AuthReducer.user);
  // const redirectToHomePage = (open) => {
  //   setFinishModal(open);
  //   if (!open) {
  //     history.push("/home");
  //     removeAuthToken();
  //   }
  // };
  return (
    <Modal className={`finishModal void-success-modal`} show={true}>
      {/* <Modal.Header>
              <Modal.Title>
                <img src={logo} alt="" />
              </Modal.Title>
            </Modal.Header> */}
      <Modal.Body>
        <Row>
          <Col xs={12} className="cong-large-text">
            You declined to sign
          </Col>
          <Col xs={12} className="cong-text">
            We’ve notified the sender.
            <br /> If you have any qusetions, please contact them.
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="w-100 text-center">
            {currentUser.userType !== "INTERNAL" ? (
              <Button
                className="btn cong-btn"
                type="button"
                onClick={() => props.onHide(false)}
              >
                Visit our website
              </Button>
            ) : (
              <Button
                className="btn cong-btn"
                type="button"
                onClick={() => {
                  props.onHide(false);
                }}
              >
                Done
              </Button>
            )}
          </Col>
          {currentUser.userType !== "INTERNAL" ? (
            <Col
              xs={12}
              className={"cong-sign-in"}
              onClick={() => props.onHide(false)}
            >
              Sign In
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default VoidSuccessModal;
