import React, { useEffect, useState } from "react";
import { MENU_ITEMS } from "../../constants/menu-items";
import { HeaderContent, List } from "semantic-ui-react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import moreBtn from "../../assets/icons/v2/ic_collection_more.svg";
const CollectionMenuItem = (props) => {
  const {
    listItem,
    listIndex,
    selectedChannelActive,
    location,
    handleChannelItemClick,
    listChannels,
    handleSumNotification,
    classes,
  } = props;
  const [allUnreadCount, setAllUnreadCount] = useState({
    notificationCounts: 0,
    unreadPostCounts: 0,
    newMessageCounts: 0,
  });
  const notificationWS = useSelector(
    (state) => state.CollectionReducer?.notificationIdsWS
  );
  const [currentChannelsData, setCurrentChannelData] = useState([]);
  const countUnreadChannels = () => {
    setAllUnreadCount({
      notificationCounts: currentChannelsData?.reduce(
        (acc, item) => acc + item.notificationCount,
        0
      ),
      unreadPostCounts: currentChannelsData?.reduce(
        (acc, item) => acc + item.unreadPostCount,
        0
      ),
      newMessageCounts: currentChannelsData?.reduce(
        (acc, item) => acc + item.newMessageCount,
        0
      ),
    });
    handleSumNotification(
      allUnreadCount.notificationCounts +
        allUnreadCount.unreadPostCounts +
        allUnreadCount.newMessageCounts
    );
  };
  useEffect(() => {
    if (listItem.channels) {
      const currentChannelData = listChannels.filter(({ id: id1 }) =>
        listItem.channels.some((item) => item === id1)
      );
      setCurrentChannelData(currentChannelData);
    }
  }, [listItem]);
  useEffect(() => {
    if (currentChannelsData.length) {
      countUnreadChannels();
    }
  }, [currentChannelsData]);
  useEffect(() => {
    if (
      notificationWS &&
      Object.keys(notificationWS).length > 0 &&
      currentChannelsData.length > 0
    ) {
      const currentChannelDataUpdate = [...currentChannelsData].map((item) => {
        if (item.id === notificationWS.channelId) {
          if (notificationWS.type === "notification") {
            if (notificationWS.actionStatus === "down") {
              item = { ...item, notificationCount: item.notificationCount - 1 };
            } else if (notificationWS.actionStatus === "clear") {
              item = { ...item, notificationCount: 0 };
            } else if (notificationWS.actionStatus === "up") {
              item = { ...item, notificationCount: item.notificationCount + 1 };
            }
          } else if (notificationWS.type === "sendPost") {
            item = {
              ...item,
              newMessageCount: item.newMessageCount + 1,
              unreadPostCount: item.unreadPostCount + 1,
            };
          } else if (notificationWS.type === "readPost") {
            item = {
              ...item,
              notificationCount:
                item.notificationCount - notificationWS.postReadCount,
              newMessageCount:
                item.newMessageCount - notificationWS.postReadCount,
              unreadPostCount:
                item.unreadPostCount - notificationWS.postReadCount,
            };
          }
        }
        return item;
      });
      setCurrentChannelData(currentChannelDataUpdate);
    }
  }, [notificationWS]);
  return (
    <List.Item
      key={listIndex}
      className={classNames(
        "channelListItem",
        selectedChannelActive === listItem.id &&
          location.pathname === MENU_ITEMS.COLLECTIONS &&
          "active",
        classes.menuItem,
        `collection-menu-wrapper collection-menu-wrapper-${listItem.id}`
      )}
      onClick={(event) => handleChannelItemClick(event, listItem)}
    >
      <HeaderContent
        key={listIndex}
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <Typography
          className={`wrapContent d-flex justify-content-between pr-3 align-items-center menu-text`}
          title={listItem.name}
        >
          {listItem.name}
        </Typography>
        {/*{
            allUnreadCount?.notificationCounts +
              allUnreadCount?.newMessageCounts +
              allUnreadCount?.unreadPostCounts >
              0 && (
              <span
                style={{
                  background: "#000000",
                  borderRadius: "100px",
                  fontSize: "12px",
                  padding: "5px",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                New
              </span>
            )
            // )collectionIcon
          }*/}
        <SVG
          src={moreBtn}
          fill="none"
          className={classNames("moreBtn", classes.moreBtn)}
        />
      </HeaderContent>
    </List.Item>
  );
};
export default CollectionMenuItem;
