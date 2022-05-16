/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./discussion-list.css";
import {
  setActivePanelAction,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import ChannelType from "../../props/channel-type";
import { CLEAN_MESSAGES } from "../../store/actionTypes/channelMessagesTypes";
import UserType from "../../constants/user/user-type";
import DiscussionListHeader from "./discussion-list-header";
import DiscussionListItem from "./discussion-list-item";
import { List } from "semantic-ui-react";
import DiscussionService from "../../services/discussion-service";
import Panel from "../actionpanel/panel";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import { RESET_NEW_CHANNEL } from "../../store/actionTypes/channelActionTypes";
import { Droppable, Draggable } from "react-beautiful-dnd";
import retrieveMessages from "../../utilities/messages-retriever";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import CollectionServices from "../../services/collection-services";
import { collectionConstants } from "../../constants/collection";
import StatusCode from "../../constants/rest/status-codes";
import { Alert } from "@material-ui/lab";
import { makeStyles, MenuItem, Menu, Snackbar } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import FilterImg from "../../assets/icons/v2/ic_filter.svg";
import CancelImg from "../../assets/icons/v2/ic_cancel_black.svg";
import FilterImgActive from "../../assets/icons/v2/ic_filter_active.svg";
import CheckIcon from "../../assets/icons/check_green.svg";
import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import SVG from "react-inlinesvg";
import {
  CONDITION_FILTER_LIST_MENU,
  CONDITION_SORT_LIST_MENU,
} from "../../constants/discussion-search";

const bookmarkMinOrder = 1;
const bookmarkMaxOrder = 10000;

const emptyMessage = "No messages";

const DiscussionListWrapper = styled.div`
  height: calc(100vh - var(--discussion-list-header-height));
  overflow-x: hidden;
  overflow-y: overlay;

  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */

  ::-webkit-scrollbar-thumb {
    background: transparent !important;
    box-shadow: inset 0 0 14px 14px rgba(0, 0, 0, 0.1);
    border: solid 4px transparent !important;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const FilerWrapper = styled.div`
  display: flex;
  align-items: "center";

  .ic-sort {
    cursor: pointer;
    padding-left: 15px;
    margin-top: 1px;

    svg {
      &:hover {
        fill: #00a95b;
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  emptyDiscussion: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    margin: "0 16px",
    backgroundColor: "#CCCCCC",
  },
  contentWrapper: {
    height: "40px",
    color: theme.palette.text.focus,
    fontSize: "12px",
    padding: "1px 16px",
    // backgroundColor: "yellow",
    "&:after": {
      content: '""',
      display: "block",
      borderBottom: `1px solid ${theme.palette.color.divider}`,
    },
  },
  label: {
    display: "flex",
    fontSize: "12px",
    alignItems: "center",
    padding: "10px 0px",
    fontWeight: "400",
    justifyContent: "space-between",
    height: "100%",
    color: theme.palette.text.black50,
  },
  root: {
    marginLeft: "5px",
    "& .MuiMenu-paper": {
      border: "1px solid #cccccc",
      top: "103px !important",
      left: "369px !important",
      width: "130px",
    },
    "& .MuiList-root": {
      padding: "0px !important",
    },
    "& .MuiSelect-select": {
      color: "#19191A",
      "& img": {
        display: "none",
      },
    },
    "& .MuiInput-underline:before ": {
      border: "none",
    },
    "& .MuiInput-underline:after": {
      border: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before ": {
      border: "none",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "#ffffff",
    },
    "& .MuiInputBase-input": {
      paddingTop: "4px",
      paddingBottom: 0,
    },
  },
  selected: {
    backgroundColor: "#EFF6FF !important",
    border: "1px solid #DAEBFF !important",
  },
  filterImg: {
    cursor: "pointer",
  },
  cancelImg: {
    cursor: "pointer",
  },
  hoverIcon: {
    "& svg:last-child": {
      display: "none",
    },
    "&:hover": {
      "& svg:first-child": {
        display: "none",
      },
      "& svg:last-child": {
        display: "block",
      },
    },
  },
  boxMargin: {
    marginLeft: "10px",
  },
  boxFilter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "11px",
    lineHeight: "134%",
    color: "#00000066",
    cursor: "pointer",
    "& .active": {
      color: "#03BD5D",
      fontWeight: "bold",
    },
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  menuFilterCondition: {
    padding: "8px 0",
  },
  menuSortCondition: {
    padding: "8px 0",
    borderTop: "1px solid rgba(0, 0, 0, 0.08);",
  },
}));

