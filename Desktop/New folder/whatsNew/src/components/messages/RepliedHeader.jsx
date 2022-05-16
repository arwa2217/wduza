import React from "react";
import RepliedIcon from "../../assets/icons/v2/ic_reply_icon.svg";
import { makeStyles } from "@material-ui/core";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import CommonUtils from "../utils/common-utils";
import { useDispatch, useSelector } from "react-redux";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: "14px",
    cursor: "pointer",
    "& .replied-image-wrapper": {
      width: 36,
      minWidth: 36,
      marginRight: 14,
      textAlign: "center",
    },
    "& .image": {
      width: "20px",
      height: "19px",
    },
    "& .repliedInfo": {
      display: "flex",
      flexDirection: "column",
      width: " 95%",
      "& .name": {
        color: theme.palette.text.primary,
        fontSize: "12px",
        lineHeight: "100%",
        fontWeight: "700",
        paddingBottom: "5px",
      },
      "& .preview-message": {
        color: theme.palette.text.black70,
        fontSize: "12px",
        lineHeight: "100%",
        fontWeight: "400",
        height: 15,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        "& p": {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
    },
  },
}));
function RepliedHeader(props) {
  const classes = useStyles();
  let currentChannelId = useSelector(
    (state) => state.config.activeSelectedChannel?.id
  );
  let currentChannelName = useSelector(
    (state) => state.config.activeSelectedChannel?.name
  );

  const dispatch = useDispatch();
  const handleClickReplied = (parent) => {
    const { id } = parent;
    // const parentElement = document.getElementById(id);
    // const clientRect = parentElement.getBoundingClientRect();
    // const y = clientRect.top;
    // const main = document.getElementById("messages-div");
    // main.scrollTo({
    //   top: y + main.scrollTop - 140,
    //   behavior: "smooth",
    // });
    props.CheckRedirectionStatus(props.parent);
    // props.handleReplyClick(id);
    CommonUtils.performNotificationAction(
      currentChannelName,
      "channel",
      "replied",
      currentChannelId,
      id,
      id,
      dispatch
    );
  };
  return (
    <div
      className={classes.root}
      onClick={() => handleClickReplied(props.parent)}
    >
      <div className="replied-image-wrapper">
        <img src={RepliedIcon} alt="replied-icon" className="image" />
      </div>
      <div className="repliedInfo">
        {props?.parent?.creatorName && (
          <span className="name">Replied to {props.parent.creatorName}</span>
        )}
        <span className="preview-message">
          <div
            dangerouslySetInnerHTML={{
              __html: props?.parent?.previewText,
            }}
          />
        </span>
      </div>
    </div>
  );
}
export default RepliedHeader;
