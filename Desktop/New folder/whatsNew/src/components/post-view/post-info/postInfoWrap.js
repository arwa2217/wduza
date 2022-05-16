import React, {useRef, forwardRef} from "react";
import ReactDOM from "react-dom";

const PostInfoWrap = React.forwardRef((props, ref) => {
  const content = (
    <div onMouseOver={props.onMouseOver} className={props.className} ref={ref} >{props.children}</div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("post-action_wrap")
  );
});
export default PostInfoWrap;
