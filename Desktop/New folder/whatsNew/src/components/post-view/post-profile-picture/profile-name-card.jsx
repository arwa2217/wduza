import React, { Fragment, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import DefaultUser from "../../../assets/icons/default-user.svg";
import CopyIcon from "../../../assets/icons/v2/ic_copy.svg";
import External from "../../../assets/icons/v2/external.png";
import Guest from "../../../assets/icons/v2/guest.png";
import Internal from "../../../assets/icons/v2/internal.png";
import DefaultAvatar from "../../modal/popupAddUser/DefaultAvatar";
const useStyles = makeStyles((theme) => ({
  profileWrapper: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    left: "50px",
    top: "20px",
    zIndex: "1003",
    padding: "16px 20px",
    maxWidth: "300px",

    ".message-window > div:last-child .post-wrapper:last-child > .post:not(.post--system) .post__header &" : {
      top: "auto",
      bottom: "-8px"
    },
    ".message-window > div:last-child .post-wrapper:nth-last-child(2) > .post .post__header &" : {
      top: "auto",
      bottom: "-8px"
    },

    ".users-list &": {
      left: "46px",
    },

    "& .profile-image": {
      "& img": {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
      },
    },
    "& .profile-information": {
      display: "flex",
      flexDirection: "column",
      paddingLeft: "16px",
      overflow: "hidden",
      "& .user-name": {
        color: theme.palette.text.primary,
        fontSize: "16px",
        lineHeight: "134%",
        fontWeight: "bold",
        paddingBottom: "5px",
        paddingRight: "5px",
        textTransform: "capitalize",
      },
    },
    "& .company-name": {
      paddingBottom: "3px",
      color: theme.palette.text.black70,
      fontSize: "14px",
      textTransform: "capitalize",
    },
    "& .jobTitle": {
      paddingBottom: "3px",
      color: theme.palette.text.black40,
      fontSize: "12px",
      textTransform: "capitalize",
    },
    "& .email": {
      paddingBottom: "3px",
      color: theme.palette.text.black70,
      fontSize: "14px",
      "& img": {
        width: "16px",
        height: "16px",
        marginLeft: "6px"
      },
    },
    "& .mobile": {
      paddingBottom: "3px",
      color: theme.palette.text.black70,
      fontSize: "14px",
    },
    "& .content": {
      width: "100%",
      display: "block",
      "& .user-name": {
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        verticalAlign: "middle",
        width: "70%",
      },
      "& .user-type": {
        display: "inline-block",
        width: "30%",
      },
      "& #user-email": {
        width: "82%",
        display: "inline-block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        verticalAlign: "middle",
      },
      "& .copy-icon": {
        display: "inline-block",
      },
    }
  },
}));
const ProfileNameCard = (props) => {
  const classes = useStyles();
  const profileRef = useRef(null);
  const { user, show, handleClose } = props;
  let affiliation = true;
  if (user?.affiliation === "" || user?.affiliation === "undefined") {
    affiliation = false;
  }
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (profileRef?.current && !profileRef?.current.contains(event.target)) {
        handleClose();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);
  const renderIcon = (userType) => {
    switch (userType) {
      case "EXTERNAL":
        return <img src={External} alt="external" />;
      case "GUEST":
        return <img src={Guest} alt="guest" />;
    }
  };
  const handleClipBoard = async (event, email) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(email);
  };
  return (
    <Fragment>
      {show && (
        <div ref={profileRef} className={classes.profileWrapper}>
          <div className="profile-image">
            {user?.userImg ? (
              <img
                src={user?.userImg ? user?.userImg : DefaultUser}
                alt="user-pic"
              />
            ) : (
              <DefaultAvatar
                memberName={user.screenName}
                memberEmail={user.email}
                size={60}
                fontSize={28}
              />
            )}
          </div>
          <div className="profile-information">
            <div className="content">
              <span className="user-name" title={user?.screenName}>{user?.screenName}</span>
              <span className="user-type">{renderIcon(user?.userType)}</span>
            </div>
            <span className="company-name p-0">
              {/* {user.affiliation} */}
              {affiliation && user.companyName}
              {!affiliation && user.companyName}
            </span>
            {user?.jobTitle !== "" && (
              <span className="jobTitle">{user?.jobTitle}</span>
            )}

            {user?.email !== "" && (
              <div className="email content">
                <span id="user-email">{user?.email}</span>{" "}
                <img
                  src={CopyIcon}
                  alt="copy-icon"
                  onClick={(event) => handleClipBoard(event, user?.email)}
                  className="copy-icon"
                />
              </div>
            )}
            {user.phoneNumber !== "" && (
              <div className="mobile content">
                <span id="user-mobile">
                  {user ? `mobile +${user.phoneNumber}` : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default ProfileNameCard;
