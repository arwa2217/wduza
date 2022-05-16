import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultUser from "../../../assets/icons/default-user.svg";
import { fetchDiscussionHistoryListData } from "../../../store/actions/admin-discussion-action";
import { getAllUser } from "../../../utilities/caching/db-helper";
import { useTranslation } from "react-i18next";
import "./discussion.css";
export default function Discussion(props) {
  const { t } = useTranslation();
  const discussionHistoryListData = useSelector(
    (state) => state.AdminDiscussionReducer.discussionHistoryListData
  );
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const dispatch = useDispatch();
  const [discussionDetails, setDiscussionDetails] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    dispatch(fetchDiscussionHistoryListData(adminSelectedRow?.id));
  }, [adminSelectedRow]);
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
    if (discussionHistoryListData) {
      let discussionHistoryData = [];
      discussionHistoryListData.map((discussionItem) => {
        let discussionObj = {
          action: discussionItem.action,
          timestamp: discussionItem?.timestamp,
          screenNameOn: discussionItem?.actionTakenOnScreenName,
          idOn: discussionItem.actionTakenOnUserId,
          screenNameBy: discussionItem?.actionTakenByScreenName,
          idBy: discussionItem.actionTakenByUserId,
        };
        discussionHistoryData.push(discussionObj);
        setDiscussionDetails(discussionHistoryData);
        return discussionItem;
      });
    }
  }, [discussionHistoryListData]);
  const getImg = (userId) => {
    let memberData = members?.find((memberItem) => memberItem.id == userId);
    return memberData?.userImg;
  };
  return (
    <div className="w-100 d-block border-top member-wrapper pd-20">
      {discussionDetails.length > 0 ? (
        discussionDetails.map((discussionDataItem, index) => {
          return (
            <div className="discussion-history" key={`history-${index}`}>
              <div className="task-header mb-0">
                <div className="w-100 task-ownership">
                  <span style={{ color: '#19191A'}}>
                    {t(
                      `admin:discussion.management:discussion.history:${discussionDataItem.action}`
                    )}
                    {" "}by
                    <span
                      className="task-assigned"
                      style={{ marginLeft: "4px" }}
                    >
                      @{discussionDataItem?.screenNameBy}
                    </span>
                  </span>
                  <span
                    className="task-creation-date"
                    style={{ marginLeft: "4px" }}
                  >
                    {t("tagTime", {
                      date: discussionDataItem?.timestamp,
                    })}
                  </span>
                </div>
              </div>
              {discussionDataItem.idOn && (
                <div className="member-info d-flex align-items-center justify-content-between">
                  <img
                    className="ui avatar image"
                    src={
                      getImg(discussionDataItem.idOn)
                        ? getImg(discussionDataItem.idOn)
                        : DefaultUser
                    }
                    alt=""
                  />
                  <div className="pl-1 w-100 member-desc">
                    <div>
                      <span
                        className="span_ellipsis"
                        style={{ fontSize: "14px", verticalAlign: "top", fontWeight : 700 }}
                      >
                        {discussionDataItem?.screenNameOn}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <hr />
            </div>
          );
        })
      ) : (
        <div className="d-flex justify-content-center">
          {t("no.data.available")}
        </div>
      )}
    </div>
  );
}
