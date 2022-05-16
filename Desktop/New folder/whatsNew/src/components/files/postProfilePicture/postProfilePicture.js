import PropTypes from "prop-types";
import React from "react";
import "../../post-view/post.css";
import "./postProfilePicture.css";
import { useTranslation } from "react-i18next";
import iconPostUnhide from "../../../assets/icons/post-toolbox/post-unhide.svg";
import { Fragment } from "react";
import LocalDateTime from "../../local-date-time/local-date-time";

/*TODO: Code needs Refactor and Logic needs to be reviewed*/
function PostProfilePicture(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="d-flex">
        {!props.showNameOnly && (
          <div className="post__img">
            <img alt="" src={props.src} />
          </div>
        )}
        <div className="d-flex flex-column align-items-start">
          <div
            className={`post__owner ${
              props.isOwner ? "current__user" : "other__user"
            }`}
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
