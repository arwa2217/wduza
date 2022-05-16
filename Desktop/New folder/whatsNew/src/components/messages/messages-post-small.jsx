import React, { useEffect, useRef } from "react";
import attachIcon from "../../assets/icons/v2/ic_attach_inactive.svg";
import sendIcon from "../../assets/icons/v2/ic_send_small.svg";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { clearTyping } from "../../store/actions/user-typing-actions";

const useStyles = makeStyles((theme) => ({
  messagePostSmall: {
    "&:hover": {
      cursor: "text",
    },
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));
function MessagePostSmall(props) {
  const userTypingRef = useRef(null);
  const classes = useStyles();
  const { setMinEditor } = props;
  const UserDetails = useSelector(
    (state) => state.userTypingReducer.userTypingData
  );
  const dispatch = useDispatch();

  function clearUserTypingEvent(e) {
    clearTimeout(userTypingRef.current);
  }

  function OnUserTypingEvent(e) {
    clearUserTypingEvent();
    userTypingRef.current = setTimeout(() => {
      dispatch(clearTyping());
    }, 3000);
  }

  useEffect(() => {
    if (UserDetails && UserDetails.channelId) {
      OnUserTypingEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserDetails.channelId]);

  const handleFileClick = () => {
    props.refAttachmentFileButton.current.click();
  };

  return (
    <>
      {!props.isReply &&
        !props.isTaskModal &&
        !props.isPostForwardModal &&
        !props.isFileForwardModal &&
        !props.isShareFilesModal && (
          <>
            {UserDetails && UserDetails.channelId ? (
              <p className="user-typing-min">
                {`${UserDetails.userName} is typing...`}
              </p>
            ) : (
              ""
            )}
          </>
        )}
      <div
        className={classNames(
          "message-post-small d-flex justify-content-between w-100 h-100 align-items-center",
          classes.messagePostSmall
        )}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setMinEditor(false);
        }}
      >
        <div className="message-post-small-attach">
          <SVG
            src={attachIcon}
            className={classNames("menu-icon", classes.icon)}
            onClick={handleFileClick}
          />
        </div>
        <div className="message-post-small-send">
          <SVG
            src={sendIcon}
            className={classNames("menu-icon", classes.icon)}
          />
        </div>
      </div>
    </>
  );
}

export default MessagePostSmall;
