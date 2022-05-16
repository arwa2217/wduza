import React from "react";
import PostHideIcon from "./post-hide-icon";
function PostHide(props) {
  return (
    <>
      <PostHideIcon
        onHideClick={props.onHideClick}
        onUnhideClick={props.onUnhideClick}
        postInfo={props.postInfo}
      />
    </>
  );
}

export default PostHide;
