import React, { useEffect } from "react";

import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { GetLoginHistoryListAction } from "../../../store/actions/admin-account-action";
import { RESET_LOGIN_HISTORY_ACTION } from "../../../store/actionTypes/admin-account-action-types";

const postsPerPage = 10;
let previousUserId;
export default function LoginHistory() {
  const showMore = useSelector((state) => state.AdminAccountReducer.showMore);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const requestOffSetLogin = useSelector(
    (state) => state.AdminAccountReducer.requestOffsetLogin
  );

  let loginHistoryData = useSelector(
    (state) => state.AdminAccountReducer.accountLoginHistory
  );
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
          GetLoginHistoryListAction({
            userId: selectedUserId,
            filter: "",
            offset: requestOffSetLogin,
            count: postsPerPage,
          })
        );
      }, 50);
      dispatch({ type: RESET_LOGIN_HISTORY_ACTION });
    }
  }, [selectedUserId]);

  const handleShowMorePosts = () => {
    if (!(loginHistoryData === null)) {
      dispatch(
        GetLoginHistoryListAction({
          userId: selectedUserId,
          filter: "",
          offset: requestOffSetLogin,
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
            <th>Action</th>
            <th className="text-center">Date</th>
            <th className="text-center">IP Address</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {loginHistoryData && loginHistoryData.length > 0 ? (
            loginHistoryData.map((item) => {
              return (
                <tr>
                  <td title={item.actionType} style={{ cursor: "default" }}>
                    {t(
                      `admin:account.management:login.history:${item.actionType}`
                    )}
                  </td>
                  <td
                    className="text-center"
                    title={moment(item.timestamp).format("YYYY-MM-DD HH:mm")}
                    style={{ cursor: "default" }}
                  >
                    {moment(item.timestamp).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td
                    className="text-center"
                    title={item.ipaddr}
                    style={{ cursor: "default" }}
                  >
                    {item.ipaddr}
                  </td>
                  <td className="position-relative text-right">
                    <div
                      className={`download-status ${
                        item.location === "INSIDE_OFFICE" ? "in" : "out"
                      }`}
                      style={{ marginTop: "-3px" }}
                    >
                      {item.location === "INSIDE_OFFICE" ? "In" : "Out"}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                {t("no.data.available")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="load-more-container text-center">
        {showMore && (
          <a className="load-more" onClick={handleShowMorePosts} href>
            {t("more")}
          </a>
        )}
      </div>
    </div>
  );
}
