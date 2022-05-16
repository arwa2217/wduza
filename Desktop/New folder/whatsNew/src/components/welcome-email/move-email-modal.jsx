import React, { useState } from "react";
import {
  Button,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import moveExpandIcon from "../../assets/icons/move-emails-icon.svg";
import { mailFolders as mailFoldersDefault } from "../../outlook/config";
import Modal from "react-bootstrap/Modal";
import { Alert } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  expandIcon: {
    minWidth: "25px",
  },
  title: {
    fontSize: "20px!important",
    lineHeight: "23px!important",
    color: "#19191A!important",
    fontWeight: "500!important",
  },
  expandTitle: {
    paddingLeft: "22px",
    cursor: "pointer",
    color: "#666666!important",
    height: "25px!important",
  },
  listItem: {
    cursor: "pointer",
    padding: "5px 0 5px 50px!important",
    color: "#666666!important",
    "&.active": {
      color: "#03BD5D!important",
    },
  },
  cancelButton: {
    backgroundColor: "#999999",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    border: "none",
    "&:hover": {
      backgroundColor: "#999999",
      color: "#fff",
      outline: "none",
      border: "none",
    },
    textTransform: "capitalize",
  },
  okButton: {
    backgroundColor: "#03BD5D",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    border: "none",
    marginLeft: "10px",
    "&:hover": {
      backgroundColor: "#03BD5D",
      color: "#fff",
      outline: "none",
      border: "none",
    },
    textTransform: "capitalize",
  },
});
const MoveEmailModal = (props) => {
  const {
    handleCancelMove,
    show,
    emailsSelected,
    selectedFolder,
    setSelectedFolder,
    handleMoveEmail,
  } = props;
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const currentMailFolder = useSelector(
    (state) => state.OutlookMailReducer?.currentMailFolder
  );
  const mailFolders = mailFoldersDefault
    .filter((item) => item.isCanMove)
    .filter((item) => item.value !== currentMailFolder);
  const classes = useStyles();
  const { t } = useTranslation();

  const handleSelect = (mailFolder) => {
    setSelectedFolder(mailFolder);
    setError("");
  };
  const handleMove = () => {
    if (selectedFolder === "") {
      setError(t(`outlook.mail.validate:attach.max.size`));
      return;
    }
    handleMoveEmail();
  };
  const handleCancel = () => {
    setError("");
    setSelectedFolder("");
    handleCancelMove();
  };
  return (
    <Modal
      show={show}
      className="members-profile"
      onHide={handleCancelMove}
      animation={false}
      style={{
        padding: "40px 35px 30px 35px",
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className={classes.title}>
          Move {emailsSelected?.length} Emails
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <ListItem
            disablePadding
            className={classes.expandTitle}
            onClick={() => setOpen(!open)}
          >
            <ListItemIcon className={classes.expandIcon}>
              <img src={moveExpandIcon} alt="expand-move-items" />
            </ListItemIcon>
            <ListItemText primary="OutLook mail" />
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List>
              {mailFolders?.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  className={`${classes.listItem} ${
                    selectedFolder === item.value ? "active" : ""
                  }`}
                  onClick={() => handleSelect(item.value)}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
            {error && (
              <Alert variant="outlined" severity="error" className="mb-4">
                {error}
              </Alert>
            )}
          </Collapse>
          <div className="d-flex w-100 justify-content-end pr-4 mb-4">
            <Button
              variant="outlined"
              className={classes.cancelButton}
              onClick={() => handleCancel()}
            >
              {t("outlook.mail.action.multiple:cancel")}
            </Button>
            <Button
              variant="contained"
              className={classes.okButton}
              onClick={handleMove}
            >
              {t("outlook.mail.action.multiple:ok")}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default MoveEmailModal;
