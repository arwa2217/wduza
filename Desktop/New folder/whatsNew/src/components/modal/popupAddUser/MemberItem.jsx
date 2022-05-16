import React, { useEffect, useState, useRef } from "react";
import { Main } from "./styled";
import PlusIcon from "../../../assets/plus-icon.svg";
import GreenAvatar from "../../../assets/ic_thumb_no_profile_01.svg";
import purpleAvatar from "../../../assets/purple.svg";
import RedAvatar from "../../../assets/red.svg";
import logo1 from "../../../assets/c1.svg";
import logo2 from "../../../assets/c2.svg";
import logo3 from "../../../assets/c3.svg";
import OwnerBadge from "../../../assets/icons/v2/owner_badge.svg";
import ExternalUserImg from "../../../assets/icons/v2/external_user.svg";
import GuestUserImg from "../../../assets/icons/v2/guest_user.svg";
import ProfileNameCard from "../../post-view/post-profile-picture/profile-name-card";
import { makeStyles } from "@material-ui/core";
import DefaultAvatar from "./DefaultAvatar";
import RemoveMemberIcon from "../../../assets/icons/v2/ic_cancel_circle_orange.svg";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import Toast from "react-bootstrap/Toast";
import { DeleteToast } from "../../channel-details/styles/delete-toast";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { removeChannelMemberAction } from "../../../store/actions/channelActions";
const bgCompany = [logo1, logo2, logo3];
const bgMember = [GreenAvatar, purpleAvatar, RedAvatar];
const backgroundImgColors = ["#7AC448", "#518BDC", "#7579CF"];

const useStyles = makeStyles((theme) => ({
  defaultAvatar: {
    height: "32px",
    width: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "500",
    color: "#FFFFFF",
  },
}));

const MemberItem = ({ member, channelCreator, isOwner, channel }) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [removedId, setRemovedId] = useState(null);
  const [removedChannelId, setRemovedChannelId] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [removedName, setRemovedName] = useState(null);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prevProps = useRef();

  const handleShow = (member) => {
    setShow(true);
  };
  function undoDelete() {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    setRemovedId(null);
    setShowToast(false);
    setRemovedChannelId(null);
    setRemovedName(null);
    prevProps.current = null;
  }
  function handleRemove(e, channelId, userId, userName) {
    setRemovedName(userName);
    setShowToast(true);
    dispatch(ModalActions.hideModal(ModalTypes.REMOVE_PEOPLE));
    setRemovedId(userId[0]?.id);
    setRemovedChannelId(channelId);
  }
  const handleRemoveMember = (user) => {
    const modalType = ModalTypes.REMOVE_PEOPLE;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("removePeople.modal:remove"),
      modalType: modalType,
      channel: channel,
      user: [user],
      handleRemove: handleRemove,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };
  useEffect(() => {
    let id = null;
    if (showToast) {
      id = setTimeout(() => {
        dispatch(removeChannelMemberAction(removedChannelId, removedId));
        setShowToast(false);
        setRemovedId(null);
        setRemovedChannelId(null);
      }, 1500);

      setTimerId(id);
      prevProps.current = removedChannelId;
    }
    return () => {
      if (prevProps.current && prevProps.current !== channel.id) {
        clearTimeout(timerId);
        dispatch(removeChannelMemberAction(removedChannelId, removedId));
        setShowToast(false);
        setRemovedId(null);
        setRemovedChannelId(null);
        prevProps.current = null;
      }
    };
  }, [channel.id, showToast]);

  return (
    <div
      key={member.id}
      className={`item-list`}
      style={{
        opacity:
          member.memberStatus && member.memberStatus === "INVITE_PENDING"
            ? "0.35"
            : "1",
      }}
    >
      <span className="avatar-item">
        {member.userImg ? (
          <img
            src={member.userImg}
            alt=""
            className={"user-img"}
            onClick={handleShow}
          />
        ) : (
          <div onClick={handleShow}>
            <DefaultAvatar
              memberName={member.screenName}
              memberEmail={member.email}
            />
          </div>

          // <div
          //   className={classes.defaultAvatar}
          //   style={{
          //     backgroundColor: `${backgroundImgColors[randomIndexColor]}`,
          //   }}
          // >
          //   <span>
          //     {member.screenName.split(" ")[0].charAt(0).toUpperCase()}
          //   </span>
          // </div>
        )}
        {/* <img
          src={member.userImg ? member.userImg : bgMember[color]}
          alt=""
          className={"user-img"}
          onClick={handleShow}
        /> */}
      </span>
      <p className="name-item justify-content-start">
        <span className="member-name">{member.screenName}</span>
        {member.userType === "EXTERNAL" && (
          <span className="company-name">{member.companyName}</span>
        )}
        {channelCreator === member.id && (
          <img
            src={OwnerBadge}
            alt="owner-badge"
            className="user-type-badge"
            onClick={handleShow}
          />
        )}
        {channelCreator !== member.id &&
          "GUEST" === member.userType?.toString().toUpperCase() && (
            <img
              src={GuestUserImg}
              alt="guest-user-badge"
              className="user-type-badge"
              onClick={handleShow}
            />
          )}
        {channelCreator !== member.id &&
          "EXTERNAL" === member.userType?.toString().toUpperCase() && (
            <img
              src={ExternalUserImg}
              alt="external-user-badge"
              className="user-type-badge"
              onClick={handleShow}
            />
          )}
      </p>
      {isOwner && member.id !== channelCreator && (
        <img
          className="remove-member"
          src={RemoveMemberIcon}
          alt="remove-member-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveMember(member);
          }}
        />
      )}

      {member && member.id !== "system" && (
        <ProfileNameCard show={show} user={member} handleClose={handleClose} />
      )}
      <DeleteToast show={showToast}>
        <Toast.Body>
          <span className="toast__text">
            <span className="toast__text__name">{removedName}</span>
            {t("remove.toast:body.label")}
          </span>
          <span>
            <button onClick={() => undoDelete()} className="toast__close-btn">
              {t("remove.toast:button.text")}
            </button>
          </span>
        </Toast.Body>
      </DeleteToast>
    </div>
  );
};

export default MemberItem;
