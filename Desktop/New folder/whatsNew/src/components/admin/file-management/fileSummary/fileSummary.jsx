import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import SummaryList from "../summaryList/summaryList";
import { FileStatsType } from "../../../../constants/channel/file-upload-status";
const postsPerPage = 20;
const fileSummary = (props) => {
  const { t } = useTranslation();
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const dispatch = useDispatch();
  const [key, setKey] = useState("viewed");

  const onSelectedTab = (k) => {
    if (key === k) {
      setKey(k);
    } else {
      setKey(k);
    }
  };
  const getUserData = (userInfo, type) => {
    if (userInfo && userInfo.length > 0) {
      let memberData = userInfo[0].fileDLStats?.stats.find((fileItem) => {
        if (fileItem.type === type) {
          return fileItem.users;
        }
      });
      return memberData?.users ?? [];
    } else {
      return [];
    }
  };
  return (
    <div className="files-panel-tab">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => {
          onSelectedTab(k);
        }}
      >
        <Tab eventKey={"viewed"} title={t("files:summary.viewed")}>
          <SummaryList
            type={FileStatsType.VIEWED}
            data={getUserData(props?.userInfo, FileStatsType.VIEWED)}
          />
        </Tab>
        <Tab eventKey={"downloaded"} title={t("files:summary.downloaded")}>
          <SummaryList
            type={FileStatsType.DOWNLOADED}
            data={getUserData(props?.userInfo, FileStatsType.DOWNLOADED)}
          />
        </Tab>
        <Tab eventKey={"forwarded"} title={t("files:summary.forwarded")}>
          <SummaryList
            type={FileStatsType.FORWARDED}
            data={getUserData(props?.userInfo, FileStatsType.FORWARDED)}
          />
        </Tab>
        <Tab eventKey={"shared"} title={t("files:summary.shared")}>
          <SummaryList
            type={FileStatsType.SHARED}
            data={getUserData(props?.userInfo, FileStatsType.SHARED)}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default fileSummary;
