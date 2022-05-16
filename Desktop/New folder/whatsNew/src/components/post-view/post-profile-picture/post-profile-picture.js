import PropTypes from "prop-types";
import React, { useState } from "react";
import "../post.css";
import "./post-profile.css";
import { useTranslation } from "react-i18next";
import PostHistoryModal from "../post-info/post-history";
import PostTime from "../post-time/post-time";
// import iconPostUnhide from "../../../assets/icons/post-toolbox/post-unhide-v1.svg";
import iconPostUnhide from "../../../assets/icons/post-toolbox/post-unhide.svg";
import BeingProfileModal from "../../modal/being-profile-modal";
import { Fragment } from "react";
import ProfileNameCard from "./profile-name-card";
import DefaultAvatar from "../../modal/popupAddUser/DefaultAvatar";
import Badge from "../../../assets/icons/notification-badge.svg";

/*TODO: Code needs Refactor and Logic needs to be reviewed*/
function PostProfilePicture(props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  let affiliation = true;
  if (props.user?.affiliation === "" || props.user?.affiliation === "undefined") {
    affiliation = false;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const styleProfile = props?.isStyleInline
    ? {
        width: "40px",
        height: "40px",
        background: "#ccc",
        textAlign: "center",
        borderRadius: "5px",
        marginRight: "10px",
        overflow: "hidden",
        display: "inline-block",
      }
    : { textAlign: "center" };
  const stylePost = props?.isStyleInline
    ? {
        display: "inline-block",
      }
    : { cursor: "pointer" };
  return (
    <Fragment>
      <div className={`d-flex`}>
          {props.user?.id !== props.currentUser.id &&
           props.isUnread && (
              <img
                  className="post__notification"
                  src={Badge}
                  alt="notification-icon"
              />
          )}
        {!props.showNameOnly && (
          <div className="post__img" id="image_wrapper" style={styleProfile}>



            {props.src ? (
              <img
                alt=""
                width={props.width}
                height={props.width}
                className={'post__avatar'}
                src={props.src}
                onClick={handleShow}
              />
            ) : (
              <div onClick={handleShow}>
                <DefaultAvatar
                  memberName={props.user?.screenName}
                  memberEmail={props.user?.email}
                  size={36}
                  fontSize={18}
                />
              </div>
            )}
          </div>
        )}
        <div className="d-flex flex-row align-items-start" style={stylePost}>
          <div
            className={`post__owner ${props.isOwner ? "" : "other__user"}`}
            onClick={handleShow}
          >
            {props.user && props.user?.id !== "system" && (
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    props.post?.type === "SYSTEM"
                      ? t("monoly.label")
                      : props.user?.displayName || props.user?.screenName,
                }}
              />
            )}

            {/* {props.isHiddenPost && (
              <img
                onClick={(e) => e.stopPropagation()}
                alt=""
                title=""
                src={iconPostUnhide}
              />
            )} */}
          </div>

          {props.post && props.post.edited ? (
            <PostHistoryModal post={props.post} />
          ) : (
            <React.Fragment>
              {props.user && props.user?.id !== "system" && (
                <PostTime
                  eventTime={parseInt(props.post?.createdAt)}
                  postId={props.post?.id}
                  isLink={false}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {props.user && props.user?.id !== "system" && (
        <ProfileNameCard
          show={show}
          user={props.user}
          handleClose={handleClose}
        />
      )}
    </Fragment>
  );
}

PostProfilePicture.propTypes = {
  src: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  user: PropTypes.object,
  isRHS: PropTypes.bool,
  hasMention: PropTypes.bool,
  showNameOnly: PropTypes.bool,
};

PostProfilePicture.defaultProps = {
  width: "40",
  height: "40",
  isRHS: false,
  hasMention: false,
  showNameOnly: false,
};

export default PostProfilePicture;
