import {
  PageHeading,
  DiscussionContainer,
  PageBody,
  Text,
  Terms,
} from "./new-discussion-style";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import WelcomeHeadTop from "../welcome/welcome-head-top";
import AgreementType from "./AgreementType";
import { setSelectedChannelAction } from "../../store/actions/config-actions";
import Panel from "../actionpanel/panel";
import discussionLock from "../../assets/icons/join-discussion-lock.svg";
import discussionDelete from "../../assets/icons/join-discussion-delete.svg";
import discussionConfidential from "../../assets/icons/join-discussion-confidential.svg";
import { PostRequiredActions } from "../../store/actions/user-actions";
import RequiredActionResp from "../../props/required-action-resp";
import { channelDetailAction } from "../../store/actions/channelActions";
import { CLEAN_MESSAGES } from "../../store/actionTypes/channelMessagesTypes";

function JoinDiscussionAgreement(props) {
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const activeChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const requestedChannel = props.channel;
  const [joining, setJoining] = useState(false);

  const agreementItemLockArchive = {
    type: AgreementType.LOCK_ARCHIVE,
    heading: t("discussion:discussion.agreement:lock.heading"),
    desc: t("discussion:discussion.agreement:lock.description"),
    imgSrc: discussionLock,
  };
  const agreementItemPermanentDelete = {
    type: AgreementType.PERMANENT_DELETE,
    heading: t("discussion:discussion.agreement:permanent.delete.heading"),
    desc: t("discussion:discussion.agreement:permanent.delete.description"),
    imgSrc: discussionDelete,
  };
  const agreementItemConfidential = {
    type: AgreementType.CONFIDENTIAL,
    heading: t("discussion:discussion.agreement:confidential.heading"),
    desc: t("discussion:discussion.agreement:confidential.description"),
    imgSrc: discussionConfidential,
  };
  const agreementListItems = [];
  useEffect(() => {
    if (requestedChannel.isConfidential) {
      agreementListItems.push(agreementItemConfidential);
    }
    if (requestedChannel.isLockable) {
      agreementListItems.push(agreementItemLockArchive);
    }

    if (requestedChannel.isDeletable) {
      agreementListItems.push(agreementItemPermanentDelete);
    }
  }, [requestedChannel]);
  const agreementListItem = () => {
    let list = [];
    if (requestedChannel.isConfidential) {
      list.push(agreementItemConfidential);
    }
    if (requestedChannel.isLockable) {
      list.push(agreementItemLockArchive);
    }

    if (requestedChannel.isDeletable) {
      list.push(agreementItemPermanentDelete);
    }
    return list;
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--post-height", "154px");
  }, []);

  function acceptAndJoinChannel(e) {
    e.preventDefault();
    let body = JSON.stringify({
      actionType: "JOIN_CHANNEL",
      channelId: requestedChannel.id,
      actionResponse: RequiredActionResp.ACCEPT,
    });
    dispatch(
      PostRequiredActions(body, dispatch, () => {
        dispatch(channelDetailAction(requestedChannel.id));
        setJoining(true);
        setTimeout(() => {
          dispatch({
            type: CLEAN_MESSAGES,
            payload: { channelId: activeChannel.id },
          });
        }, 200);
        setTimeout(() => {
          dispatch(setSelectedChannelAction(Panel.CHANNEL, requestedChannel));
          setJoining(false);
        }, 2000);
      })
    );
  }

  function declineAndLeaveChannel(e) {
    e.preventDefault();
    let body = JSON.stringify({
      actionType: "JOIN_CHANNEL",
      channelId: requestedChannel.id,
      actionResponse: RequiredActionResp.DECLINE,
    });
    dispatch(PostRequiredActions(body, dispatch));
    //If user decline then move to Welcome page
    if (currentUser.userType === "GUEST") {
      setTimeout(() => {
        if (channelList.length === 0) {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        } else {
          dispatch(setSelectedChannelAction(Panel.CHANNEL, channelList[0].id));
        }
      }, 1000);
    } else {
      dispatch(setSelectedChannelAction(Panel.WELCOME));
    }
    //To remove the channel from the channel list
  }

  function getAgreementListItems() {
    const items = agreementListItem();
    const listItems = items.map((item) => (
      <div className="container-fluid mt-3 pl-0" key={item.heading + item.type}>
        <div className="row">
          <div className="col-auto align-content-center m-0 p-0">
            <img
              width="60px"
              height="60px"
              alt={item.imgSrc}
              src={item.imgSrc}
            ></img>
          </div>
          <div className="col container-fluid ml-0">
            <div className="row">
              <Terms maxWidth="90%">
                <strong>{item.heading}</strong>
                &nbsp;{item.desc}
              </Terms>
            </div>
          </div>
        </div>
      </div>
    ));
    return listItems;
  }

  return (
    <DiscussionContainer>
      <div className="channel-head-top">
        <WelcomeHeadTop />
      </div>
      <PageBody paddingRight="100px" marginLeft="4%">
        <PageHeading
          fontSize="34px"
          fontWeight="500"
          maxWidth="90%"
          marginLeft="5%"
        >
          {`${activeChannel.creator}` +
            t("discussion:discussion.agreement:collaborator.invitation")}
        </PageHeading>
        <Text fontSize="18px" paddingTop="30px" maxWidth="90%" marginLeft="5%">
          {t("discussion:discussion.agreement:advance.security.protocol")}
        </Text>
        <Text paddingTop="50px" fontSize="24px" maxWidth="90%" marginLeft="5%">
          {t("discussion:discussion.agreement:means")}
        </Text>
        <div className="container-fluid mt-5 custom-margin">
          {getAgreementListItems()}
        </div>
        <div className="d-flex flex-row-reverse m-5 custom-width">
          <button
            className="btn px-5  btn-primary p-2 ml-3"
            onClick={acceptAndJoinChannel}
          >
            {joining && (
              <span className="spinner-border spinner-border-sm mr-1" />
            )}
            {t("discussion:discussion.agreement:accept&join")}
          </button>
          <button
            className="btn px-5 btn-light p-2 mr-3"
            onClick={declineAndLeaveChannel}
          >
            {t("discussion:discussion.agreement:decline&leave")}
          </button>
        </div>
      </PageBody>
    </DiscussionContainer>
  );
}

export default JoinDiscussionAgreement;
