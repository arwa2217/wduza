import React, { useEffect, useRef, useState } from "react";
import OutlookMailCollapseItem from "./outlook-mail-collapse-item";
import OutlookMailExpandItem from "./outlook-mail-expand-item";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import {
  setIsReadMailId,
  updateUnreadInConversation,
} from "../../store/actions/outlook-mail-actions";

const OutlookMailItem = (props) => {
  const { mailItem, mailIndex, mailConversation } = props;
  const [isCollapse, setIsCollapse] = useState(false);
  const [currentMailItem, setCurrentMailItem] = useState({});
  const { instance } = useMsal();
  const dispatch = useDispatch();
  useEffect(() => {
    setCurrentMailItem(mailItem);
  }, [mailItem]);
  useEffect(() => {
    const filterArr = mailConversation.filter(
      (item) =>
        item?.sender?.emailAddress?.address !==
        instance.getActiveAccount().username
    );
    if (filterArr.length > 0) {
      const collapseMailIndex = mailConversation.findIndex(
        (item) => item?.id === filterArr[filterArr.length - 1]?.id
      );
      setIsCollapse(collapseMailIndex !== mailIndex);
    } else {
      setIsCollapse(mailConversation.length - 1 !== mailIndex);
    }
  }, [mailConversation]);
  const toggleCollapseItem = (mailId) => {
    setIsCollapse(!isCollapse);
  };
  const updateUnreadMailConversation = (mailId) => {
    if (currentMailItem.id === mailId) {
      setCurrentMailItem({
        ...currentMailItem,
        isRead: true,
      });
      dispatch(updateUnreadInConversation(true));
    }
  };
  return (
    <>
      {isCollapse ? (
        <OutlookMailCollapseItem
          parentFolderId={mailItem.parentFolderId}
          isDraft={mailItem.isDraft}
          hasAttachments={mailItem.hasAttachments}
          senderInfo={mailItem.sender}
          bodyPreview={mailItem.bodyPreview}
          uniqueBody={mailItem.uniqueBody}
          sentDateTime={mailItem.sentDateTime}
          mailConversation={mailConversation}
          mailIndex={mailIndex}
          mailItem={currentMailItem}
          toggleCollapseItem={toggleCollapseItem}
          setIsCollapse={setIsCollapse}
          isCollapse={isCollapse}
          updateUnreadConversation={updateUnreadMailConversation}
        />
      ) : (
        <OutlookMailExpandItem
          mailItem={mailItem}
          toggleCollapseItem={toggleCollapseItem}
        />
      )}
    </>
  );
};

export default OutlookMailItem;
