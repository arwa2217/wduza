import React from "react";
import { useTranslation } from "react-i18next";
import replyCaretDown from "../../../assets/icons/reply-caret-down.svg";
import replyCaretUp from "../../../assets/icons/reply-caret-up.svg";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  repliedCount: {
    fontWeight: 400,
    alignSelf: "end",
    "& .ReplyView__link": {
      fontSize: "11px",
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
}));
export const ReplyCount = ({
  totalReply,
  updateShowReplies,
  showReplies,
  showUnreadReplies,
  toggleUnreadMessageFlag,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div
      className={classes.repliedCount}
      onClick={() => {
        updateShowReplies(undefined, !showReplies);
      }}
    >
      <span className="ReplyView__link ml-0">
        {totalReply === 1
          ? t("reply.count", { replyCount: totalReply })
          : t("replies.count", { replyCount: totalReply })}
      </span>
    </div>
  );
};