const StyledMenuItem = withStyles({
  root: {
    fontSize: "12px",
    color: "#19191A",
    padding: "3px 8px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    "& .options": {
      paddingLeft: "21px",
      color: "rgba(0, 0, 0, 0.4)",
    },
    "&:hover .options": {
      color: "rgba(0, 0, 0, 0.7)",
    },
    "& .options-selected": {
      paddingLeft: "0",
      color: "#00A95B",
    },
    "& .flex-item": {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "flex-start",
    },
  },
})(MenuItem);

function DiscussionList(props, ref) {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser = useSelector((state) => state.AuthReducer.user);
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const newChannel = useSelector((state) => state.ChannelReducer.newChannel);
  const [normalFilter, setNormalFilter] = useState("All");
  const [toggleUnread, setToggleUnread] = useState(true);
  const [toggleRead, setToggleRead] = useState(true);

  const updatedChannel = useSelector(
    (state) => state.ChannelReducer.updatedChannel
  );
  const fetchedChannelList = useSelector(
    (state) => state.ChannelReducer.fetchedChannelList
  );
  const activeChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const notificationList = useSelector(
    (state) => state.notificationReducer.notificationDetails
  );
  const activePanel = useSelector((state) => state.config.activeActionPanel);
  const updatedData = useSelector((state) => state.ChannelReducer.updatedData);
  const activeCollection = useSelector(
    (state) => state.CollectionReducer?.activeCollection
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );

  const [activeId, setActiveId] = useState("");
  const [numBookmark, setNumBookmark] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [numNotification, setNumNotification] = useState(0);
  const [numNewMessage, setNumNewMessage] = useState(0);
  const [discussionList, setDiscussionList] = useState([]);
  const [filterState, setFilterState] = useState(false);
  const [inputs, setInputs] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [deletedList, setDeleteList] = useState([]);
  const [membersInDiscussion, setMembersInDiscussion] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const channelListActive = activeCollection?.channels || [];
  const activeCollectionId = activeCollection?.id;

  //Declare state to filter discussion list by type
  const [conditionFilterList, setConditionFilterList] = useState(
    CONDITION_FILTER_LIST_MENU
  );
  const [conditionSortList, setConditionSortList] = useState(
    CONDITION_SORT_LIST_MENU
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilterMenu = Boolean(anchorEl);

  const handleFilterDiscussion = (index) => {
    setNormalFilter("All");
    let newConditionList = [...conditionFilterList];

    if (index === 0) {
      newConditionList.map((item, i) => (item.isSelect = i === 0));
    } else {
      newConditionList[index].isSelect = !newConditionList[index].isSelect;
    }

    setConditionFilterList(newConditionList);
    setAnchorEl(null);
    // Filter display list with condition
    const conditionSort = conditionSortList.find((item) => item.isSelect);
    setFilterList(
      displayList
        .filter((item) => {
          if (newConditionList[1].isSelect) {
            if (!item.channel.isOwner) {
              return false;
            }
          }
          if (newConditionList[2].isSelect) {
            if (!item.newMsg) {
              return false;
            }
          }
          if (newConditionList[3].isSelect) {
            if (!item.bookmarkOn) {
              return false;
            }
          }
          if (newConditionList[4].isSelect) {
            if (!item.channel.isConfidential) {
              return false;
            }
          }
          return true;
        })
        .sort((a, b) => {
          if (conditionSort.value === "newest") {
            return b.timestamp - a.timestamp;
          } else if (conditionSort.value === "az") {
            return a.channel.name.localeCompare(b.channel.name);
          }
        })
    );
  };

  const unReadsFilter = () => {
    setNormalFilter("Unreads");
    setFilterList(displayList.filter((item) => item.newMsg));
  };

  const readAllFilter = () => {
    handleFilterDiscussion(0);
  };

  const handleClickSort = (event, condition) => {
    if (condition.isSelect) return;
    const newFilterList = [...filterList];
    const newConditionSortList = [...conditionSortList];
    if (condition.value === "newest") {
      setFilterList(newFilterList.sort((a, b) => b.timestamp - a.timestamp));
    } else if (condition.value === "az") {
      setFilterList(
        newFilterList.sort((a, b) =>
          a.channel.name.localeCompare(b.channel.name)
        )
      );
    }
    newConditionSortList.map((e, i) => (e.isSelect = i === condition.id - 1));
    setConditionSortList(newConditionSortList);
  };

  /* Set condition filter list */
  useEffect(() => {
    if (location.pathname === "/collections") {
      let newConditionList = [...conditionFilterList];
      newConditionList.forEach((item) => {
        if (item.value === "all") {
          item.isSelect = true;
        } else {
          item.isSelect = false;
        }
        return item;
      });
      setConditionFilterList(newConditionList);
    }
  }, [location]);

  let displayList = discussionList;

  useEffect(() => {
    console.log("discussion-list: mainUseEffect");
    let currentActiveChannel = activeChannel;
    if (newChannel && newChannel.type !== ChannelType.DIRECT_CHANNEL) {
      console.log("discussion-list: mainUseEffect: newChannel created");
      dispatch(setSelectedChannelAction(Panel.CHANNEL, newChannel));
      dispatch({ type: RESET_NEW_CHANNEL });
    } else if (activeChannel && activeId !== activeChannel.id) {
      // console.log(
      //     "discussion-list: mainUseEffect: activeId !== activeChannel.id"
      // );
      setActiveId(activeChannel.id);
      dispatch({
        type: CLEAN_MESSAGES,
        payload: { channelId: activeChannel.id },
      });
      executeScroll(activeChannel.id);
    } else if (
      discussionList.length > 0 &&
      currentUser.userType === UserType.GUEST
    ) {
      if (
        !activeChannel ||
        (activeChannel && activeChannel.id !== discussionList[0].channel.id)
      ) {
        dispatch(
          setSelectedChannelAction(Panel.CHANNEL, discussionList[0].channel)
        );
      }
    } else if (activePanel === Panel.NEW_DISCUSSION) {
      console.log("discussion-list: activePanel === Panel.NEW_DISCUSSION");
      setActiveId("");
      //Empty
    } else {
      //Check if user refresh the page , he should landed to last selected channel
      let lastSelectedChannelId = getLastSelectedChannelId();
      console.log(
        "discussion-list: ELSE case, lastSelectedChannelId=%s, discussionLength=%d",
        lastSelectedChannelId,
        channelList.length
      );

      if (lastSelectedChannelId && !activeChannel && channelList.length > 0) {
        var lastSelectedChannel = channelList.filter((channel) => {
          return channel.id === lastSelectedChannelId;
        });
        if (lastSelectedChannel && lastSelectedChannel.length > 0) {
          retrieveMessages(
            1,
            lastSelectedChannel[0].id,
            0,
            0
            // lastSelectedChannel[0].lastReadPostId || 0
          );
          dispatch(
            setSelectedChannelAction(Panel.CHANNEL, lastSelectedChannel[0])
          );
        }
      }
    }
    //Double check If selected channel require permission for accept or reject
    if (
      currentActiveChannel &&
      currentActiveChannel.IsInvitePending &&
      activePanel !== Panel.JOIN_DISCUSSION_AGREEMENT
    ) {
      dispatch(
        setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, activeChannel)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel, activeChannel, activePanel, discussionList]);
  useEffect(() => {
    setDeleteList([]);
  }, [activeCollection?.id]);
  //To keep channel up to date in config reducer
  useEffect(() => {
    if (
      activeChannel &&
      updatedChannel &&
      activeChannel.id === updatedChannel.id &&
      (activeChannel.type !== updatedChannel.type ||
        activeChannel.lastReadPostId !== updatedChannel.lastReadPostId ||
        activeChannel.newUnreadMessageCount !==
          updatedChannel.newUnreadMessageCount ||
        activeChannel.newMessageCount !== updatedChannel.newMessageCount ||
        activeChannel.unreadPostCount !== updatedChannel.unreadPostCount ||
        activeChannel.name !== updatedChannel.name ||
        activeChannel.LastPost?.id !== updatedChannel.LastPost?.id ||
        activeChannel.LastPost?.post?.updatedAt !==
          updatedChannel.LastPost?.post?.updatedAt ||
        activeChannel.IsInvitePending !== updatedChannel.IsInvitePending)
    ) {
      console.log(
        "discussion-list: useDeepCompareEffect: activeChannel.id === updatedChannel.id && other"
      );
      dispatch(setSelectedChannelAction(Panel.CHANNEL, updatedChannel));
    }
  }, [activeChannel, updatedChannel]);

  function executeScroll(channelId) {
    console.log("executeScroll Request for channelId=" + channelId);
    let element = document.getElementById(channelId);
    if (element != null) {
      let rect = element.getBoundingClientRect();
      var elemTop = rect.top;
      var elemBottom = rect.bottom;
      var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;

      if (!isVisible) {
        element.scrollIntoView({ block: "center" });
      }
    } else {
      console.log("executeScroll failed as element is null");
    }
  }

  // clicking discussion item
  function handleDiscussionItemClick(e, channelProps) {
    e.preventDefault();
    e.stopPropagation();

    const { channel } = channelProps;
    if (!channel.lastReadPostId) {
      channel.lastReadPostId = 0;
    }
    if (channel.IsInvitePending) {
      dispatch(
        setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, channel)
      );
      return;
    }
    retrieveMessages(1, channel.id, 0, 0);
    dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
    return false;
  }

  // TODO - reduce the number of calling setDisplay()
  useEffect(() => {
    // when new channel is created or deleted
    // when channel list is fetched
    if (fetchedChannelList && channelList.length !== displayList.length) {
      _setDisplay(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedChannelList]);

  useEffect(() => {
    if (displayList.length === channelList.length) {
      let isChanged = true;
      for (let i = 0; i < channelList.length; i++) {
        let idx = displayList.findIndex(
          (obj) => obj.channel.id === channelList[i].id,
          1
        );
        if (idx >= 0) {
          if (
            displayList[idx].channel.memberCount !==
              channelList[i].memberCount ||
            displayList[idx].channel.newMessageCount !==
              channelList[i].newMessageCount
          ) {
            isChanged = true;
            break;
          }
        }
      }
      if (isChanged) {
        _setDisplay();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelList]);

  useEffect(() => {
    if (notificationList.length > 0) {
      // console.log("discussion-list: useEffect for notificationList");
      _setDisplay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationList]);

  useEffect(() => {
    // console.log("discussion-list: useEffect for updatedData");
    _setDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedData]);

  // BOOKMARK

  function _getBookmarkList(display) {
    // console.log("discussion-list: getBookmarkList");

    DiscussionService.getBookmarkList()
      .then((data) => {
        console.log("discussion-list: getBookmarkList -> data received");
        _setBookmarkGroup(display, data);
      })
      .catch((reason) => {
        console.log("Failed to get bookmark: " + reason);
        _setBookmarkGroup(display, []);
      });
  }

  function _patchBookmark(bookmark) {
    // console.log("discussion-list: patchBookmark");
    DiscussionService.patchBookmark(bookmark).catch((reason) => {
      console.log("Failed to patch bookmark: " + reason);
    });
  }

  function _postBookmark(bookmark) {
    DiscussionService.postBookmark(bookmark).catch((reason) => {
      console.log("Failed to post bookmark: " + reason);
    });
  }

  function _deleteBookmark(bookmark) {
    DiscussionService.deleteBookmark(bookmark).catch((reason) => {
      console.log("Failed to delete bookmark: " + reason);
    });
  }

  function bookmarkToggled(id, statusOn, start, end) {
    console.log("discussion-list: bookmarkToggled start");

    // idx should be greater than 0 or equal 0
    let idx = displayList.findIndex((obj) => obj.channel.id === id, 1);
    if (idx >= 0) {
      if (statusOn) {
        let order = bookmarkMinOrder;
        if (numBookmark > 0) {
          order = displayList[numBookmark - 1].order + 1;
        }

        let bookmark = { userId: currentUser.id, channelId: id, order: order };
        _postBookmark(bookmark);

        displayList[idx] = {
          ...displayList[idx],
          bookmarkOn: true,
          order: start === -1 && end === -1 ? order : end,
        };
        if (start !== -1 && end !== -1) {
          //Bookmark is set via dragging, update position as supplied by DnD
          _move(displayList, start, end);
        } else {
          //Bookmark is set via button, update position via appending to known bookmarks
          _move(displayList, idx, numBookmark);
          for (let i = numBookmark + 1; i < displayList.length; i++) {
            displayList[i].order = bookmarkMaxOrder + (i - (numBookmark + 1));
          }
        }
        setNumBookmark(numBookmark + 1);
      } else {
        let bookmark = {
          userId: currentUser.id,
          channelId: id,
          order: displayList[idx].order,
        };
        _deleteBookmark(bookmark);

        displayList[idx] = { ...displayList[idx], bookmarkOn: false };
        if (start !== -1 && end !== -1) {
          //Bookmark is removed via dragging, update position as supplied by DnD
          _move(displayList, start, end);
        } else {
          //Bookmark is removed via button, update position via appending to known bookmarks
          for (let i = numBookmark; i < displayList.length; i++) {
            displayList[i].order = bookmarkMaxOrder + (i - numBookmark);
          }
        }
        setNumBookmark(numBookmark - 1);
      }
      _applyFilter(inputs);
    }
    console.log("discussion-list: bookmarkToggled end");
  }

  function _setBookmarkGroup(display, bookmark) {
    let num = 0;
    for (let i = 0; i < bookmark.length; i++) {
      let idx = display.findIndex(
        (obj) => obj.channel.id === bookmark[i].channelId,
        1
      );
      if (idx >= 0) {
        _move(display, idx, num);
        display[num] = {
          ...display[num],
          bookmarkOn: true,
          order: bookmark[i].order,
        };
        num++;
      }
    }

    setNumBookmark(num);
    _getNotificationList(display, num);
  }

  // NOTIFICATION

  // fetch notification list of current user from db
  function _getNotificationList(display, numBook) {
    // console.log("discussion-list: getNotificationList");
    DiscussionService.getUnreadNotification()
      .then((data) => {
        console.log(
          "discussion-list: getNotificationList data received>>>",
          data
        );
        // remove duplication
        let unique = data.filter(
          (arr, index, callback) =>
            index ===
            callback.findIndex((t) => t.refChannelID === arr.refChannelID)
        );
        _setNotificationGroup(display, unique, numBook);
      })
      .catch((reason) => {
        console.log("Failed to get notification: " + reason);
        _setNotificationGroup(display, [], numBook);
      });
  }

  function _setNotificationGroup(display, notifications, numBook) {
    let num = 0;
    for (let i = 0; i < notifications.length; i++) {
      let noti = notifications[i];
      let idx = display.findIndex(
        (obj) => obj.channel.id === noti.refChannelID,
        1
      );
      if (idx >= 0) {
        let replace = 0;
        if (idx < numBook) {
          replace = idx;
        } else {
          replace = numBook + num;
          num++;
        }
        _moveWithOrder(display, idx, replace);
        display[replace] = {
          ...display[replace],
          isMentioned: true,
          timestamp: noti.timestamp,
        };
      }
    }

    setNumNotification(num);
    _getMessageList(display, numBook, num);
  }

  // MESSAGES

  // fetch notification list of current user from db
  function _getMessageList(display, numBook, numNoti) {
    // console.log("discussion-list: getMessageList");

    DiscussionService.getLastMessage()
      .then((data) => {
        console.log("discussion-list: getMessageList data received>>>", data);
        // remove duplication
        let unique = data.filter(
          (arr, index, callback) =>
            index ===
            callback.findIndex((t) => t.msg.ChannelID === arr.msg.ChannelID)
        );
        _setMessageGroup(display, unique, numBook, numNoti);
      })
      .catch((reason) => {
        console.log("Failed to get last messages: " + reason);
        _setMessageGroup(display, [], numBook, numNoti);
      });
  }

  function _setMessageGroup(display, messages, numBook, numNoti) {
    // console.log("discussion-list: setMessageGroup start");

    let numNew = 0;
    for (let i = 0; i < messages.length; i++) {
      let idx = display.findIndex(
        (obj) => obj.channel.id === messages[i].msg.ChannelID,
        1
      );
      if (idx >= 0) {
        if (display[idx].channel.newMessageCount > 0) {
          let replace = 0;
          if (idx < numBook + numNoti) {
            replace = idx;
          } else {
            replace = numBook + numNoti + numNew;
            numNew++;
          }
          _moveWithOrder(display, idx, replace);
          let contents = messages[i].content.replace(/(<([^>]+)>)/gi, "");
          display[replace] = {
            ...display[replace],
            newMsg: true,
            previewMsg: contents,
            timestamp: messages[i].timestamp,
          };
          // remove processed one from messages list
          messages.splice(i, 1);
          i--;
        }
      }
    }

    let num = 0;
    for (let i = 0; i < messages.length; i++) {
      let idx = display.findIndex(
        (obj) => obj.channel.id === messages[i].msg.ChannelID,
        1
      );
      let replace = 0;
      if (idx < numBook + numNoti + numNew) {
        replace = idx;
      } else {
        replace = numBook + numNoti + numNew + num;
        num++;
      }
      _moveWithOrder(display, idx, replace);
      let contents = messages[i].content; //.replace(/(<([^>]+)>)/ig,"");
      display[replace] = {
        ...display[replace],
        previewMsg: contents,
        timestamp: messages[i].timestamp,
      };
    }

    //Avoid rare scenario when these api is in progress and channel list cleared from background then  don't update it.
    if (channelList.length !== 0) {
      setNumNewMessage(numNew);
      setDiscussionList(display);
      _applyFilter(inputs, display);
    } else {
      setFilterList([]);
      setDiscussionList([]);
      setNumNewMessage(0);
      dispatch(setActivePanelAction(Panel.WELCOME, null));
    }

    setTimeout(() => {
      if (activeChannel && activeChannel.id) {
        executeScroll(activeChannel.id);
      } else {
        console.log(
          "Can't request for execute scroll as active channel is not set in method setMessageGroup"
        );
      }
    }, 500);
    // console.log("discussion-list: setMessageGroup end");
  }

  // ORDERING

  function _setDisplay(initialLoading = false) {
    // console.log("discussion-list: setDisplay start");

    let display = [];

    for (let i = 0; i < channelList.length; i++) {
      display[i] = {
        channel: { ...channelList[i] },
        bookmarkOn: false,
        timestamp: 0,
        isMentioned: false,
        newMsg: false,
        previewMsg: emptyMessage,
        order: i + bookmarkMaxOrder,
      };
    }

    if (display.length > 0) {
      if (initialLoading) {
        _applyFilter(inputs, display);
      }
      _getBookmarkList(display);
    }

    // console.log("discussion-list: setDisplay end");
  }

  function _move(display, s, e) {
    if (s !== e) {
      let chr = display[s];
      display.splice(s, 1);
      display.splice(e, 0, chr);
    }
  }

  function _moveWithOrder(display, s, e) {
    if (s !== e) {
      let ss = display[s];
      let ee = display[e];

      let order = ss.order;
      ss.order = ee.order;
      ee.order = order;

      _move(display, s, e);
    }
  }

  // DRAG & DROP

  function _dragging(s, e) {
    let ss = displayList[s];
    let ee = displayList[e];

    if (!ss.bookmarkOn && ee.bookmarkOn) {
      // bookmark off -> on
      bookmarkToggled(ss.channel.id, true, s, e);
    } else if (ss.bookmarkOn && !ee.bookmarkOn) {
      // bookmark on -> off
      bookmarkToggled(ss.channel.id, false, s, e);
    } else if (ss.bookmarkOn && ee.bookmarkOn) {
      // bookmark on -> on
      let bookmark = {
        userId: currentUser.id,
        channelId: ee.channel.id,
        order: ss.order,
      };
      _patchBookmark(bookmark);
      let bookmark2 = {
        userId: currentUser.id,
        channelId: ss.channel.id,
        order: ee.order,
      };
      _patchBookmark(bookmark2);
      _moveWithOrder(displayList, s, e);
    } else {
      _moveWithOrder(displayList, s, e);
    }
  }

  function filterToggled() {
    setFilterState(!filterState);
  }

  function resetInputValue(event) {
    event.preventDefault();
    setInputs("");
    _applyFilter("");
  }

  function handleNameChange(e) {
    e.preventDefault();
    let value = e.target.value;
    //remove leading white space, Used replace method as trimStart does not support by IE browser
    value = value.replace(/^\s+/g, "");
    setInputs(value);
    const newConditionList = conditionFilterList;
    newConditionList.map((item, index) => {
      if (index === 0) {
        item.isSelect = true;
      } else {
        item.isSelect = false;
      }
    });
    setConditionFilterList(newConditionList);
    _applyFilter(value);
  }

  function onClearValue() {
    setInputs("");
  }

  function _applyFilter(filterValue, originalDataList) {
    let tempFilterList = [];
    filterValue = filterValue === undefined ? "" : filterValue;
    let masterList =
      originalDataList === undefined || originalDataList.length === 0
        ? displayList
        : originalDataList;
    if (filterValue.length > 0) {
      for (let i = 0; i <= masterList?.length - 1; i++) {
        let channelName = masterList[i]?.channel?.name.trim().toLowerCase();
        if (channelName.includes(filterValue.toLowerCase())) {
          tempFilterList.push(masterList[i]);
        }
      }
      setFilterList(tempFilterList);
    } else {
      setFilterList(masterList.sort((a, b) => b.timestamp - a.timestamp));
    }
  }

  useImperativeHandle(ref, () => ({
    async handleOnDragEnd(result) {
      await _onDragEnd(result);
    },
  }));

  const _onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    _dragging(result.source.index, result.destination.index);
    const {
      destination: { droppableId },
      draggableId: channelId,
    } = result;
    const [droppableLabel] = droppableId.split("_");
    if (droppableLabel === collectionConstants.COLLECTION_LABEL) {
      const collectionId = [...droppableId.split("_")].pop();
      const data = {
        oldCollection: activeCollection.id,
        collectionList: [collectionId],
        action: collectionConstants.ACTION_DUPLICATE.toUpperCase(),
      };
      const result =
        await CollectionServices.moveOrDuplicateDiscussionToCollection(
          channelId,
          data
        );
      const { code, message } = result;
      if (code === StatusCode.COMMON_ERROR) {
        setError(message);
        return setOpen(true);
      }
    }
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // styles we need to apply on drag-able
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    width: "calc(100%)",
    // overflowY: "overlay",
    // overflowX: "hidden",
    // height:
    //   "calc(100vh - var(--discussion-list-header-height) - var(--discussion-list-top-bar-height) - var(--discussion-list-bottom-margin))",
    // height: "calc(100vh - var(--discussion-list-header-height))",
    // borderBottomLeftRadius: "8px",
    // borderBottomRightRadius: "8px",
  });

  const handleDiscussionChange = async (
    e,
    channelId,
    action,
    disabled,
    activeCollectionId
  ) => {
    if (disabled) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    const discussionBody = e.target?.parentNode?.parentNode;
    if (discussionBody) {
      discussionBody.classList.add("active");
    }
    if (action === collectionConstants.ACTION_DELETE) {
      const result = await CollectionServices.deleteChannelFromCollection(
        channelId,
        activeCollectionId
      );
      const { code, message } = result;
      if (code === StatusCode.COMMON_SUCCESS) {
        setDeleteList((prevState) => {
          return [channelId, ...prevState];
        });
      } else if (code === StatusCode.COMMON_ERROR) {
        setError(message);
        setOpen(true);
      }
    } else {
      const modalType = ModalTypes.DISCUSSION_MODAL_SHOW;
      const modalProps = {
        show: true,
        closeButton: true,
        action,
        channelId,
        setDeleteList,
        activeCollectionId,
        ...props,
      };
      dispatch(ModalActions.showModal(modalType, modalProps));
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (globalMembers.length && filterList.length) {
      const membersInDiscussionTemp = {};
      filterList.map((item) => {
        const { channel } = item;
        if (!membersInDiscussionTemp[channel?.id]) {
          membersInDiscussionTemp[channel?.id] = [];
        }
        membersInDiscussionTemp[channel?.id] = globalMembers
          .filter((item) => item?.channel_id?.includes(channel?.id))
          .sort((a, b) => b?.userImg.length - a?.userImg.length);
      });
      setMembersInDiscussion(membersInDiscussionTemp);
    }
  }, [globalMembers.length, filterList.length]);
  return (
    <div className="discussion-list">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        style={{ top: "10px" }}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <DiscussionListHeader
        activeCollection={activeCollection}
        filterList={filterList}
        toggleFilter={() => filterToggled()}
        isActiveFilter={filterState}
        handleSearchDiscussion={handleNameChange}
        value={inputs}
        onClearValue={onClearValue}
        resetInputValue={resetInputValue}
        deletedList={deletedList}
      />
      <hr className={classes.border} />
      <DiscussionListWrapper className="discussion-list-container">
        <div
          className={`${classes.contentWrapper} hover_icon`}
          onClick={() => setToggleUnread(!toggleUnread)}
        >
          <div className={classes.label}>
            <div className={classes.flex}>
              {conditionFilterList.map((item, index) => {
                if (index === 0) return;
                return item.isSelect ? (
                  <div
                    className={`${classes.boxFilter} ${
                      index !== 1 && classes.boxMargin
                    }`}
                  >
                    <span>{item.label}</span>
                    {index !== 0 && (
                      <SVG
                        className={`${classes.filterImg}`}
                        src={CancelImg}
                        alt={"cancel"}
                        onClick={() => handleFilterDiscussion(index)}
                        opacity={"0.5"}
                        path={"black"}
                      />
                    )}
                  </div>
                ) : null;
              })}
              {conditionFilterList.filter((item) => item.isSelect).length ===
                1 && (
                <div className={`${classes.boxFilter}`}>
                  <span
                    className={`${normalFilter === "All" && "active"}`}
                    onClick={readAllFilter}
                  >
                    All
                  </span>
                  <span
                    onClick={unReadsFilter}
                    className={`${normalFilter === "Unreads" && "active"}`}
                    style={{ paddingLeft: "12px", cursor: "pointer" }}
                  >
                    Unreads
                  </span>
                </div>
              )}
            </div>

            <FilerWrapper className="filter-wrapper">
              <div className={classes.hoverIcon}>
                <SVG
                  className={`${classes.filterImg}`}
                  src={FilterImg}
                  alt={"filter-list"}
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                />
                <SVG
                  className={`${classes.filterImg}`}
                  src={FilterImgActive}
                  alt={"filter-list"}
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                />
              </div>
            </FilerWrapper>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openFilterMenu}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              className={classes.root}
            >
              <div className={classes.menuFilterCondition}>
                {conditionFilterList.map((item, index) => {
                  return (
                    <StyledMenuItem
                      value={item.value}
                      key={item.id}
                      classes={{ selected: classes.selected }}
                      onClick={() => handleFilterDiscussion(index)}
                    >
                      <div className={"flex-item"}>
                        {item.isSelect &&
                          (index === 0 &&
                          conditionFilterList.filter((item) => item.isSelect)
                            .length > 1 ? null : (
                            <img
                              src={CheckIcon}
                              alt={"check-icon"}
                              style={{ paddingRight: "6px" }}
                            />
                          ))}
                        <div
                          className={`${
                            !item.isSelect
                              ? "options"
                              : index === 0 &&
                                conditionFilterList.filter(
                                  (item) => item.isSelect
                                ).length > 1
                              ? "options"
                              : "options-selected"
                          }`}
                        >
                          {item.label}
                        </div>
                      </div>
                    </StyledMenuItem>
                  );
                })}
              </div>
              <div className={classes.menuSortCondition}>
                {conditionSortList.map((item, index) => {
                  return (
                    <StyledMenuItem
                      value={item.value}
                      key={item.id}
                      classes={{ selected: classes.selected }}
                      onClick={(e) => handleClickSort(e, item)}
                    >
                      <div className={"flex-item"}>
                        {item.isSelect && (
                          <img
                            src={CheckIcon}
                            alt={"check-icon"}
                            style={{ paddingRight: "6px" }}
                          />
                        )}
                        <div
                          className={`${
                            !item.isSelect ? "options" : "options-selected"
                          }`}
                        >
                          {item.label}
                        </div>
                      </div>
                    </StyledMenuItem>
                  );
                })}
              </div>
            </Menu>
          </div>
        </div>
        {filterList.length === 0 ? (
          <div className={classes.emptyDiscussion}>
            The discussions you are looking for can't be found.
          </div>
        ) : (
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                // className="discussion-list-container"
              >
                {filterList.length > 0 &&
                  filterList.map((listItem, listIndex) => (
                    <Draggable
                      key={listItem.channel?.id}
                      draggableId={listItem.channel?.id}
                      index={listIndex}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {(!filterState ||
                            (filterState &&
                              (listItem.newMsg || listItem.isMentioned))) && (
                            <List.Item
                              className={`discussion-list-body-item discussion-list-body-item-${listItem.channel?.id}`}
                              channel={listItem.channel}
                              id={listItem.channel?.id}
                              onClick={handleDiscussionItemClick}
                            >
                              <DiscussionListItem
                                toggleBookmark={(id, statusOn) =>
                                  bookmarkToggled(id, statusOn, -1, -1)
                                }
                                channel={listItem.channel}
                                bookmarkOn={listItem.bookmarkOn}
                                isMentioned={listItem.isMentioned}
                                previewMsg={listItem.previewMsg}
                                activeDiscussionId={activeId}
                                deletedList={deletedList}
                                handleDiscussionChange={handleDiscussionChange}
                                members={
                                  membersInDiscussion[listItem.channel?.id] ||
                                  []
                                }
                              />
                            </List.Item>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </DiscussionListWrapper>
    </div>
  );
}

export default forwardRef(DiscussionList);
