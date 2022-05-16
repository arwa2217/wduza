import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DefaultUser from "../../../assets/icons/default-user.svg";
import LocalDateTime from "../../local-date-time/local-date-time";
import "./summaryList.css";

const Member = ({ user, current, eventTime }) => {
  const { t } = useTranslation();
  let affiliation = true;
  if (user.affiliation === "" || user.affiliation === "undefined") {
    affiliation = false;
  }
  return (
    <div className="member-wrapper" onClick={() => {}}>
      <div className="member-info">
        <span className="user-image">
          <img src={user.userImg ? user.userImg : DefaultUser} alt="user-pic" />
        </span>
        <div className="member-desc">
          <div className="d-flex">
            <span className="span_ellipsis user-name">{user.screenName}</span>{" "}
            {current && <span> ({t("user.profile:you")})</span>}{" "}
          </div>
          <span className="job-desc">
            {`${user.jobTitle} ${user.jobTitle ? "@" : ""} ${user.affiliation}`}
            {affiliation && <span>&nbsp;{`(${user.companyName})`}</span>}
            {!affiliation && <span>{`${user.companyName}`}</span>}
          </span>
          <LocalDateTime eventTime={user?.timeStamp} />
        </div>
      </div>
    </div>
  );
};

const SummaryList = (props) => {
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  let currentUserDetails = useMemo(() => {
    let members = {};
    globalMembersList.map((member) => (members[member.id] = member));
    return props.data.map((user) => {
      return {
        ...members[user.userId],
        location: user.location,
        timeStamp: new Date(user?.timestamp).getTime(),
      };
    });
  }, [props.data, globalMembersList]);
  return (
    <>
      {currentUserDetails?.length ? (
        currentUserDetails.map((dataItem, ind) => {
          const isCurrentUser = dataItem.id === currentUserId;
          return (
            <div className="summary-container files-summery-container">
              <Member user={dataItem} current={isCurrentUser} />
              <div className="member-status">
                {dataItem.location === "OUTSIDE_OFFICE" ? (
                  <span className="out">Out</span>
                ) : (
                  <span className="in">In</span>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default SummaryList;
