import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import DashboardTaskData from "./dashboard-task-items";
// import { getDashboardPostData } from "../../store/actions/user-home-actions";
import { getDashboardTasksData } from "../../store/actions/user-home-actions";
import { RESET_HOME_TASK_DATA } from "../../store/actionTypes/user-home-action-types";

const postsPerPage = 20;

const HomeTasksTab = () => {
  const { t } = useTranslation();

  const dashboardTaskData = useSelector(
    (state) => state.userHome.dashboardTaskData
  );
  const [allTasks, setAllTasks] = useState([]);
  const [allAssignedTask, setAllAssignedTask] = useState([]);
  const [allToDoTask, setAllToDoTask] = useState([]);
  const [allInProgressTask, setAllInProgressTask] = useState([]);
  const [allDoneTask, setAllDoneTask] = useState([]);
  const [allCancelledTask, setAllCancelledTask] = useState([]);

  const [allPendingTask, setAllPendingTask] = useState([]);
  const subCount = useSelector((state) => state.userHome.subCount);
  const dispatch = useDispatch();

  useEffect(() => {
    var allCount = 0;
    var assignTaskCount = 0;
    var toDoTaskCount = 0;
    var inProgressTask = 0;
    var pendingTask = 0;
    var doneTask = 0;
    let cancelledTask = 0;
    subCount &&
      subCount.length > 0 &&
      subCount.forEach((item) => {
        if (item.taskStatus === "ASSIGN") {
          assignTaskCount += item.count;
        } else if (item.taskStatus === "TODO") {
          toDoTaskCount += item.count;
        } else if (item.taskStatus === "INPROGRESS") {
          inProgressTask += item.count;
        } else if (item.taskStatus === "PENDING") {
          pendingTask += item.count;
        } else if (item.taskStatus === "DONE") {
          doneTask += item.count;
        } else if (item.taskStatus === "CANCELED") {
          cancelledTask += item.count;
        }
        allCount += item.count;
      });

    setAllTasks(allCount);
    setAllAssignedTask(assignTaskCount);
    setAllToDoTask(toDoTaskCount);
    setAllInProgressTask(inProgressTask);
    setAllDoneTask(doneTask);
    setAllCancelledTask(cancelledTask);
    setAllPendingTask(pendingTask);
  }, [dashboardTaskData]);
  const [key, setKey] = useState("all");
  const [assignFilter, setAssignFilter] = useState("all");

  const [defaultChecked, setCheckedFilter] = useState("");

  const setAssignToMetasks = (e, value) => {
    if (defaultChecked === value) {
      setCheckedFilter("");
    } else {
      setCheckedFilter(value);
    }
    setAssignFilter(value);
    let k = key;
    let task_type = undefined;
    if (k === "todo") {
      task_type = "TODO";
    } else if (k === "assigned") {
      task_type = "ASSIGN";
    } else if (k === "in-progress") {
      task_type = "INPROGRESS";
    } else if (k === "pending") {
      task_type = "PENDING";
    } else if (k === "done") {
      task_type = "DONE";
    } else if (k === "cancelled") {
      task_type = "CANCELED";
    }

    dispatch({ type: RESET_HOME_TASK_DATA, payload: { activeTab: k } });
    if (e.target.checked) {
      dispatch(getDashboardTasksData(0, postsPerPage, task_type, value));
    } else {
      dispatch(getDashboardTasksData(0, postsPerPage, task_type));
    }
  };

  const onSelectedTab = (k) => {
    if (key === k) {
      setKey(k);
    } else {
      setKey(k);
      let task_type = undefined;
      if (k === "todo") {
        task_type = "TODO";
      } else if (k === "assigned") {
        task_type = "ASSIGN";
      } else if (k === "in-progress") {
        task_type = "INPROGRESS";
      } else if (k === "pending") {
        task_type = "PENDING";
      } else if (k === "done") {
        task_type = "DONE";
      } else if (k === "cancelled") {
        task_type = "CANCELED";
      }

      dispatch({ type: RESET_HOME_TASK_DATA, payload: { activeTab: k } });
      dispatch(
        getDashboardTasksData(
          0,
          postsPerPage,
          task_type,
          assignFilter ? assignFilter : ""
        )
      );
    }
  };

  return (
    <>
      <div className="home-panel-tab">
        <div className="tabs-wrapper">
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
                count: allTasks ? allTasks : "",
              })}
            >
              <DashboardTaskData tabName={"all"} currKey={key} />
            </Tab>
            <Tab
              eventKey={"todo"}
              title={t("user.summary:to-do", {
                count: allToDoTask ? allToDoTask : "",
              })}
            >
              <DashboardTaskData tabName={"to-do"} currKey={key} />
            </Tab>
            <Tab
              eventKey={"assigned"}
              title={t("user.summary:assigned", {
                count: allAssignedTask ? allAssignedTask : "",
              })}
            >
              <DashboardTaskData tabName={"assigned"} currKey={key} />
            </Tab>
            <Tab
              eventKey={"in-progress"}
              title={t("user.summary:in-progress", {
                count: allInProgressTask ? allInProgressTask : "",
              })}
            >
              <DashboardTaskData tabName={"inProgress"} currKey={key} />
            </Tab>
            <Tab
              eventKey={"done"}
              title={t("user.summary:done", {
                count: allDoneTask ? allDoneTask : "",
              })}
            >
              <DashboardTaskData tabName={"done"} currKey={key} />
            </Tab>
            <Tab
              eventKey={"cancelled"}
              title={t("user.summary:cancelled", {
                count: allCancelledTask ? allCancelledTask : "",
              })}
            >
              <DashboardTaskData tabName={"cancelled"} currKey={key} />
            </Tab>

            <Tab
              eventKey={"pending"}
              title={t("user.summary:pending", {
                count: allPendingTask ? allPendingTask : "",
              })}
            >
              <DashboardTaskData tabName={"pending"} currKey={key} />
            </Tab>
          </Tabs>
          <div className="home-tabs-filter">
            <span style={{ position: "absolute", right: "160px", top: "5px" }}>
              {t("user.summary:Assigned")}
            </span>

            <div
              className="d-inline-block custom-control custom-checkbox custom-checkbox-green"
              style={{ marginLeft: "10px" }}
            >
              <input
                name="group1"
                type="checkbox"
                id="default-activity"
                className="custom-control-input custom-control-input-green"
                onChange={(e) => {
                  setAssignToMetasks(e, "tome");
                }}
                checked={defaultChecked === "tome"}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor="default-activity"
              >
                {t("user.summary:tome")}{" "}
              </label>
              {/* <DashboardTaskData assign={assignFilter} /> */}
            </div>
            <div
              className="d-inline-block custom-control custom-checkbox custom-checkbox-green"
              style={{ marginLeft: "10px" }}
            >
              <input
                name="group1"
                type="checkbox"
                id="assignbyme"
                className="custom-control-input custom-control-input-green"
                onChange={(e) => {
                  setAssignToMetasks(e, "byme");
                }}
                checked={defaultChecked === "byme"}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor="assignbyme"
              >
                {t("user.summary:byme")}{" "}
                {/* {t("setting.modal:notifications:activity.all.label")} */}
              </label>
            </div>
          </div>
          {/* <DashboardTaskData assign={assignFilter} /> */}
        </div>
      </div>
    </>
  );
};

export default HomeTasksTab;
