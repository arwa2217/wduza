import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    color: "#19191A !important",
    "& .post__desc__inner": {
      padding: "0!important",
      "& .message-post-wrap": {
        padding: "0!important",
        position: "unset!important",
      },
    },
  },
  expandInfo: {
    backgroundColor: "#EFF6FC",
    padding: "5px",
    width: "30px",
    height: "20px",
    position: "relative",
    margin: "15px 0 10px 0",
    transition: "300ms color",
    borderRadius: "2px",
    "&:hover": {
      backgroundColor: "#dceaf5",
    },
    "& span": {
      position: "absolute",
      top: "33%",
      left: "54%",
      letterSpacing: "2px",
      fontSize: "12px",
      transform: "translate(-50%, -50%)",
      fontWeight: "bold",
    },
  },
});

const OutlookMailContent = (props) => {
  const classes = useStyles();
  const { mailBodyContent, contentType } = props;
  const [mainContent, setMainContent] = useState("");
  const [expandMainContent, setExpandMainContent] = useState("");
  const [showExpand, setShowExpand] = useState(false);
  useEffect(() => {
    if (mailBodyContent.includes('<div id="divRplyFwdMsg" dir="ltr">')) {
      const arrayOfContent = mailBodyContent.split(
        '<div id="divRplyFwdMsg" dir="ltr">'
      );
      const mainText = arrayOfContent.shift();
      mainText.includes(
        '<hr tabindex="-1" style="display:inline-block; width:98%">'
      )
        ? setMainContent(
            mainText.split(
              '<hr tabindex="-1" style="display:inline-block; width:98%">'
            )[0]
          )
        : setMainContent(mainText);
      setExpandMainContent(
        arrayOfContent.join('<div id="divRplyFwdMsg" dir="ltr">')
      );
    } else {
      setMainContent(mailBodyContent);
      setExpandMainContent(expandMainContent);
    }
  }, [mailBodyContent]);
  return (
    <>
      {contentType === "text" ? (
        <div>
          <span className={classes.root}>{mainContent}</span>
          {expandMainContent !== "" && (
            <span className={classes.root}>{expandMainContent}</span>
          )}
        </div>
      ) : (
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: mainContent,
            }}
            className={classes.root}
          />

          {expandMainContent !== "" && (
            <div>
              <div
                className={classes.expandInfo}
                onClick={() => setShowExpand(!showExpand)}
              >
                <span>...</span>
              </div>
              <div
                style={{
                  display: !showExpand ? "none" : "block",
                  margin: "16px 0 16px 17px",
                  borderBottom: "1px solid #ccc",
                }}
              />
              <div
                style={{
                  display: !showExpand ? "none" : "block",
                  padding: "0 16px",
                  borderLeft: "1px solid #ccc",
                }}
                dangerouslySetInnerHTML={{
                  __html: expandMainContent,
                }}
                className={classes.root}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OutlookMailContent;
