import React, { useState, useEffect } from "react";
import PostEditModal from "./post-modal";
import PostEditIcon from "./post-edit-icon";
import { editPostPopupStore } from "../../../utilities/app-preference.js";
function PostEdit(props) {
  const [editPostPopup, setEditPostPopup] = useState(editPostPopupStore());
  useEffect(() => {
    setEditPostPopup(editPostPopupStore());
  }, [editPostPopupStore()]);
  return (
    <>
      {!editPostPopup && (
        <PostEditModal
          onEditClick={props.onEditClick}
          postInfo={props.postInfo}
        />
      )}
      {editPostPopup && (
        <PostEditIcon
          onEditClick={props.onEditClick}
          postInfo={props.postInfo}
        />
      )}
    </>
  );
}

export default PostEdit;
