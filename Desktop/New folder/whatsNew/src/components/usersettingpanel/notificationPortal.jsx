import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  notificationPortal: {
    position: "absolute",
    background: theme.palette.background.default,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    zIndex: "1001",
    top: "50px",
    left: "165px",
    width: "320px",
    maxHeight: "680px",
    overflow: "hidden overlay",
  },
}));
const NotificationPortal = (props) => {
  const classes = useStyles();
  const content = (
    <div className={classes.notificationPortal}>{props.children}</div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("post-action_wrap")
  );
};
export default NotificationPortal;
