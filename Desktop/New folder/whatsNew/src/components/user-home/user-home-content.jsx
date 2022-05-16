import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import UserHomeCard from "./user-home-card";
import { HomeItems, HomeTabs } from "./home-utils";
import HomeNotificationsTab from "./home-notifications-tab";
import HomePostsTab from "./home-posts-tab";
import HomeTasksTab from "./home-tasks-tab";
import ContactsPanel from "./contacts-panel";
import { useSelector, useDispatch } from "react-redux";
import { ReplyViewStyle } from "../post-view/reply-view/replyView.style";
import {
  getDashboardData,
  getDashboardPostData,
  getNotificationData,
  getDashboardTasksData,
} from "../../store/actions/user-home-actions";
import useInterval from "./common-use-interval";
const UserHomeContent = (props) => {
  const { t } = useTranslation();

  const [isEnable, setIsEnable] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const cidName = useSelector((state) => state.AuthReducer?.user?.companyName);
  const dashboardCount = useSelector((state) => state.userHome.dashboardCount);
  const initCalled = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!initCalled.current) {
      dispatch(getDashboardData());
      initCalled.current = true;
    }
  }, []);

  useEffect(() => {
    if (activeTab === HomeTabs.NOTIFICATIONS) {
      dispatch(getNotificationData(0, 20));
    } else if (activeTab === HomeTabs.TAGGED_POSTS) {
      dispatch(getDashboardPostData(0, 20));
    } else if (activeTab === HomeTabs.TASKS) {
      dispatch(getDashboardTasksData(0, 20));
    }
  }, [activeTab]);

  useInterval(() => {
    dispatch(getDashboardData());
    if (!initCalled.current) {
      initCalled.current = true;
    }
    if (activeTab === HomeTabs.NOTIFICATIONS) {
      dispatch(getNotificationData(0, 20));
    } else if (activeTab === HomeTabs.TAGGED_POSTS) {
      dispatch(getDashboardPostData(0, 20));
    } else if (activeTab === HomeTabs.TASKS) {
      dispatch(getDashboardTasksData(0, 20));
    }
  }, 600000);

  return (
    <div
      className="d-flex flex-column w-100 home-content"
      onMouseUp={(e) => {
        if (isEnable) {
          setIsEnable(false);
          e.stopPropagation();
          e.preventDefault();
        }
        return false;
      }}
      onMouseMove={(e) => {
        if (isEnable) {
          let pos = e.clientX;
          let min = window.innerWidth / 2;
          let max = window.innerWidth - 250;
          if (pos > min && pos < max) {
            document.getElementById("right-details").style.width =
              window.innerWidth - pos + "px";
          }
        }
      }}
    >
      <ReplyViewStyle />
      <Row className="flex-nowrap flex-row m-0">
        <Col id="left-messagetab" className="message-tab">
          <Row className="m-0">
            <Col
              className="channel-head-wrap-bg p-0"
              style={{ background: "#f8f8f8" }}
              // style={{ background: "#FFEA00" }}
            >
              <Col
                xs={12}
                className="channel-head-wrap"
                // style={{ background: "#FF1493" }}
              >
                <div className="channel_header">
                  <div className="home-header">
                    {t("user.summary:cid.name", { cidName })}
                  </div>
                </div>
              </Col>
              <Col xs={12} className="home-summary-content ml-0 pl-0 mr-0 pr-0">
                <div className="summary-title">
                  <div className="home-summary-new">
                    {t("user.summary:whats.new")}
                  </div>
                </div>

                <Row className="m-0 g-3 main-card custom-card-col">
                  {/* <ul
                    style={{
                      textDecoration: "none",
                      padding: "0px",
                      display:"flex"
                    }}
                  > */}
                  {HomeItems(t, dashboardCount).length > 0 &&
                    HomeItems(t, dashboardCount).map((item) => {
                      return (
                        // <li style={{ display: "block", maxWidth: "271px",marginRight:"10px" }}>
                        <UserHomeCard
                          key={`user-home-card-${item.id}`}
                          item={item}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                        // </li>
                      );
                    })}{" "}
                  {/* </ul> */}
                </Row>

                <div>
                  {activeTab === HomeTabs.NOTIFICATIONS ? (
                    <HomeNotificationsTab
                      isActive={activeTab === HomeTabs.NOTIFICATIONS}
                    />
                  ) : activeTab === HomeTabs.TAGGED_POSTS ? (
                    <HomePostsTab
                      isActive={activeTab === HomeTabs.TAGGED_POSTS}
                    />
                  ) : activeTab === HomeTabs.TASKS ? (
                    <HomeTasksTab isActive={activeTab === HomeTabs.TASKS} />
                  ) : (
                    <span />
                  )}
                </div>
              </Col>
            </Col>
          </Row>
        </Col>

        {props.isActive && (
          <div
            onMouseDown={(e) => {
              if (!isEnable) {
                setIsEnable(true);
                e.stopPropagation();
                e.preventDefault();
              }
              return false;
            }}
          >
            <hr className="width-resize-details" />
          </div>
        )}
        {props.isActive && <ContactsPanel />}
      </Row>
    </div>
  );
};

export default UserHomeContent;
