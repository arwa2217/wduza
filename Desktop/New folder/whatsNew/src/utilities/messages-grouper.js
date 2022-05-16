import { putOrdinals } from "../utilities/utils";
const dateTimeFormat = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
});

const Grouper = (messages, currentUser) => {
  /*messages.sort((a, b) => {
    return a.sequence_id > b.sequence_id
      ? 1
      : a.sequence_id < b.sequence_id
      ? -1
      : 0;
  });*/
  messages = messages.filter((item, pos) => {
    return messages.findIndex((data) => data?.id === item?.id) === pos;
  });
  messages = messages.filter((message) => {
    return !(message?.isHidden && !(currentUser?.id === message?.user?.id));
  });
  const length = messages.length;
  const groups = {};
  const finalGroups = [];
  for (let i = 0; i < length; i++) {
    try {
      const date = new Date(messages[i].post.createdAt);
      const [{ value: month }, , { value: weekday }] =
        dateTimeFormat.formatToParts(date);

      let dateGroup = `${weekday}, ${month} ${putOrdinals(date.getDate())}`;

      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
        finalGroups.push({ key: dateGroup, posts: groups[dateGroup] });
      }
      groups[dateGroup].push(messages[i]);
    } catch (e) {}
  }
  return finalGroups;
};

export default Grouper;

export const getDropDownOptions = (longDate, longChannelCreated) => {
  const yesterday = {
    text: "Yesterday",
  };
  const lastWeek = {
    text: "Last Week",
  };
  const lastMonth = {
    text: "Last month",
  };
  const lastYear = { text: "Last Year" };
  const begining = { text: "The very beginning" };
  const mostRecent = { text: "Most Recent" };

  const lastOption = {
    text: "Time zone, switch",
    subNav: true,
    options: [{ text: "Option1" }, { text: "Option2" }],
  };
  // if (lYear === pYear && lMonth === pMonth && lDate === pDate) {
  //   selectedObject = {
  //     ...{},
  //     yesterday,
  //     lastWeek,
  //     lastMonth,
  //     lastYear,
  //     begining,
  //   };
  // } else if (
  //   pYear === channelCreatedDate.getFullYear() &&
  //   pMonth === channelCreatedDate.getMonth() &&
  //   pDate === channelCreatedDate.getDate()
  // ) {
  //   selectedObject = [mostRecent];
  // } else {
  //   if (channelCreatedDate.getFullYear() === pYear) {
  //     selectedObject = [lastWeek, lastMonth, mostRecent, begining];
  //   } else {
  //     selectedObject = [lastWeek, lastMonth, lastYear, mostRecent, begining];
  //   }
  // }
  return [
    mostRecent,
    yesterday,
    lastWeek,
    lastMonth,
    lastYear,
    begining,
    lastOption,
  ];
};
