import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTypes from "../../../constants/modal/modal-type";
import { useDispatch } from "react-redux";
import "./create-channel-modal.css";
import ModalActions from "../../../store/actions/modal-actions";
import ChannelMemberActions from "../../../store/actions/channel-member-actions";
import Close from "../../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";

function DiscussionAdvanceCtrlModal(props) {
  const [show, setShow] = useState(props.show);
  const channel = props.channel;
  const { t } = useTranslation();
  const DELETE_FOR_ALL = "deleteForAll";
  const LOCK_AND_ARCHIVE = "LockArchive";

  const dispatch = useDispatch();

  const [confidentialityAgreed, setConfidentialityAgreed] = useState(
    channel.isConfidential
  );
  const [dataHandlingAction, setDataHandlingAction] = useState(
    channel.isLockable
      ? LOCK_AND_ARCHIVE
      : channel.isDeletable
      ? DELETE_FOR_ALL
      : "none"
  );

  const handleClose = () => {
    setShow(false);
    dispatch(ChannelMemberActions.resetAddChannelMember());
    dispatch(ModalActions.hideModal(ModalTypes.CREATE_DISCUSSION_ADVANCE_CTRL));
  };

  const handleCheckboxSelect = () => {
    setConfidentialityAgreed(!confidentialityAgreed);
  };

  const handleDataReset = () => {
    setDataHandlingAction("none");
  };

  const handleRadioSelect = (e) => {
    setDataHandlingAction(e.target.value);
  };

  const handleStartDiscussion = (e) => {
    e.preventDefault();
    channel.isConfidential = confidentialityAgreed;
    channel.isLockable = dataHandlingAction === LOCK_AND_ARCHIVE;
    channel.isDeletable = dataHandlingAction === DELETE_FOR_ALL;
    channel.isAdvance =
      channel.isConfidential || channel.isLockable || channel.isDeletable;

    const modalType = ModalTypes.CREATE_CHANNEL;
    const modalProps = {
      show: true,
      closeButton: true,
      channel: channel,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="create-channel-control-modal"
      centered
    >
      <ModalHeader>
        <button type="button" className="close" onClick={handleClose}>
          <span aria-hidden="true">
            <img src={Close} alt="" />
          </span>
          <span className="sr-only">
            {t("discussion:additional.controls:close")}
          </span>
        </button>
        <Modal.Title>{t("discussion:additional.controls:title")}</Modal.Title>
        <div className="sub-title">
          {t("discussion:additional.controls:subheading")}
        </div>
      </ModalHeader>
      <Modal.Body>
        <Form name="form">
          <div className="row">
            <div className="col-12">
              <div className="form-wrapper">
                <Form.Group className="form-group">
                  <Form.Label className="heading-label">
                    {t(
                      "discussion:additional.controls:confidentiality.agreement"
                    )}
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    className="discussion-agreement-checkbox"
                    label={t(
                      "discussion:additional.controls:require.all.to.collab.agreement"
                    )}
                    onChange={() => handleCheckboxSelect()}
                    checked={confidentialityAgreed}
                    value={confidentialityAgreed}
                  />
                </Form.Group>
                <Form.Group className="data-group">
                  <Form.Label className="heading-label">
                    {t("discussion:additional.controls:data.handling")}
                  </Form.Label>
                  <Form.Label
                    as="a"
                    className="heading-link"
                    onClick={() => handleDataReset()}
                  >
                    {t("discussion:additional.controls:reset")}
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  name="data-handling"
                  onChange={(e) => handleRadioSelect(e)}
                >
                  <span
                    className="append-to-label"
                    onClick={() => {
                      setDataHandlingAction(LOCK_AND_ARCHIVE);
                    }}
                  >
                    <Form.Check
                      type="radio"
                      className="discussion-agreement-checkbox"
                      label={t(
                        "discussion:additional.controls:lock.and.archive"
                      )}
                      name="data-handling"
                      checked={dataHandlingAction === LOCK_AND_ARCHIVE}
                      value={LOCK_AND_ARCHIVE}
                      onChange={() => {}}
                    />
                    <strong>
                      &nbsp;
                      {t("discussion:additional.controls:leaves.data.trail")}
                    </strong>
                  </span>
                  <ul
                    onClick={() => {
                      setDataHandlingAction(LOCK_AND_ARCHIVE);
                    }}
                  >
                    <li>
                      {t(
                        "discussion:additional.controls:owner.can.this.discussion"
                      )}
                    </li>
                    <li>
                      {t(
                        "discussion:additional.controls:locked.discussion.is.saved"
                      )}
                    </li>
                  </ul>
                  <span
                    className="append-to-label"
                    onClick={() => {
                      setDataHandlingAction(DELETE_FOR_ALL);
                    }}
                  >
                    <Form.Check
                      type="radio"
                      className="discussion-agreement-checkbox"
                      label={t("discussion:additional.controls:delete.for.all")}
                      checked={dataHandlingAction === DELETE_FOR_ALL}
                      value={DELETE_FOR_ALL}
                      name="data-handling"
                      onChange={() => {}}
                    />
                    <strong>
                      &nbsp;
                      {t(
                        "discussion:additional.controls:protects.extremely.sensitive.data"
                      )}
                    </strong>
                  </span>
                  <ul
                    onClick={() => {
                      setDataHandlingAction(DELETE_FOR_ALL);
                    }}
                  >
                    <li>
                      {t("discussion:additional.controls:owner.can.delete")}
                    </li>
                    <li>
                      {t(
                        "discussion:additional.controls:deleted.discussion.is.lost"
                      )}
                    </li>
                  </ul>
                </Form.Group>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <button
          onClick={handleStartDiscussion}
          className="btn px-5 start-discussion"
        >
          {t("button:continue")}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DiscussionAdvanceCtrlModal;
