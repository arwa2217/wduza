import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import ModalActions from "../../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";
import { resetCreateChannelAction } from "../../../store/actions/channelActions";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { cleanUserListState } from "../../../store/actions/user-actions";
import Close from "../../../assets/icons/close.svg";
import monolyIcon from "../../../assets/icons/monoly-icon-title.svg";
import "./guest-file-share-modal.css";
import UserService from "../../../services/user-service";
import { useHistory } from "react-router";

function PassCodeModal(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [show, setShow] = useState(true);
  const [passCode, setPassCode] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const creatingChannel = useSelector(
    (state) => state.ChannelReducer.creatingChannel
  );
  const handleClose = () => {
    setShow(false);
    dispatch(cleanUserListState());
    dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal("xyz"));
    history.push("/home");
  };

  const handleNext = (e) => {
    setError(false);
    e.preventDefault();
    let result = UserService.sharedGuestFiles({
      passCode,
      postObj: props.params,
    });
    result
      .then((res) => {
        props.onSuccess(res.data);
      })
      .catch((error) => {
        // props.onFailure();
        setError(true);
      });
  };

  const getRemainingTime = (expiryDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(expiryDate);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays;
  };

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="guest-file-share-modal"
        centered
      >
        <ModalHeader>
          <img src={monolyIcon} alt="" />
          <button type="button" class="close" onClick={handleClose}>
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <p className="email-msg">
              {t(
                props.fileData?.count > 1
                  ? "files:guestFilesShare.download.prefix"
                  : "files:guestFileShare.download.prefix",
                {
                  inviter: props.fileData?.inviterName,
                  count: props.fileData?.count,
                }
              )}
              <b>{props.fileData?.invitee}</b>
              {t(
                props.fileData?.count > 1
                  ? "files:guestFilesShare.download.prefix"
                  : "files:guestFileShare.download.prefix"
              )}
            </p>
            <p className="time-remaining">
              <time
                className="post__time"
                dateTime={new Date(
                  props.fileData?.fileExpiry * 1000
                ).toISOString()}
                title={new Date(props.fileData?.fileExpiry * 1000)}
              >
                {t("files:guestFileShare.expire", {
                  time: new Date(props.fileData?.fileExpiry * 1000),
                })}
              </time>

              {t(
                getRemainingTime(props.fileData?.fileExpiry * 1000) > 1
                  ? "files:guestFileShare.daysRemaining"
                  : "files:guestFileShare.dayRemaining",
                { days: getRemainingTime(props.fileData?.fileExpiry * 1000) }
              )}
            </p>
          </div>
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Label>{t("passcode.modal:passcode.label")}</Form.Label>
                  <Form.Group className="m-0">
                    <InputGroup className="folder-input-field char-counter-wrapper">
                      <Form.Control
                        type="password"
                        name="description"
                        className={"pr-5"}
                        placeholder={t("passcode.modal:passcode.placeholder")}
                        onChange={(e) => setPassCode(e.target.value)}
                      />
                    </InputGroup>
                    {error && (
                      <div className="invalid-feedback">
                        {t("files:passcode.invalid")}
                      </div>
                    )}
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button className="download-btn" onClick={handleNext}>
            {creatingChannel && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Next
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PassCodeModal;
