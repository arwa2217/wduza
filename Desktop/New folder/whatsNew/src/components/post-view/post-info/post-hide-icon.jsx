import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import CloseIcon from "../../../assets/icons/close.svg";
import iconPostHide from "../../../assets/icons/v2/ic_hide.svg";
import iconPostUnhide from "../../../assets/icons/v2/ic_show.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { HideUnHideModal } from "./hide-unhide-modal-style";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import SVG from "react-inlinesvg";
function PostHideIcon(props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openUnhide, setOpenUnhide] = useState(false);
  const handleChange = (e, value) => {
    const storage = window.localStorage;
    storage.setItem("hidePostPopup", value.checked);
  };
  const handleCancel = () => {
    const storage = window.localStorage;
    storage.setItem("hidePostPopup", false);
    setOpen(false);
  };
  const handleCancelForUnhide = () => {
    const storage = window.localStorage;
    storage.setItem("unHidePostPopup", false);
    setOpenUnhide(false);
  };

  const handleUnhideChange = (e, value) => {
    const storage = window.localStorage;
    storage.setItem("unHidePostPopup", value.checked);
  };
  const handleOnClick = () => {
    props.onHideClick();
    setOpen(false);
  };
  const handleOnUnhideClick = () => {
    props.onUnhideClick();
    setOpenUnhide(false);
  };

  const handleHide = () => {
    if (JSON.parse(localStorage.getItem("hidePostPopup")) === true) {
      props.onHideClick();
    } else {
      setOpen(true);
    }
  };
  const handleUnhide = () => {
    if (JSON.parse(localStorage.getItem("unHidePostPopup")) === true) {
      props.onUnhideClick();
    } else {
      setOpenUnhide(true);
    }
  };

  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 150, hide: 100 }}
        trigger={["hover", "focus"]}
        overlay={
          <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
            {props.postInfo.isHiddenPost
              ? t("postInfo:tooltip.unhide.post")
              : t("postInfo:tooltip.hide.post")}
          </Tooltip>
        }
      >
        {props.postInfo && props.postInfo.isOwner ? (
          props.postInfo.isHiddenPost ? (
            <button
              className="dropdown-toggle btn btn-light"
              onClick={handleUnhide}
            >
              <span className="icon-action unhide">
                <SVG src={iconPostHide} />
                <span style={{ paddingLeft: "7px" }}> Show</span>
              </span>
            </button>
          ) : (
            <button
              className="dropdown-toggle btn btn-light"
              onClick={handleHide}
            >
              <span className="icon-action">
                <SVG src={iconPostUnhide} />
                <span style={{ paddingLeft: "7px" }}> Hidden</span>
              </span>
            </button>
          )
        ) : (
          <button className="dropdown-toggle btn btn-light disabled">
            <span className="icon-action">
              <SVG src={iconPostUnhide} />
              <span style={{ paddingLeft: "7px" }}> Hidden</span>
            </span>
          </button>
        )}
      </OverlayTrigger>
      <HideUnHideModal show={open}>
        <Modal.Header>
          <div className="hide-post-content-color">
            <span>{t("post:post.hide.modal:content.heading")}</span>
            <img
              alt="Close"
              src={CloseIcon}
              onClick={() => {
                handleCancel();
              }}
            />
          </div>
        </Modal.Header>
        <Modal.Body className="p-0">
          <p className="hide-post-content-color">
            {t("post:post.hide.modal:content.description")}
          </p>
          <Checkbox
            onChange={(e, value) => handleChange(e, value)}
            label={t("post:post.modal:label")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="m-0 cancel-button" onClick={() => handleCancel()}>
            {t("post:post.modal:cancel")}
          </Button>
          <Button
            className="m-0 edit-button"
            onClick={
              props.postInfo.isHiddenPost
                ? (e) => handleOnUnhideClick(e)
                : (e) => handleOnClick(e)
            }
          >
            <p className="edit-text-post">{t("post:post.hide.modal:hide")}</p>
          </Button>
        </Modal.Footer>
      </HideUnHideModal>
      <HideUnHideModal show={openUnhide}>
        <Modal.Header>
          <div className="hide-post-content-color">
            <span>{t("post:post.hide.modal:content.hide.heading")}</span>
            <img
              alt="Close"
              src={CloseIcon}
              onClick={() => {
                handleCancelForUnhide();
              }}
            />
          </div>
        </Modal.Header>

        <Modal.Body className="p-0">
          <p className="hide-post-content-color">
            {t("post:post.hide.modal:content.hide.description")}
          </p>
          <Checkbox
            onChange={(e, value) => handleUnhideChange(e, value)}
            label={t("post:post.modal:label")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="m-0 cancel-button"
            onClick={() => handleCancelForUnhide()}
          >
            {t("post:post.modal:cancel")}
          </Button>
          <Button
            className="m-0 edit-button"
            onClick={
              props.postInfo.isHiddenPost
                ? (e) => handleOnUnhideClick(e)
                : (e) => handleOnClick(e)
            }
          >
            <p className="edit-text-post">{t("post:post.hide.modal:unhide")}</p>
          </Button>
        </Modal.Footer>
      </HideUnHideModal>
    </>
  );
}
export default PostHideIcon;
