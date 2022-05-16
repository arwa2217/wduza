import React, { useRef } from "react";
import { Button, Checkbox, Header, Modal } from "semantic-ui-react";
import iconPostEdit from "../../../assets/icons/v2/ic_edit.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
function PostEditModal(props) {
  const [open, setOpen] = React.useState(false);
  const checkValue = useRef(null);

  const { t } = useTranslation();

  const handleChange = (e, value) => {
    if (value.checked) {
      const storage = window.localStorage;
      storage.setItem("editPostPopup", "true");
      checkValue.current = storage.getItem("editPostPopup");
    }
  };
  const handleOnClick = (e) => {
    e.preventDefault();
    props.onEditClick(e);
    setOpen(false);
  };
  return (
    <Modal
      closeIcon={
        <Button
          style={{ background: "none", float: "right", marginTop: "10px" }}
        >
          <img alt="Close" src={CloseIcon} />
        </Button>
      }
      open={open}
      className="post-edit"
      trigger={
        <button
          className="btn-shadow-none btn"
          style={{
            width: "120px",
            display: "flex",
            alignItems: "center",
            margin: "0",
            padding: 0,
          }}
        >
          <span className="icon-action edit-post">
            <SVG src={iconPostEdit} />
            <span style={{ paddingLeft: "10px" }}>Edit</span>
          </span>
        </button>
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header content={t("post:post.modal:content.heading")} />

      <Modal.Content>
        <p>{t("post:post.modal:content.description")}</p>
        <Checkbox
          onChange={(e, value) => handleChange(e, value)}
          label={t("post:post.modal:label")}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button className="cancel-button" onClick={() => setOpen(false)}>
          <p className="cancel-text">{t("post:post.modal:cancel")}</p>
        </Button>
        <Button className="edit-button" onClick={(e) => handleOnClick(e)}>
          <p className="edit-text-post">{t("post:post.modal:edit")}</p>
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default PostEditModal;
