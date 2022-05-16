import React, { useEffect, useState } from "react";
import FowardedIcon from "../../assets/icons/v2/ic_forward_new.svg";
import { makeStyles } from "@material-ui/core";
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
      width: "19px",
      height: "17px",
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

function FowardHeader(props) {
  const classes = useStyles();
  const [previewForwarded, setPreviewForWarded] = useState("");

  useEffect(() => {
    if (props?.forwardedPost?.post?.content === "") {
      if (props?.forwardedPost.fileListIDs) {
        setPreviewForWarded(
          `${props?.forwardedPost?.user?.displayName} uploads ${props?.forwardedPost?.fileListIDs.length} files`
        );
      } else if (props?.forwardedPost?.post_type === "TASK") {
        setPreviewForWarded(
          `${props?.forwardedPost?.user?.displayName} create a task`
        );
      }
    } else {
      setPreviewForWarded(props?.forwardedPost?.post?.content);
    }
  }, [props]);
  const handleClickForwarded = () => {
    // const {id} = props.forwardedPost?.post;
    // const parentElement = document.getElementById(id)

    // const clientRect = parentElement.getBoundingClientRect();
    // const y = clientRect.top;
    // const main = document.getElementById("messages-div");
    // main.scrollTo({
    //   top: y + main.scrollTop - 140,
    //   behavior: 'smooth',
    // }, 2000);
    props.CheckRedirectionStatus(props.forwardedPost);
  };
  return (
    <div className={classes.root} onClick={() => handleClickForwarded()}>
      <div className="replied-image-wrapper">
        <img src={FowardedIcon} alt="replied-icon" className="image" />
      </div>
      <div className="repliedInfo">
        {/* {props.forwardedPost?.user?.displayName && (<span className="name">{`${props.forwardedPost?.task?.taskAssignee ? 'Assign Task': 'Forwarded from'}`} {props.forwardedPost?.task?.taskAssignee ? '':props.forwardedPost?.user?.displayName}</span>)} */}
        {props.forwardedPost?.user?.displayName && (
          <span className="name">
            Forwarded from {props?.forwardedPost?.user?.displayName}
          </span>
        )}

        <span className="preview-message">
          <div
            dangerouslySetInnerHTML={{
              __html: previewForwarded,
            }}
          />
        </span>
      </div>
    </div>
  );
}
export default FowardHeader;
