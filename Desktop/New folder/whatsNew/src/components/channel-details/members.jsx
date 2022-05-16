import React, { useState, useEffect, useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-bootstrap/Toast";
import "./channel-details.css";
import UserTab from "./user-tab";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import { DeleteToast } from "./styles/delete-toast";
import { removeChannelMemberAction } from "../../store/actions/channelActions";
import CommonUtils from "../utils/common-utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";

export default React.memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [removedId, setRemovedId] = useState(null);
  const [removedChannelId, setRemovedChannelId] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [removedName, setRemovedName] = useState(null);
  const prevProps = useRef();
  const channelStatus = useSelector((state) => state.channelDetails.status);

  //const { name: channelName, id:channelId, creatorId } = props.channel;

  //useSelector(
  //  (state) => state.channelDetails
  //);

  const currentUserId = useSelector((state) => state.AuthReducer.user.id);

  // const members = useSelector((state) => state.channelMembers.members);
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const [globalMembers, setGlobalMembers] = useState([]);
  useEffect(() => {
    setGlobalMembers(
      CommonUtils.getFilteredMembers(
        globalMembersList,
        getLastSelectedChannelId()
      )
    );
  }, [globalMembersList]);
  const getUnique = (arr, key) => [...new Set(arr.map((o) => o[key]))];

  useEffect(() => {
    //Commented to fix MON-613
    // dispatch(GetChannelMemberAction(props.channel.id));

    let id = null;
    if (showToast) {
      id = setTimeout(() => {
        dispatch(removeChannelMemberAction(removedChannelId, removedId));
        setShowToast(false);
        setRemovedId(null);
        setRemovedChannelId(null);
      }, 4000);

      setTimerId(id);
      prevProps.current = removedChannelId;
    }
    return () => {
      if (prevProps.current && prevProps.current !== props.channel.id) {
        clearTimeout(timerId);
        dispatch(removeChannelMemberAction(removedChannelId, removedId));
        setShowToast(false);
        setRemovedId(null);
        setRemovedChannelId(null);
        prevProps.current = null;
      }
    };
  }, [props.channel.id, showToast]);

  function handleUserAdd(e) {
    const modalType = ModalTypes.ADD_PEOPLE;
    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: t("addPeople.modal:add.people"),
      modalType: modalType,
      channel: props.channel,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleRemove(e, channelId, userId, userName) {
    setRemovedName(userName);
    setShowToast(true);
    dispatch(ModalActions.hideModal(ModalTypes.REMOVE_PEOPLE));
    setRemovedId(userId[0]);
    setRemovedChannelId(channelId);
  }

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

  function handleUserRemove(user) {
    const modalType = ModalTypes.REMOVE_PEOPLE;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("removePeople.modal:remove"),
      modalType: modalType,
      channel: props.channel,
      user: [user],
      handleRemove: handleRemove,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }
  function changeHeight() {
    document.getElementById("members-list").style.height = "auto";
    document.getElementById("more-content").style.display = "none";
  }

  const concernedMembers = [];
  const tmpMembers = globalMembers?.filter((member) => {
    if (member?.isOwner || member?.id === currentUserId) {
      concernedMembers.push(member);
      return false;
    } else {
      return true;
    }
  });

  if (tmpMembers) {
    tmpMembers.sort((a, b) => {
      var screenNameFirst = a.screenName.toUpperCase();
      var screenNameSecond = b.screenName.toUpperCase();
      return screenNameFirst < screenNameSecond
        ? -1
        : screenNameFirst > screenNameSecond
        ? 1
        : 0;
    });

    var currentArray = [];
    let list = concernedMembers.filter((member) => member.id === currentUserId);
    if (list && list.length > 0) {
      currentArray.push(list[0]);
    }
    if (concernedMembers.length >= 2) {
      let arr = concernedMembers.filter(
        (member) => member.id !== currentUserId
      );
      if (arr && arr.length > 0) {
        currentArray.push(arr[0]);
      }
    }
    globalMembers.length = 0;
    globalMembers.push(...currentArray);
    globalMembers.push(...tmpMembers);
  }
  return (
    <div className="row w-100 ml-0 border-top">
      <div className="col-12 p-0">
        <div className="col-12 px-4">
          <h5 className="channel-info-heading">
            {!globalMembers
              ? "loading..."
              : `${globalMembers.length} ${t("members.from")} ${
                  globalMembers.length > 0 &&
                  getUnique(globalMembers, "companyName")?.filter(
                    (el) => el !== ""
                  ).length
                } ${t("organization")}
                  
                `}
          </h5>
        </div>
        <div className="member-list-wrapper">
          <div id={props.channel.memberCount > 5 ? "members-list" : ""}>
            {globalMembers &&
              globalMembers.map((user, index) => {
                const isCurrentUser = user.id === currentUserId;
                const isChannelOwner = props.channel.creatorId === user.id;
                if (user.id !== removedId) {
                  return (
                    <Fragment key={`Fragment${user.id}`}>
                      <UserTab
                        user={user}
                        current={isCurrentUser}
                        handleUserRemove={handleUserRemove}
                        isChannelOwner={isChannelOwner}
                        isChannelCreator={props.channel.isOwner}
                        key={`userTab${user.id}`}
                        channelStatus={channelStatus}
                      />
                    </Fragment>
                  );
                }
              })}
          </div>
        </div>
        {props.channel.memberCount > 5 && (
          <div className="col-12 px-4">
            <button
              onClick={changeHeight}
              className="btn btn-block add-user-button"
              id="more-content"
            >
              {t("addPeople.modal:showMore")}
            </button>
          </div>
        )}
        {props.channel.isOwner &&
          channelStatus !== "LOCKED" &&
          channelStatus !== "DELETED" && (
            <div className="col-12 px-4">
              <button
                onClick={handleUserAdd}
                className="btn btn-block add-user-button"
              >
                <span>+</span> {t("addPeople.modal:add.people")}
              </button>
            </div>
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
    </div>
  );
});
