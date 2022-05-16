import PropTypes from "prop-types";
import React, { useState } from "react";
// import "../../post-view/post.css";
import "./postProfilePicture.css";
import { useTranslation } from "react-i18next";
// import iconPostUnhide from "../../../assets/icons/post-toolbox/post-unhide-v1.svg";
import iconPostUnhide from "../../../../assets/icons/post-toolbox/post-unhide.svg";
// import BeingProfileModal from "../../modal/being-profile-modal";
import { Fragment } from "react";
import LocalDateTime from "../../../local-date-time/local-date-time";

/*TODO: Code needs Refactor and Logic needs to be reviewed*/
function PostProfilePicture(props) {
  const { t } = useTranslation();
  // const [show, setShow] = useState(false);

  // let affiliation = true;
  // if (props.user.affiliation === "" || props.user.affiliation === "undefined") {
  //   affiliation = false;
  // }
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <Fragment>
      <div className="d-flex">
        {!props.showNameOnly && (
          <div className="post__img">
            <img
              alt=""
              // width={props.width}
              // height={props.width}
              src={props.src}
              // onClick={handleShow}
            />
          </div>
        )}
        <div className="d-flex flex-column align-items-start">
          <div
            className={`post__owner ${
              props.isOwner ? "current__user" : "other__user"
            }`}
            // onClick={handleShow}
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  props.post?.type === "SYSTEM"
                    ? t("monoly.label")
                    : props.user?.displayName || props.user?.screenName,
              }}
            />
            {props.isHiddenPost && (
              <img
                onClick={(e) => e.stopPropagation()}
                alt=""
                title=""
                src={iconPostUnhide}
              />
            )}
          </div>

          <LocalDateTime eventTime={parseInt(props.post?.createdAt)} />
        </div>
      </div>
      {/* {(props.user && props.user.id !== "system") && <BeingProfileModal show={show} user={props.user} handleClose={handleClose}/>} */}
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
