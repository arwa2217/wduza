import React from "react";
import iconPostEdit from "../../../assets/icons/v2/ic_edit.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
function PostEditIcon(props) {
  const { t } = useTranslation();
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 150, hide: 100 }}
        trigger={["hover", "focus"]}
        overlay={
          <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
            {t("postInfo:tooltip.edit.post")}
          </Tooltip>
        }
      >
        {props.postInfo && props.postInfo.isOwner ? (
          <button
            className="dropdown-toggle btn btn-light"
            onClick={props.onEditClick}
          >
            <span className="icon-action edit-post">
              <SVG src={iconPostEdit} alt="icon-edit" style={{marginRight: "10px"}}/>
              Edit
            </span>
          </button>
        ) : (
          <button
            className="dropdown-toggle btn btn-light disabled"
            onClick={props.onEditClick}
          >
            <span className="icon-action">
              <SVG src={iconPostEdit} alt="icon-edit" style={{marginRight: "10px"}}/>
              Edit
            </span>
          </button>
        )}
      </OverlayTrigger>
    </>
  );
}
export default PostEditIcon;
