import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { handleKeyUp, hasSelection, renderUtil } from "./renderUtility";
import { useRef } from "react";

export const MonoEditor = ({ onSubmit, postContent, focusOnEditor }) => {
  // const members = useSelector((state) => state.channelMembers.members);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const channel = useSelector((state) => state.config.activeSelectedChannel);
  const [edFocus, setEdFocus] = useState(false);
  const textArea = useRef();
  const textAreaRef = useCallback(() => {
    return textArea;
  }, []);
  useEffect(() => {
    if (focusOnEditor > 0) {
      textAreaRef().current.focus();
      setEdFocus(false);
    }
  }, [focusOnEditor, textAreaRef, edFocus]);
  return (
    <>
      <div className="ReplyView__tooltip"></div>
      <div
        suppressContentEditableWarning={true}
        ref={textArea}
        className="script-textarea"
        tabIndex="0"
        placeholder=""
        onKeyPress={(event) => {
          const { key, currentTarget } = event;
          if (key === "Enter") {
            event.preventDefault();
            if (hasSelection() === false) {
              if (currentTarget.innerText.trim() === "") {
                return false;
              }
              const html = currentTarget.innerHTML.trim();
              const mentions = html
                .match(/data-id([\s\S]*?)data-value/gs)
                ?.map((item) => item && item.substr(9, item.indexOf(" ") - 10));
              onSubmit(html, mentions);
              currentTarget.innerHTML = "";
              setEdFocus(true);
            }
          }
        }}
        onKeyDown={(event) => {
          if (event.keyCode === 38 || event.keyCode === 40) {
            event.preventDefault();
          }
          if (
            event.target.parentElement.querySelector(".ReplyView__tooltip")
              .style.display === "block" &&
            event.key === "Enter"
          ) {
            event.preventDefault();
          }
        }}
        onKeyUp={(event) => {
          handleKeyUp(event, globalMembers, channel);
        }}
        onBlur={(event) => {
          const currentTarget = event.currentTarget;
          setTimeout(() => {
            renderUtil.removeList(currentTarget, [], 0, "");
          }, 200);
        }}
        contentEditable="true"
      >
        <div dangerouslySetInnerHTML={{ __html: postContent }} />
        {/* {postContent} */}
      </div>
      <p
        className="ReplyView__placeholder"
        onClick={(e) => {
          textArea.current.focus();
        }}
      ></p>
    </>
  );
};
