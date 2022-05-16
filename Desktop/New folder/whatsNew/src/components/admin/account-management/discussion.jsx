import React, { useEffect } from "react";

import Table from "react-bootstrap/Table";
import ExternalDiscussion from "./../../../assets/icons/external-discussion.svg";
import InternalDiscussion from "./../../../assets/icons/internal-discussion.svg";
import GuestDiscussion from "./../../../assets/icons/guest-discussion.svg";
import { RESET_DISCUSSION_LIST_ACTION } from "../../../store/actionTypes/admin-account-action-types";

import { fetchUserDiscussionsList } from "../../../store/actions/admin-account-action";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TextLink } from "../../shared/styles/mainframe.style";
import "./account-management.css";
const postsPerPage = 10;
let previousUserId;
export default function Discussion() {
  const showInternal = useSelector(
    (state) => state.AdminAccountReducer.showInternal
  );
  const showExternal = useSelector(
    (state) => state.AdminAccountReducer.showExternal
  );
  const showGuest = useSelector((state) => state.AdminAccountReducer.showGuest);

  let internalDiscussionList = useSelector(
    (state) => state.AdminAccountReducer.internalDiscussionList
  );
  let externalDiscussionList = useSelector(
    (state) => state.AdminAccountReducer.externalDiscussionList
  );
  let guestDiscussionList = useSelector(
    (state) => state.AdminAccountReducer.guestDiscussionList
  );
  const requestOffsetInternal = useSelector(
    (state) => state.AdminAccountReducer.requestOffsetInternal
  );
  const requestOffsetExternal = useSelector(
    (state) => state.AdminAccountReducer.requestOffsetExternal
  );
  const requestOffsetGuest = useSelector(
    (state) => state.AdminAccountReducer.requestOffsetGuest
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedUserId = useSelector(
    (state) => state.config.adminSelectedRow?.id
  );

  useEffect(() => {
    if (
      selectedUserId &&
      (previousUserId === "" || selectedUserId !== previousUserId)
    ) {
      previousUserId = selectedUserId;
      setTimeout(() => {
        dispatch(
          fetchUserDiscussionsList({
            userId: selectedUserId,
            channelType: "INTERNAL",
            offset: requestOffsetInternal,
            count: postsPerPage,
          })
        );
        dispatch(
          fetchUserDiscussionsList({
            userId: selectedUserId,
            channelType: "EXTERNAL",
            offset: requestOffsetExternal,
            count: postsPerPage,
          })
        );
        dispatch(
          fetchUserDiscussionsList({
            userId: selectedUserId,
            channelType: "GUEST",
            offset: requestOffsetGuest,
            count: postsPerPage,
          })
        );
      }, 50);
      dispatch({ type: RESET_DISCUSSION_LIST_ACTION });
    }
  }, [selectedUserId]);

  const handleShowMoreDiscussion = () => {
    if (!(internalDiscussionList === null)) {
      dispatch(
        fetchUserDiscussionsList({
          userId: selectedUserId,
          channelType: "INTERNAL",
          offset: requestOffsetInternal,
          count: postsPerPage,
        })
      );
    }
  };
  const handleShowMoreExternal = () => {
    if (!(externalDiscussionList === null)) {
      dispatch(
        fetchUserDiscussionsList({
          userId: selectedUserId,
          channelType: "EXTERNAL",
          offset: requestOffsetExternal,
          count: postsPerPage,
        })
      );
    }
  };
  const handleShowMoreGuestDisc = () => {
    if (!(guestDiscussionList === null)) {
      dispatch(
        fetchUserDiscussionsList({
          userId: selectedUserId,
          channelType: "GUEST",
          offset: requestOffsetGuest,
          count: postsPerPage,
        })
      );
    }
  };
  return (
    <div className="w-100 pd-20 border-top">
      <Table className="custom-sidebar-table">
        <thead>
          <tr>
            <th>
              <div className="d-flex justify-content-between position-relative">
                {t("admin:account.management:discussion.list:internal")}{" "}
                <img
                  src={InternalDiscussion}
                  title="Internal"
                  style={{ position: "absolute", top: "-3px", right: "0" }}
                  alt=""
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {internalDiscussionList && internalDiscussionList.length > 0 ? (
            internalDiscussionList.map((item) => {
              if (item.type === "INTERNAL") {
                return (
                  <tr>
                    <td>
                      {item.name}
                      {item.isOwner && (
                        <span className="owner-label">
                          {t("admin:account.management:discussion.list:owner")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              } else {
                return <span />;
              }
            })
          ) : (
            <td className="text-center">{t("no.data.available")}</td>
          )}
        </tbody>
        {showInternal && (
          <div class="col-12 p-0 pt-3 text-center">
            <TextLink
              to={"#"}
              default={true}
              underline={`true`}
              small={`true`}
              onClick={handleShowMoreDiscussion}
            >
              {t("more")}
            </TextLink>
          </div>
        )}
      </Table>
      <Table className="custom-sidebar-table">
        <thead>
          <tr>
            <th>
              <div className="d-flex justify-content-between position-relative">
                {t("admin:account.management:discussion.list:external")}{" "}
                <img
                  src={ExternalDiscussion}
                  title="External"
                  style={{ position: "absolute", top: "-3px", right: "0" }}
                  alt=""
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {externalDiscussionList && externalDiscussionList.length > 0 ? (
            externalDiscussionList.map((item) => {
              if (item.type === "EXTERNAL") {
                return (
                  <tr>
                    <td>
                      {item.name}
                      {item.isOwner && (
                        <span className="owner-label">
                          {t("admin:account.management:discussion.list:owner")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              } else {
                return <span />;
              }
            })
          ) : (
            <td className="text-center">{t("no.data.available")}</td>
          )}
        </tbody>
        {showExternal && (
          <div class="col-12 p-0 pt-3 text-center">
            <TextLink
              to={"#"}
              default={true}
              underline={`true`}
              small={`true`}
              onClick={handleShowMoreExternal}
            >
              {t("more")}
            </TextLink>
          </div>
        )}
      </Table>

      <Table className="custom-sidebar-table">
        <thead>
          <tr>
            <th>
              <div className="d-flex justify-content-between position-relative">
                {t("admin:account.management:discussion.list:guest")}{" "}
                <img
                  src={GuestDiscussion}
                  title="Guest"
                  style={{ position: "absolute", top: "-3px", right: "0" }}
                  alt=""
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {guestDiscussionList && guestDiscussionList.length > 0 ? (
            guestDiscussionList.map((item) => {
              if (item.type === "GUEST") {
                return (
                  <tr>
                    <td>
                      {item.name}
                      {item.isOwner && (
                        <span className="owner-label">
                          {t("admin:account.management:discussion.list:owner")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              } else {
                return <span />;
              }
            })
          ) : (
            <tr>
              <td className="text-center">{t("no.data.available")}</td>
            </tr>
          )}
          {showGuest && (
            <div class="col-12 p-0 pt-3 text-center">
              <TextLink
                to={"#"}
                default={true}
                underline={`true`}
                small={`true`}
                onClick={handleShowMoreGuestDisc}
              >
                {t("more")}
              </TextLink>
            </div>
          )}
        </tbody>
      </Table>
    </div>
  );
}
