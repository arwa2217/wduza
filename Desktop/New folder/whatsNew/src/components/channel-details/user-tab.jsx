import React, { useState } from "react";
import "./channel-details.css";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import DefaultUser from "../../assets/icons/default-user.svg";
import BeingProfileModal from "../modal/being-profile-modal";

const ChannelMemberStyle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;

  > img {
    width: 20px;
    height: 20px;
  }
  > p {
    width: 150px;
    margin: 0;
    margin-bottom: 0;
  }
  > button {
    justify-self: flex-end;
  }
`;

function UserTab({
  user,
  handleUserRemove,
  current,
  isChannelCreator,
  isChannelOwner,
  channelStatus,
}) {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let affiliation = true;
  if (user.affiliation === "" || user.affiliation === "undefined") {
    affiliation = false;
  }
  return (
    <ChannelMemberStyle>
      <div className="member-wrapper px-4" onClick={handleShow}>
        <div className="member-info">
          <span className="user-image">
            <img
              src={user.userImg ? user.userImg : DefaultUser}
              alt="user-pic"
            />
          </span>
          <div className="pl-2 member-desc">
            <div className="d-flex">
              <span className="span_ellipsis">{user.screenName}</span>{" "}
              {current && <span> ({t("user.profile:you")})</span>}{" "}
              {isChannelOwner && <span> ({t("user.profile:owner")})</span>}
            </div>
            <span>
              {`${user.jobTitle} ${user.jobTitle ? "@" : ""} ${
                user.affiliation
              }`}
              {affiliation && <span>&nbsp;{`(${user.companyName})`}</span>}
              {!affiliation && <span>{`${user.companyName}`}</span>}
            </span>
          </div>
        </div>
        {isChannelCreator &&
          !current &&
          channelStatus !== "LOCKED" &&
          channelStatus !== "DELETED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUserRemove(user);
              }}
              className="remove-user-button mr-1"
            >
              {t("removePeople.modal:remove")}
            </button>
          )}
      </div>
      <BeingProfileModal show={show} user={user} handleClose={handleClose} />
    </ChannelMemberStyle>
  );
}

export default UserTab;
