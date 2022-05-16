import React from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "../../assets/icons/close.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { NonMemberModal } from "../post-view/post-info/post-forward-modal-style";

function PostForwardRedirectionModal(props) {
  const [open, setOpen] = React.useState(props.fwdPopup);
  const { t } = useTranslation();

  return (
    <>
      <NonMemberModal show={open} className="forward-post">
        <Modal.Header>
          <div className="hide-post-content-color">
            <span>{t("post.forward.redirection:heading")}</span>
            <img
              alt="Close"
              src={CloseIcon}
              onClick={() => {
                props.togglePopup();
              }}
            />
          </div>
        </Modal.Header>

        <Modal.Body>
          <p className="hide-post-content-color">
            {t("post.forward.redirection:description")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="edit-button" onClick={(e) => props.togglePopup()}>
            <p className="edit-text-post">OK</p>
          </Button>
        </Modal.Footer>
      </NonMemberModal>
    </>
  );
}
export default PostForwardRedirectionModal;
