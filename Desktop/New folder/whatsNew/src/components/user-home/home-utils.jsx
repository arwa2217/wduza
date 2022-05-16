import notification from "@home/notification-icon.svg";
import post from "@home/post-icon.svg";
import task from "@home/task-icon.svg";

export const HomeTabs = {
  NOTIFICATIONS: "NOTIFICATIONS",
  TAGGED_POSTS: "TAGGED_POSTS",
  TASKS: "TASKS",
};

export const HomeItems = (t, dashboardCount) => {
  return [
    {
      id: 1,
      key: HomeTabs.NOTIFICATIONS,
      value: t("user.summary:notification.card"),
      src: notification,
      count: dashboardCount
        ? dashboardCount.notificationCount
          ? dashboardCount.notificationCount
          : 0
        : 0,
      activeStyle: { border: "1px solid #03BD5D", borderRadius: "8px" },
      activeCountStyle: { color: "#03BD5D" },
    },
    {
      id: 2,
      key: HomeTabs.TAGGED_POSTS,
      value: t("user.summary:tagged.post.card"),
      src: post,
      count: dashboardCount
        ? dashboardCount.taggedPostCount
          ? dashboardCount.taggedPostCount
          : 0
        : 0,
      activeStyle: { border: "1px solid #D16584", borderRadius: "8px" },
      activeCountStyle: { color: "#D16584" },
    },
    {
      id: 3,
      key: HomeTabs.TASKS,
      value: t("user.summary:task.card"),
      src: task,
      count: dashboardCount
        ? dashboardCount.taskCount
          ? dashboardCount.taskCount
          : 0
        : 0,
      activeStyle: { border: "1px solid #2D76CE", borderRadius: "8px" },
      activeCountStyle: { color: "#2D76CE" },
    },
  ];
};
