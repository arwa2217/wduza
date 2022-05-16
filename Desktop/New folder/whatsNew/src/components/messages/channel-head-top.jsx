import React, { useState, useEffect } from "react";
import { DiscussionActions } from "./channel-head.style.js";
import OpenChannelDetails from "../../assets/icons/context-panel-active.svg";
import OpenedChannelDetails from "../../assets/icons/context-panel.svg";
import advancedSecurity from "../../assets/icons/advanced-security.svg";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../constants/modal/modal-type";
import { useDispatch, useSelector } from "react-redux";
import ModalActions from "../../store/actions/modal-actions";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import Notifications from "../datapanel/notification";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core";
import SearchIcon from "../../assets/icons/v2/search.svg";
import SearchIconActive from "../../assets/icons/v2/ic_search_active.svg";
import SummaryToggle from "../../assets/icons/v2/summary-toggle.svg";
import Security from "../../assets/icons/v2/ic_security_new.svg";
import External from "../../assets/icons/v2/external.png";
import Guest from "../../assets/icons/v2/guest.png";
import Internal from "../../assets/icons/v2/internal.png";
import OwnerBadge from "../../assets/icons/v2/owner_badge.svg";
import PopupAddUser from "../modal/popupAddUser";
import CommonUtils from "../utils/common-utils.js";
import { getLastSelectedChannelId } from "../../utilities/app-preference.js";
import searchIcon from "../../assets/icons/v2/search.svg";
import SVG from "react-inlinesvg";
import filterIcon from "../../assets/icons/v2/ic_filter.svg";
const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: "bold",
    fontSize: "13px",
    color: theme.palette.text.primary,
  },
  normalText: {
    fontWeight: "normal",
    fontSize: "13px",
    color: theme.palette.text.primary,
  },
  discussionDetail: {
    "& .discussionText": {
      display: "flex",
      flexDirection: "column",
      "& .discussionInfo": {
        display: "flex",
        alignItems: "center",
        "& img": {
          paddingLeft: "6px",
        },
        "& .discussionName": {
          color: "#000000E5",
          fontSize: "16px",
          lineHeight: "134%",
          fontWeight: "bold",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "200px",
        },
      },
      "& .memberCount": {
        color: "#00000080",
        fontSize: "12px",
        fontWeight: "normal",
        lineHeight: "134%",
        marginTop: "3px",
        cursor: "pointer",
      },
      "& .owner-badge": {
        paddingLeft: "3px",
      },
    },
  },
  searchIcon: {
    marginRight: "10px!important",
    marginTop: "2px",
  },
  cancelSearch: {
    paddingLeft: "16px",
    fontSize: "14px",
    lineHeight: "134%",
    color: "#00A95B",
    cursor: "pointer",
  },
}));
function ChannelHeadTop(props) {
  const [isLaptopL, setLaptopL] = useState(window.innerWidth >= 1468);
  const [isLaptop, setLaptop] = useState(window.innerWidth >= 1100);
  const classes = useStyles();
  const [showDetails, setShowDetails] = useState(false);
  const advancedRef = useRef(null);
  const [detailsTarget, setDetailsTarget] = useState(null);
  const memberCount = useSelector((state) => state.channelDetails.memberCount);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [isOpenPopup, setOpenPopupUser] = useState(false);
  const [isFromClose, setFromClose] = useState(false);
  const channelStatus = useSelector((state) => state.channelDetails.status);
  const [channelMembers, setChannelMembers] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const summaryPanelActive = useSelector(
    (state) => state.config.summaryPanelActive
  );
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );

  useEffect(() => {
    const members = CommonUtils.getFilteredMembers(
      globalMembersList,
      getLastSelectedChannelId()
    );
    setChannelMembers(members);
  }, [globalMembersList]);

  const dispatch = useDispatch();

  const channel = props.channel;
  const { t } = useTranslation();

  const updateMedia = () => {
    setLaptopL(window.innerWidth >= 1468);
    setLaptop(window.innerWidth >= 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  function onAddPeopleClick(e) {
    e.preventDefault();
    const modalType = ModalTypes.ADD_PEOPLE;
    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: t("addPeople.modal:add.people"),
      modalType: modalType,
      channel: channel,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleChannelDelete() {
    const modalType = ModalTypes.DELETE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("delete.discussion.modal:title.delete", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: channel,
      channelPrivacyType: "delete",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleChannelLock() {
    const modalType = ModalTypes.ARCHIVE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("delete.discussion.modal:title.archive", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: channel,
      channelPrivacyType: "archive",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleChannelAdvanced(e) {
    setShowDetails(!showDetails);
    setDetailsTarget(e.target);
  }

  function leaveDiscussion() {
    const modalType = ModalTypes.LEAVE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("leave.discussion.modal:title", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: props.channel,
      isOwner: props.channel.isOwner,
      channelPrivacyType: "delete",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleLeaveDiscussion() {
    if (
      props.channel.isOwner &&
      props.channel.isDeletable &&
      channelStatus !== "DELETED"
    ) {
      handleChannelDelete();
    } else if (
      props.channel.isOwner &&
      props.channel.isLockable &&
      channelStatus !== "LOCKED"
    ) {
      handleChannelLock();
    } else {
      leaveDiscussion();
    }
  }
  const renderBadge = () => {
    switch (channel?.type) {
      case "INTERNAL":
        return <div></div>;
      case "EXTERNAL":
        return <img src={External} alt="external" />;
      case "GUEST":
        return <img src={Guest} alt="guest" />;
    }
  };
  const openPopupUser = () => {
    setOpenPopupUser(true);
  };
  const closePopupAdd = (status) => {
    setTimeout(() => {
      setOpenPopupUser(status);
    }, 200);
  };
  const searchComponents = (
    <div
      className="discussion-header-outer-container"
      style={{ marginRight: "14px" }}
    >
      {/*<div className="image-container">*/}
      {/*  <img*/}
      {/*    src={searchIcon}*/}
      {/*    alt="search"*/}
      {/*    // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}*/}
      {/*    // className="image"*/}
      {/*  />*/}
      {/*</div>*/}
      <div
        className="inner-container"
        style={{
          border: "1px solid #CCCCCC",
          borderRadius: "5px",
          padding: "5px",
          height: "30px",
        }}
      >
        <img
          src={searchIcon}
          alt="search"
          // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}
          // className="image"
        />
        <input
          // onChange={props.handleSearchDiscussion}
          placeholder={t("discussion:search.discussion.filter")}
          maxLength="80"
          // value={props.value}
          className="input-middle"
          autoFocus
        />
        {/*<SVG*/}
        {/*  src={filterIcon}*/}
        {/*  alt="filter"*/}
        {/*  onClick={() => setOpenSearch(false)}*/}
        {/*  className="cross-image"*/}
        {/*  fill={"black"}*/}
        {/*/>*/}
      </div>
      <p onClick={() => setOpenSearch(false)} className={classes.cancelSearch}>
        Cancel
      </p>
    </div>
  );
  const defaultComponents = (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 150, hide: 100 }}
      trigger={["hover", "focus"]}
      overlay={<Tooltip id="discussion-search">Search</Tooltip>}
    >
      <div
        className={`topBar__icon ${classes.searchIcon}`}
        onClick={() => setOpenSearch(true)}
      >
        <img id="icon" src={SearchIcon} alt={"search-icon"} />
      </div>
    </OverlayTrigger>
  );
  return (
    <div className="topBar m-0">
      <div
        className="d-flex align-items-center justify-content-between pr-0"
        style={{
          height: "var(--discussion-list-top-bar-height)",
          padding: "5px 16px",
          position: "relative",
        }}
      >
        <div className={classes.discussionDetail}>
          <div className="discussionText">
            <div className="discussionInfo">
              <span className="discussionName" title={channel?.name}>
                {channel?.name}
              </span>
              {channel.isAdvanced && (
                <img src={Security} alt="advanced_security" />
              )}
              {renderBadge()}
            </div>
            <div className="d-flex align-items-center">
              <span className="memberCount" onClick={() => openPopupUser()}>
                {channelMembers.length} members
                {props?.channel?.isOwner && (
                  <img
                    className="owner-badge"
                    src={OwnerBadge}
                    alt="owner-badge"
                  />
                )}
              </span>
            </div>
            {isOpenPopup ? (
              <PopupAddUser
                isOpenPopup={isOpenPopup}
                closePopupAdd={closePopupAdd}
                channelCreator={props?.channel?.creatorId}
              />
            ) : (
              ""
            )}
          </div>
        </div>

        <DiscussionActions>
          {/*<div className="d-flex align-items-center left-spacing">*/}
          {/*  <div*/}
          {/*    className="d-flex align-items-center"*/}
          {/*    style={{ marginRight: "0px" }}*/}
          {/*  >*/}
          {/*    <OverlayTrigger*/}
          {/*      placement="bottom"*/}
          {/*      delay={{ show: 150, hide: 100 }}*/}
          {/*      trigger={["hover", "focus"]}*/}
          {/*      overlay={*/}
          {/*        <Tooltip id={t("header.tooltip:add.members")}>*/}
          {/*          {t("header.tooltip:add.members")}*/}
          {/*        </Tooltip>*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <div*/}
          {/*        className={`topBar__icon topBar__icon__addMember ${*/}
          {/*          channel.isOwner &&*/}
          {/*          channelStatus !== "LOCKED" &&*/}
          {/*          channelStatus !== "DELETED"*/}
          {/*            ? "text-white"*/}
          {/*            : "disabled"*/}
          {/*        }`}*/}
          {/*        onClick={*/}
          {/*          channel.isOwner &&*/}
          {/*          channelStatus !== "LOCKED" &&*/}
          {/*          channelStatus !== "DELETED"*/}
          {/*            ? onAddPeopleClick*/}
          {/*            : undefined*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {t("channel.head.top:add")}*/}
          {/*      </div>*/}
          {/*    </OverlayTrigger>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className="d-flex align-items-center"*/}
          {/*    style={{ marginRight: "0px" }}*/}
          {/*  >*/}
          {/*    <OverlayTrigger*/}
          {/*      placement="bottom"*/}
          {/*      delay={{ show: 150, hide: 100 }}*/}
          {/*      trigger={["hover", "focus"]}*/}
          {/*      overlay={*/}
          {/*        <Tooltip id={t("header.tooltip:leave.discussion")}>*/}
          {/*          {t("header.tooltip:leave.discussion")}*/}
          {/*        </Tooltip>*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <div*/}
          {/*        className={`topBar__icon topBar__icon__leaveDiscussion ${*/}
          {/*          props.channel.isOwner &&*/}
          {/*          memberCount > 1 &&*/}
          {/*          channelStatus === "ACTIVE"*/}
          {/*            ? "disabled"*/}
          {/*            : "text-white"*/}
          {/*        }`}*/}
          {/*        onClick={*/}
          {/*          props.channel.isOwner &&*/}
          {/*          memberCount > 1 &&*/}
          {/*          channelStatus === "ACTIVE"*/}
          {/*            ? undefined*/}
          {/*            : handleLeaveDiscussion*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {t("channel.head.top:leave")}*/}
          {/*      </div>*/}
          {/*    </OverlayTrigger>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className="d-flex align-items-center"*/}
          {/*    style={{ marginRight: "0px" }}*/}
          {/*  >*/}
          {/*    <OverlayTrigger*/}
          {/*      placement="bottom"*/}
          {/*      delay={{ show: 150, hide: 100 }}*/}
          {/*      trigger={["hover", "focus"]}*/}
          {/*      overlay={*/}
          {/*        <Tooltip id={t("header.tooltip:lock.discussion")}>*/}
          {/*          {t("header.tooltip:lock.discussion")}*/}
          {/*        </Tooltip>*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <div*/}
          {/*        className={`topBar__icon topBar__icon__lockDiscussion ${*/}
          {/*          channel.isOwner &&*/}
          {/*          channel.isLockable === true &&*/}
          {/*          channelStatus !== "LOCKED"*/}
          {/*            ? "text-white"*/}
          {/*            : "disabled"*/}
          {/*        }`}*/}
          {/*        onClick={*/}
          {/*          channel.isOwner &&*/}
          {/*          channel.isAdvanced &&*/}
          {/*          channel.isLockable &&*/}
          {/*          channelStatus !== "LOCKED"*/}
          {/*            ? handleChannelLock*/}
          {/*            : undefined*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {t("channel.head.top:lock")}*/}
          {/*      </div>*/}
          {/*    </OverlayTrigger>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className="d-flex align-items-center"*/}
          {/*    style={{ marginRight: "0px" }}*/}
          {/*  >*/}
          {/*    <OverlayTrigger*/}
          {/*      placement="bottom"*/}
          {/*      delay={{ show: 150, hide: 100 }}*/}
          {/*      trigger={["hover", "focus"]}*/}
          {/*      overlay={*/}
          {/*        <Tooltip id={t("header.tooltip:delete.discussion")}>*/}
          {/*          {t("header.tooltip:delete.discussion")}*/}
          {/*        </Tooltip>*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <div*/}
          {/*        className={`topBar__icon topBar__icon__deleteDiscussion ${*/}
          {/*          channel.isOwner &&*/}
          {/*          channel.isDeletable === true &&*/}
          {/*          channelStatus !== "DELETED"*/}
          {/*            ? "text-white"*/}
          {/*            : "disabled"*/}
          {/*        }`}*/}
          {/*        onClick={*/}
          {/*          channel.isOwner &&*/}
          {/*          channel.isAdvanced &&*/}
          {/*          channel.isDeletable &&*/}
          {/*          channelStatus !== "DELETED"*/}
          {/*            ? handleChannelDelete*/}
          {/*            : undefined*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {t("channel.head.top:delete")}*/}
          {/*      </div>*/}
          {/*    </OverlayTrigger>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    className="d-flex align-items-center"*/}
          {/*    style={{ marginRight: "0px" }}*/}
          {/*  ></div>*/}
          {/*</div>*/}
          <div className="d-flex align-items-center">
            {/*<OverlayTrigger*/}
            {/*  placement="bottom"*/}
            {/*  delay={{ show: 150, hide: 100 }}*/}
            {/*  trigger={["hover", "focus"]}*/}
            {/*  overlay={*/}
            {/*    <Tooltip id={t("header.tooltip:advanced.security")}>*/}
            {/*      {t("header.tooltip:advanced.security")}*/}
            {/*    </Tooltip>*/}
            {/*  }*/}
            {/*>*/}
            {/*  <div*/}
            {/*    className={`topBar__icon topBar__icon__safeDiscussion ${*/}
            {/*      channel.isAdvanced === true ? "" : "disabled"*/}
            {/*    }`}*/}
            {/*    onClick={channel.isAdvanced ? handleChannelAdvanced : undefined}*/}
            {/*    ref={advancedRef}*/}
            {/*  >*/}
            {/*    <Overlay*/}
            {/*      show={showDetails}*/}
            {/*      target={detailsTarget}*/}
            {/*      placement="bottom"*/}
            {/*      container={advancedRef.current}*/}
            {/*      containerPadding={10}*/}
            {/*      rootClose={true}*/}
            {/*      rootCloseEvent={"click"}*/}
            {/*      onHide={() => {*/}
            {/*        setShowDetails(!showDetails);*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <Popover id="popover-contained">*/}
            {/*        <Popover.Title as="h3" className="advanced-security-header">*/}
            {/*          <img*/}
            {/*            className="advanced-security-header-img"*/}
            {/*            src={advancedSecurity}*/}
            {/*            alt={"advanced-security"}*/}
            {/*          />*/}
            {/*          {t("advanced.security.popover:advanced.security")}*/}
            {/*        </Popover.Title>*/}
            {/*        <Popover.Content>*/}
            {/*          {channel.isConfidential && (*/}
            {/*            <div>*/}
            {/*              <div className="advanced-security-sub-heading">*/}
            {/*                {t(*/}
            {/*                  "advanced.security.popover:confidentiality.agreement"*/}
            {/*                )}*/}
            {/*              </div>*/}
            {/*              <div className="advanced-security-text">*/}
            {/*                {t(*/}
            {/*                  "advanced.security.popover:confidentiality.agreement.text"*/}
            {/*                )}*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          )}*/}
            {/*          {channel.isDeletable && (*/}
            {/*            <div>*/}
            {/*              <div className="advanced-security-sub-heading">*/}
            {/*                {t("advanced.security.popover:delete")}*/}
            {/*              </div>*/}
            {/*              <div className="advanced-security-text">*/}
            {/*                {t("advanced.security.popover:delete.text", {*/}
            {/*                  creator: channel.creator,*/}
            {/*                })}*/}
            {/*                <span className="advanced-security-text-strong">*/}
            {/*                  &nbsp;*/}
            {/*                  {t(*/}
            {/*                    "advanced.security.popover:delete.text.strong"*/}
            {/*                  )}*/}
            {/*                </span>*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          )}*/}
            {/*          {channel.isLockable && (*/}
            {/*            <div>*/}
            {/*              <div className="advanced-security-sub-heading">*/}
            {/*                {t("advanced.security.popover:archive")}*/}
            {/*              </div>*/}
            {/*              <div className="advanced-security-text">*/}
            {/*                {t("advanced.security.popover:archive.text", {*/}
            {/*                  creator: channel.creator,*/}
            {/*                })}*/}
            {/*                <span className="advanced-security-text-strong">*/}
            {/*                  &nbsp;*/}
            {/*                  {t(*/}
            {/*                    "advanced.security.popover:archive.text.strong"*/}
            {/*                  )}*/}
            {/*                </span>*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          )}*/}
            {/*        </Popover.Content>*/}
            {/*      </Popover>*/}
            {/*    </Overlay>*/}
            {/*  </div>*/}
            {/*</OverlayTrigger>*/}
            {/*<OverlayTrigger*/}
            {/*  placement="bottom"*/}
            {/*  delay={{ show: 150, hide: 100 }}*/}
            {/*  trigger={["hover", "focus"]}*/}
            {/*  show={showTooltip}*/}
            {/*  overlay={*/}
            {/*    <Tooltip id={t("header.tooltip:notifications")}>*/}
            {/*      {t("header.tooltip:notifications")}*/}
            {/*    </Tooltip>*/}
            {/*  }*/}
            {/*>*/}
            {/*  <div*/}
            {/*    className={`topBar__icon ${showBg === true ? "active" : ""}`}*/}
            {/*  >*/}
            {/*    <Notifications*/}
            {/*      showToolTip={(val) => setShowTooltip(val)}*/}
            {/*      setShowBg={(val) => setShowBg(val)}*/}
            {/*      showBg={showBg}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</OverlayTrigger>*/}

            {openSearch ? searchComponents : defaultComponents}
            {!openSearch && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip id={t("header.tooltip:summary")}>
                    {t("header.tooltip:summary")}
                  </Tooltip>
                }
              >
                <div
                  onClick={props.onToggleChannelDetails}
                  className={`topBar__icon topBar__icon__summary ${
                    summaryPanelActive ? "active" : ""
                  }`}
                  id={summaryPanelActive ? "opened" : ""}
                  style={{ marginRight: "16px" }}
                >
                  <img
                    id="icon"
                    src={summaryPanelActive ? SummaryToggle : SummaryToggle}
                    alt={"channel details"}
                  />
                </div>
              </OverlayTrigger>
            )}
          </div>
        </DiscussionActions>
      </div>
    </div>
  );
}

export default ChannelHeadTop;
