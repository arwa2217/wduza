import React, { useState, useEffect, Fragment, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import UserTab from "../../channel-details/user-tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import options from "@toolbar/options.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  Options,
  OptionsDropdown,
} from "../../post-view/post-msg-view/styles/attachment-post-style";
import { NavDropdown, Toast } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./discussion.css";
import SearchIcon from "../../../assets/icons/search-icon-primary.svg";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { DeleteToast } from "../../channel-details/styles/delete-toast";
import {
  adminRemoveDiscussionMember,
  changeOwner,
  fetchDiscussionMemberData,
  removeChannelMemberByAdminAction,
  resetRemoveChannelMemberAdminAction
} from "../../../store/actions/admin-discussion-action";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { UPDATE_CHANGE_OWNER_STATUS } from "../../../store/actionTypes/admin-discussion-action-types";

export default function Members(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const discussionMembers = useSelector(
    (state) => state.AdminDiscussionReducer.discussionMembers
  );
  const fetchingDiscussionMemberList = useSelector(
    (state) => state.AdminDiscussionReducer.fetchingDiscussionMemberList
  );
  const ownerChanged = useSelector(
    (state) => state.AdminDiscussionReducer.ownerChanged
  );
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const channelStatus = useSelector((state) => state.channelDetails.status);
  const removeMemberError = useSelector(
    (state) => state.AdminDiscussionReducer.removeMemberError
  );
  const selectedDiscussion = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const removingMember = useSelector(
    (state) => state.AdminDiscussionReducer.removingMember
  );
  const removedMember = useSelector(
    (state) => state.AdminDiscussionReducer.removedMember
  );
  const failedToRemoveMember = useSelector(
    (state) => state.AdminDiscussionReducer.failedToRemoveMember
  );
  const [removedName, setRemovedName] = useState(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [removedId, setRemovedId] = useState(null);
  const [removedChannelId, setRemovedChannelId] = useState(null);
  const prevProps = useRef();

  const selectedMembers = useMemo(
    () => members.filter((i) => i.checked),
    [members]
  );

  useEffect(() => {
    if (ownerChanged) {
      dispatch(showToast("Owner successfully updated!", 3000, "success"));
      return () => {
        dispatch({ type: UPDATE_CHANGE_OWNER_STATUS });
      };
    }
  }, [ownerChanged]);

  // useEffect(() => {
  //   if (selectedDiscussion?.id)
  //     dispatch(fetchDiscussionMemberData(selectedDiscussion.id));
  // }, [selectedDiscussion]);

  useEffect(() => {
    // if (discussionMembers?.length) {
    setMembers(discussionMembers?.length ? discussionMembers : []);
    // }
  }, [discussionMembers]);

  useEffect(() => {
    if (removeMemberError?.length) {
      if (removeMemberError[0]?.errCode === 4033) {
        dispatch(
          showToast(
            t(
              "admin:account.management:user.information:error.action.not.allowed"
            ),
            3000
          )
        );
        dispatch(resetRemoveChannelMemberAdminAction());
      }
    }
  }, [removeMemberError]);

  const searchMember = (e) => {
    if (e.target.value?.length > 0 && discussionMembers?.length) {
      let newMemberList = discussionMembers.filter((item) =>
        item.screenName.includes(e.target.value)
      );
      setMembers(newMemberList);
    } else {
      setMembers(discussionMembers);
    }
  };

  function handleRemove(e, channelId, userId, userName) {
    setRemovedName(userName);
    dispatch(ModalActions.hideModal(ModalTypes.REMOVE_PEOPLE));
    setRemovedId(userId);
    setRemovedChannelId(channelId);
    dispatch(
      removeChannelMemberByAdminAction(
        channelId,
        userId.map((i) => i.id),
        true
      )
    );
  }

  function handleUserRemove() {
    if (selectedMembers?.length) {
      const modalType = ModalTypes.REMOVE_PEOPLE;
      const modalProps = {
        show: true,
        closeButton: true,
        title: t("removePeople.modal:remove"),
        modalType: modalType,
        channel: selectedDiscussion,
        user: selectedMembers,
        handleRemove: handleRemove,
      };
      dispatch(ModalActions.showModal(modalType, modalProps));
    }
  }

  function handleUserAdd(e) {
    const modalType = ModalTypes.ADD_PEOPLE;
    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: t("addPeople.modal:add.people"),
      modalType: modalType,
      channel: selectedDiscussion,
      isAdmin: true,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  const handleRowSelection = (e, item, index) => {
    e.stopPropagation();
    let newState = [...members];
    let currentValue = newState[index].checked;
    newState[index] = {
      ...members[index],
      checked: !currentValue,
    };
    setMembers(newState);
  };

  function undoDelete() {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    setRemovedId(null);
    setShowDeleteToast(false);
    setRemovedChannelId(null);
    setRemovedName(null);
    prevProps.current = null;
  }

  const handleMakeOwner = (id) => {
    dispatch(changeOwner(selectedDiscussion.id, { ownerId: id }));
  };

  return (
    <div className="pd-20 border-top mb-0 w-100 member-list-wrapper">
      {members.length > 0 && (
        <div className="member-search">
          <img alt="Search" src={SearchIcon} className="icon-search" />
          <input
            type="text"
            placeholder="Enter the member name"
            onChange={searchMember}
          />
        </div>
      )}
      {fetchingDiscussionMemberList ? (
        <div className="w-100 text-center no-data">
          <h5 className="w-100 text-center mt-4">{t("file:loading")}</h5>
        </div>
      ) : members.length > 0 ? (
        <div id={members.length > 5 ? "members-list" : ""}>
          {members &&
            members.map((user, index) => {
              const isCurrentUser = user.id === currentUserId;
              const isChannelOwner = selectedDiscussion.creatorId === user.id;
              return (
                <Fragment key={`Fragment${user.id}`}>
                  <div>
                    <Row className="flex-nowrap flex-row m-0">
                      <div className="p-0" style={{ margin: "auto" }}>
                        <div className="custom-control custom-checkbox custom-checkbox-green">
                          <input
                            type="checkbox"
                            className="custom-control-input custom-control-input-green"
                            id={`default-activity-${index}`}
                            // disabled={!notificationEnabled}
                            // checked={allPostsFlag}
                            onChange={(e) => {
                              handleRowSelection(e, user, index);
                            }}
                          />
                          <label
                            className="custom-control-label pointer-on-hover"
                            htmlFor={`default-activity-${index}`}
                          >
                            {/* {t("setting.modal:notifications:activity.all.label")} */}
                          </label>
                        </div>
                      </div>
                      <Col
                        className="p-0"
                        style={{ width: "190px", minWidth: "190px" }}
                      >
                        <UserTab
                          user={user}
                          current={isCurrentUser}
                          // handleUserRemove={handleUserRemove}
                          isChannelOwner={isChannelOwner}
                          // isChannelCreator={props.channel?.isOwner}
                          key={`userTab${user.id}`}
                          channelStatus={channelStatus}
                        />
                      </Col>
                      {selectedDiscussion &&
                        selectedDiscussion.status !== "DELETED" &&
                        !isChannelOwner && (
                          <Col className="p-0">
                            <Menu className="options-menu">
                              <Options id={`nav-dropdown`}>
                                <OptionsDropdown
                                  style={{ lineHeight: "60px" }}
                                  id={`nav-dropdown`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  title={<img src={options} alt="options" />}
                                  // drop="auto"
                                  // alignRight
                                  onMouseEnter={(e) => {
                                    // setShowOverlay(false);
                                  }}
                                  onMouseLeave={() => {
                                    // setShowOverlay(true);
                                  }}
                                >
                                  <NavDropdown.Item
                                    style={{ lineHeight: "40px" }}
                                    // onMouseOver={() => setRenameIcon(rename_icon_active)}
                                    // onMouseOut={() => setRenameIcon(rename_icon)}
                                    onClick={() => handleMakeOwner(user.id)}
                                  >
                                    <span className="item-name">
                                      Make Owner
                                      {/* {t("attachment:rename.label")} */}
                                    </span>
                                  </NavDropdown.Item>
                                </OptionsDropdown>
                              </Options>
                            </Menu>
                          </Col>
                        )}
                    </Row>
                  </div>
                </Fragment>
              );
            })}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <p> {t("no.data.available")}</p>
        </div>
      )}
      <div
        className="d-flex justify-content-between custom-form-discussion-actions"
        style={{ marginTop: "15px" }}
      >
        {members?.length ? (
          <Button
            variant="outline-primary"
            className="discussion-btn w-100"
            style={{ marginRight: "10px" }}
            // disabled={!selectedMembers?.length}
            onClick={handleUserRemove}
          >
            {t("button:remove")}
          </Button>
        ) : (
          <></>
        )}
        {selectedDiscussion && selectedDiscussion.status !== "DELETED" && (
          <Button
            variant="outline-primary"
            onClick={handleUserAdd}
            className="discussion-btn w-100"
          >
            {t("button:add")}
          </Button>
        )}
      </div>
      <DeleteToast show={showDeleteToast}>
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
}
