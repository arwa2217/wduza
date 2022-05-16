import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import DashboardPostItem from "./dashboard-post";
import { getDashboardPostData } from "../../store/actions/user-home-actions";
import { RESET_HOME_TAGGED_POST_DATA } from "../../store/actionTypes/user-home-action-types";
const postsPerPage = 20;

const HomePostsTab = () => {
  const { t } = useTranslation();
  const dashboardPostData = useSelector(
    (state) => state.userHome.dashboardPostData
  );
  const [allMessages, setAllMessages] = useState([]);
  const [allDecisionTagged, setAllDecisionTagged] = useState([]);
  const [allFollowUpTagged, setAllFollowUpTagged] = useState([]);
  const [allImportantTagged, setAllImportantTagged] = useState([]);
  const discCount = useSelector((state) => state.userHome.subCount);
  const dispatch = useDispatch();

  // const [allQuestionTagged, setAllQuestionTagged] = useState([]);
  const [allQuestionTagged, setAllQuestionTagged] = useState([]);

  useEffect(() => {
    var allCount = 0;
    var decisionCount = 0;
    var questionCount = 0;
    var followUpCount = 0;
    var importantCount = 0;
    discCount &&
      discCount.forEach((item) => {
        if (item.tag_name === "DECISION") {
          decisionCount += item.count;
        } else if (item.tag_name === "QUESTION") {
          questionCount += item.count;
        } else if (item.tag_name === "FOLLOW-UP") {
          followUpCount += item.count;
        } else if (item.tag_name === "IMPORTANT") {
          importantCount += item.count;
        }
        allCount += item.count;
      });
    setAllMessages(allCount);
    setAllDecisionTagged(decisionCount);
    setAllQuestionTagged(questionCount);
    setAllFollowUpTagged(followUpCount);
    setAllImportantTagged(importantCount);
  }, [dashboardPostData]);

  const [key, setKey] = useState("all");

  const onSelectedTab = (k) => {
    if (key === k) {
      setKey(k);
    } else {
      setKey(k);
      let tag_name = undefined;
      if (k === "decision") {
        tag_name = "DECISION";
      } else if (k === "important") {
        tag_name = "IMPORTANT";
      } else if (k === "follow-up") {
        tag_name = "FOLLOW-UP";
      } else if (k === "question") {
        tag_name = "QUESTION";
      }

      dispatch({
        type: RESET_HOME_TAGGED_POST_DATA,
        payload: { activeTab: k },
      });
      dispatch(getDashboardPostData(0, postsPerPage, tag_name));
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
          <DashboardPostItem
            discussions={dashboardPostData}
            currKey={key}
            tabName={"all"}
          />
        </Tab>
        <Tab
          eventKey={"decision"}
          title={t("user.summary:decision", {
            count: allDecisionTagged ? allDecisionTagged : "",
          })}
        >
          <DashboardPostItem
            discussions={dashboardPostData}
            currKey={key}
            tabName={"decision"}
          />
        </Tab>
        <Tab
          eventKey={"follow-up"}
          title={t("user.summary:follow-up", {
            count: allFollowUpTagged ? allFollowUpTagged : "",
          })}
        >
          {/* {t("follow-up")} */}
          <DashboardPostItem
            discussions={dashboardPostData}
            currKey={key}
            tabName={"follow-up"}
          />
        </Tab>
        <Tab
          eventKey={"important"}
          title={t("user.summary:important", {
            count: allImportantTagged ? allImportantTagged : "",
          })}
        >
          {/* {t("important")} */}
          <DashboardPostItem
            discussions={dashboardPostData}
            currKey={key}
            tabName={"important"}
          />
        </Tab>
        <Tab
          eventKey={"question"}
          title={t("user.summary:question", {
            count: allQuestionTagged ? allQuestionTagged : "",
          })}
        >
          {/* {t("question")} */}
          <DashboardPostItem
            discussions={dashboardPostData}
            currKey={key}
            tabName={"question"}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomePostsTab;
