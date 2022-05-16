import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "./notification-item";
import { useEffect } from "react";
import { getAllUser } from "../../utilities/caching/db-helper";
import { RESET_HOME_NOTIFICATION_DATA } from "../../store/actionTypes/user-home-action-types";
import { getNotificationData } from "../../store/actions/user-home-actions";

const postsPerPage = 20;
const HomeNotificationsTab = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [key, setKey] = useState("all");
  const discCount = useSelector((state) => state.userHome.subCount);

  const [allMessages, setAllMessages] = useState([]);
  const [invitationCount, setInvitationCount] = useState([]);
  const [mentionCount, setMentionCount] = useState([]);
  const [reactionCount, setReactionCount] = useState([]);
  const [allTaggedCount, setTaggedCount] = useState([]);
  const [allRepliedCount, setRepliedCount] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    getAllUser().then((res) => {
      var tempMembers = [...members];
      res.map((userData) => {
        if (tempMembers.indexOf(userData) === -1) {
          tempMembers.push(userData.user);
        }
        return true;
      });
      setMembers(tempMembers);
    });
  }, []);

  useEffect(() => {
    var allCount = 0;
    var invitationCount = 0;
    var mentionCount = 0;
    var reactionCount = 0;
    var taggedCount = 0;
    var repliedCount = 0;
    discCount &&
      discCount.forEach((items) => {
        if (items.type === "reaction") {
          reactionCount += items.count;
        } else if (items.type === "mention") {
          mentionCount += items.count;
        } else if (items?.subType === "tagged") {
          taggedCount += items.count;
        } else if (
          items.type === "channel" &&
          (items.subType === "added" ||
            items.subType === "removed" ||
            items.subType === "invited") &&
          items.subType !== "tagged" &&
          items.subType !== "replied"
        ) {
          invitationCount += items.count;
        }
        allCount += items.count;
      });

    setAllMessages(allCount);
    setInvitationCount(invitationCount);
    setMentionCount(mentionCount);
    setReactionCount(reactionCount);
    setTaggedCount(taggedCount);
    setRepliedCount(repliedCount);
  }, [discCount]);

  const onSelectedTab = (k) => {
    if (key === k) {
      setKey(k);
    } else {
      setKey(k);
      let type = undefined,
        subType = undefined;
      if (k === "invitation") {
        type = "channel";
        subType = "added,invited";
      } else if (k === "mention") {
        type = "mention";
        subType = "added";
      } else if (k === "reaction") {
        type = "reaction";
        subType = "+1,-1,Checked";
      } else if (k === "tagged") {
        type = "channel";
        subType = "tagged";
      } else if (k === "replied") {
        type = "channel";
        subType = "replied";
      }

      dispatch({
        type: RESET_HOME_NOTIFICATION_DATA,
        payload: { activeTab: k },
      });
      dispatch(getNotificationData(0, postsPerPage, type, subType));
    }
  };

  return (
    <div className="home-panel-tab">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => {
          onSelectedTab(k);
        }}
      >
        <Tab
          eventKey={"all"}
          title={t("user.summary:all", {
            count: allMessages ? allMessages : "",
          })}
        >
          <NotificationItem tabName={"all"} currKey={key} members={members} />
        </Tab>
        <Tab
          eventKey={"invitation"}
          title={t("user.summary:invitation", {
            count: invitationCount ? invitationCount : "",
          })}
        >
          <NotificationItem
            tabName={"invitation"}
            currKey={key}
            members={members}
          />
        </Tab>
        <Tab
          eventKey={"mention"}
          title={t("user.summary:mention", {
            count: mentionCount ? mentionCount : "",
          })}
        >
          <NotificationItem
            tabName={"mention"}
            currKey={key}
            members={members}
          />
        </Tab>
        <Tab
          eventKey={"reaction"}
          title={t("user.summary:reaction", {
            count: reactionCount ? reactionCount : "",
          })}
        >
          <NotificationItem
            tabName={"reaction"}
            currKey={key}
            members={members}
          />
        </Tab>
        <Tab
          eventKey={"tagged"}
          title={t("user.summary:tagged", {
            count: allTaggedCount ? allTaggedCount : "",
          })}
        >
          <NotificationItem
            tabName={"tagged"}
            currKey={key}
            members={members}
          />
        </Tab>
        <Tab
          eventKey={"replied"}
          title={t("user.summary:replied", {
            count: allRepliedCount ? allRepliedCount : "",
          })}
        >
          <NotificationItem
            tabName={"replied"}
            currKey={key}
            members={members}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomeNotificationsTab;
