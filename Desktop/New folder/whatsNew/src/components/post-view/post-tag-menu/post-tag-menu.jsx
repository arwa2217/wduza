import { useState, useRef } from "react";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./post-tag-menu.css";
import iconPostTag from "../../../assets/icons/v2/ic_tag_menu.svg";
import iconPostTagActive from "../../../assets/icons/v2/ic_tag_act.svg";
import iconCheck from "../../../assets/icons/task-modal-icons/ic_check.svg";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import {
  TAG_DECISION,
  TAG_FOLLOW_UP,
  TAG_QUESTION,
  TAG_IMPORTANT,
  APPROVALREQUIRED,
  APPROVED
} from "./post-tag-type";
import { Button } from "../../shared/styles/mainframe.style";

function PostTagMenu(props) {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [tagIcon, setTagIcon] = useState(
    props.currentTags.length > 0 ? iconPostTagActive : iconPostTag
  );
  const ref = useRef(null);

  const handleToggle = (open, event) => {
    setShow(open);
    setTarget(event.target);
  };

  const hasDecision =
    props.currentTags.length > 0
      ? props.currentTags.some((tag) => {
          if (tag.tagName === TAG_DECISION) return true;
          return false;
        })
      : false;
  const hasQuestion =
    props.currentTags.length > 0
      ? props.currentTags.some((tag) => {
          if (tag.tagName === TAG_QUESTION) return true;
          return false;
        })
      : false;
  const hasImportant =
    props.currentTags.length > 0
      ? props.currentTags.some((tag) => {
          if (tag.tagName === TAG_IMPORTANT) return true;
          return false;
        })
      : false;
  const hasFollowup =
    props.currentTags.length > 0
      ? props.currentTags.some((tag) => {
          if (tag.tagName === TAG_FOLLOW_UP) return true;
          return false;
        })
      : false;
    const hasRequestAproved =
    props.currentTags.length > 0
      ? props.currentTags.some((tag) => {
          if (tag.tagName === APPROVALREQUIRED) return true;
          return false;
        })
      : false;
    const hasApproved =
      props.currentTags.length > 0
        ? props.currentTags.some((tag) => {
            if (tag.tagName === APPROVED) return true;
            return false;
          })
        : false;

  const buttonBackgroundColorNormal = "tags__color__white";
  const buttonBackgroundColorHovered = "tags__background_green";
  const textColorNormal = "tags__color__grey";
  const textColorHovered = "tags__color__white";
  const borderColorNormal = "post__tags__border__grey";
  const borderColorHovered = "tags__background_green";
  return (
    <div ref={ref} className="post-tag-menu">
      <div className="dropdown-content">
            <Dropdown.Item>
              <div >
                <Button
                  // style={{ margin: "0px" }}
                  size={"12px"}
                  value={TAG_IMPORTANT}
                  onClick={(e) => {
                    props.onClick(e);
                    hasImportant
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  className={`${hasImportant? 'active-tag': ''}`}
                  bordered={true}
                  backgroundColor={
                    hasImportant
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasImportant ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasImportant ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {hasImportant ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  {t("postInfo:postTag:" + TAG_IMPORTANT)}
                </Button>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Item>
              <div>
                <Button
                  // style={{ margin: "0px 5px 5px 0px" }}
                  size={"12px"}
                  onClick={(e) => props.onClick(e)}
                  value={APPROVALREQUIRED}
                  className={`${hasRequestAproved? 'active-tag': ''}`}
                >
                  {hasRequestAproved ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  Request approval
                </Button>
              </div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div>
                <Button
                  // style={{ margin: "0px 5px 5px 0px" }}
                  size={"12px"}
                  value={APPROVED}
                  onClick={(e) => props.onClick(e)}
                  className={`${hasApproved? 'active-tag': ''}`}
                >
                  {hasApproved ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  Approval
                </Button>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Item>
              <div >
              <Button
                  // style={{ margin: "0px 5px 0px 0px" }}
                  size={"12px"}
                  value={TAG_FOLLOW_UP}
                  onClick={(e) => {
                    props.onClick(e);
                    hasFollowup
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  className={`${hasFollowup? 'active-tag': ''}`}
                  bordered={true}
                  backgroundColor={
                    hasFollowup
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasFollowup ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasFollowup ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {hasFollowup ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  {/* {t("postInfo:postTag:" + TAG_FOLLOW_UP)} */}
                  To-Do
                </Button>
              </div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div >
                <Button
                  // style={{ margin: " 0px 0px 5px" }}
                  size={"12px"}
                  value={TAG_QUESTION}
                  onClick={(e) => {
                    props.onClick(e);
                    hasQuestion
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  className={`${hasQuestion? 'active-tag': ''}`}
                  bordered={true}
                  backgroundColor={
                    hasQuestion
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasQuestion ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasQuestion ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {/* {t("postInfo:postTag:" + TAG_QUESTION)} */}
                  {hasQuestion ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  In Progress
                </Button>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Item>
              <div>
                <Button
                  // style={{ margin: "0px 5px 5px 0px" }}
                  size={"12px"}
                  value={TAG_DECISION}
                  onClick={(e) => {
                    props.onClick(e);
                    hasDecision
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  className={`${hasDecision? 'active-tag': ''}`}
                  bordered={true}
                  backgroundColor={
                    hasDecision
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasDecision ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasDecision ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {hasDecision ? <SVG className="check-icon" src={iconCheck}/>: ''}
                  Done
                </Button>
              </div>
            </Dropdown.Item>
            
          </div>
      {/* <Dropdown
        className={`${
          tagIcon === iconPostTagActive ? "post-tag-menu-active" : ""
        }`}
        show={show}
        onToggle={handleToggle}
        autoClose={true}
      >
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <span
            style={{
              width: "120px",
              display: "flex",
              alignItems: "center",
              margin: "0",
              padding: 0,
            }}
            className="icon-action"
          >
            {!show ? (
              <SVG src={iconPostTag} />
            ) : (
              <SVG src={iconPostTagActive} />
            )}
            <span style={{ paddingLeft: "9px" }}>Tag</span>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white"
        >
          <Dropdown.Header className="menu-header">
            {t("postInfo:postTag:select.group.tag")}
          </Dropdown.Header>
          <div className="dropdown-content">
            <Dropdown.Item style={{ padding: "0" }}>
              <div >
                <Button
                  style={{ margin: "0px 5px 5px 0px" }}
                  size={"12px"}
                  value={TAG_DECISION}
                  onClick={(e) => {
                    props.onClick(e);
                    hasDecision
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  bordered={true}
                  backgroundColor={
                    hasDecision
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasDecision ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasDecision ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {t("postInfo:postTag:" + TAG_DECISION)}
                </Button>
              </div>
            </Dropdown.Item>
            <Dropdown.Item style={{ padding: "0" }}>
              <div >
                <Button
                  style={{ margin: " 0px 0px 5px" }}
                  size={"12px"}
                  value={TAG_QUESTION}
                  onClick={(e) => {
                    props.onClick(e);
                    hasQuestion
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  bordered={true}
                  backgroundColor={
                    hasQuestion
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasQuestion ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasQuestion ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {t("postInfo:postTag:" + TAG_QUESTION)}
                </Button>
              </div>
            </Dropdown.Item>
            <Dropdown.Item style={{ padding: "0" }}>
              <div >
                <Button
                  style={{ margin: "0px 5px 0px 0px" }}
                  size={"12px"}
                  value={TAG_FOLLOW_UP}
                  onClick={(e) => {
                    props.onClick(e);
                    hasFollowup
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  bordered={true}
                  backgroundColor={
                    hasFollowup
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasFollowup ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasFollowup ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {t("postInfo:postTag:" + TAG_FOLLOW_UP)}
                </Button>
              </div>
            </Dropdown.Item>
            <Dropdown.Item style={{ padding: "0" }}>
              <div >
                <Button
                  style={{ margin: "0px" }}
                  size={"12px"}
                  value={TAG_IMPORTANT}
                  onClick={(e) => {
                    props.onClick(e);
                    hasImportant
                      ? setTagIcon(iconPostTag)
                      : setTagIcon(iconPostTagActive);
                  }}
                  bordered={true}
                  backgroundColor={
                    hasImportant
                      ? buttonBackgroundColorHovered
                      : buttonBackgroundColorNormal
                  }
                  textColor={hasImportant ? textColorHovered : textColorNormal}
                  hoverBackgroundColor={buttonBackgroundColorHovered}
                  hoverTextColor={textColorHovered}
                  borderColor={
                    hasImportant ? borderColorHovered : borderColorNormal
                  }
                  hoverBorderColor={borderColorHovered}
                >
                  {t("postInfo:postTag:" + TAG_IMPORTANT)}
                </Button>
              </div>
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Overlay
        show={show}
        target={target}
        placement="top"
        container={ref.current}
        rootClose
        onHide={() => {
          setShow(false);
        }}
      >
        {(props) => (
          <Tooltip id="tag-icon-tooltip" className="hidden-xs" {...props}>
            {t("postInfo:tooltip.tag.post")}
          </Tooltip>
        )}
      </Overlay> */}
    </div>
  );
}
export default PostTagMenu;
