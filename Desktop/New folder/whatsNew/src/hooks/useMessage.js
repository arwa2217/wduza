import { useEffect, useState } from "react";
import {
  setActiveDraftMailId,
  setActiveEmail,
  setConversationEmailsSelected,
  setCurrentOutLookMailId,
  setCurrentOutLookMailIdOrigin,
  setEmailPhotos,
  setEmailsSelected,
  setEnableWriteEmail,
  setPostEmailType,
  setSearching,
  updateUnReadNumber,
} from "../store/actions/outlook-mail-actions";
import { postEmailType } from "../outlook/config";
import {
  autoRefreshTime,
  clearDataCached,
  createRequestLimit,
  getDomainNameByEmail,
  getLimit,
  mergeEmailByConversationId,
  showNotification,
} from "../utilities/outlook";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailFlaggedIds,
  getNewEmailsByType,
  getNewEmailsColor,
  getNewUniqueEmailPhotos,
  updatePhotoEmails,
} from "../utilities/outlook-message-list";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { setActivePanelAction } from "../store/actions/config-actions";
import Panel from "../components/actionpanel/panel";
import services from "../outlook/apiService";
const useMessage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [nextIndex, setNextIndex] = useState("");
  const [uniqueEmailPhotos, setUniqueEmailPhotos] = useState([]);
  const localEmailList = JSON.parse(localStorage.getItem("EMAIL_LIST")) || [];
  const localNextLink = localStorage.getItem("NEXT_LINK") || "";
  const localTypeEmail = localStorage.getItem("TYPE_EMAIL") || "inbox";
  const [emails, setEmails] = useState(localEmailList);
  const [uniqueEmail, setUniqueEmail] = useState([]);
  const [initHeight, setInitHeight] = useState(0);
  const [nextLink, setNextLink] = useState(localNextLink);
  const [emailFlagIds, setEmailFlagIds] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [openSearchAdvanceOption, setOpenSearchAdvanceOption] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [typeEmail, setTypeEmail] = useState(localTypeEmail);

  const deleteId = useSelector((state) => state.OutlookMailReducer.deleteId);
  const isRefresh = useSelector((state) => state.OutlookMailReducer.isRefresh);
  const isConversationRead = useSelector(
    (state) => state.OutlookMailReducer.isConversationRead
  );
  const sendEmailType = useSelector(
    (state) => state.OutlookMailReducer.sendEmailType
  );
  const emailsAffected = useSelector(
    (state) => state.OutlookMailReducer.emailsAffected
  );
  const emailPhotos = useSelector(
    (state) => state.OutlookMailReducer.emailPhotos
  );
  const [emailChecked, setEmailChecked] = useState([]);
  const [indexEmailsChecked, setIndexEmailsChecked] = useState([]);
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer.activeEmail
  );
  const activeDraftMailId = useSelector(
    (state) => state.OutlookMailReducer.activeDraftMailId
  );
  const isSearching = useSelector(
    (state) => state.OutlookMailReducer.isSearching
  );
  const isFiltering = useSelector(
    (state) => state.OutlookMailReducer.isFiltering
  );
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const isRefreshClick = useSelector(
    (state) => state.OutlookMailReducer.isRefreshClick
  );
  const newReplyEmailList = useSelector(
    (state) => state.OutlookMailReducer.newReplyEmailList
  );

  const { instance } = useMsal();
  const limit = getLimit();
  const isAuthenticated = useIsAuthenticated();
  const activeAccount = instance.getActiveAccount();
  const { username } = activeAccount;
  const userDomainName = getDomainNameByEmail(username);

  // set local
  const setDataLocalStorage = (emailPhotos) => {
    // set to defaultImage
    const newData = emailPhotos.map((item) => {
      return {
        ...item,
        isDefault: false,
      };
    });
    localStorage.setItem("EMAIL_COLOR", JSON.stringify(newData));
    dispatch(setEmailPhotos(newData));
  };
  // handle change bodyPreview
  const handleChangeBodyPreview = () => {
    const newEmailMapList = [...emails].map((item) => {
      return item?.conversationId ===
        newReplyEmailList[newReplyEmailList.length - 1]?.conversationId
        ? {
            ...item,
            bodyPreview:
              newReplyEmailList[newReplyEmailList.length - 1].bodyPreview,
          }
        : item;
    });
    localStorage.setItem("EMAIL_LIST", JSON.stringify(newEmailMapList));
    setEmails(newEmailMapList);
  };
  // show detail
  const handleShowDetailsMessage = (email, index) => {
    if (!email || Object.keys(email).length === 0) {
      return;
    }
    if (typeof index === "number") {
      const nextIndexValue = index === 0 ? index + 1 : index - 1;
      setNextIndex(nextIndexValue);
    }
    const { conversationId, id } = email;
    dispatch(setCurrentOutLookMailId(conversationId));
    dispatch(setCurrentOutLookMailIdOrigin(id));
    dispatch(setActiveEmail(email));
    if (email.isDraft) {
      dispatch(setPostEmailType(postEmailType.editDraftEmail));
      dispatch(setEnableWriteEmail(true));
      dispatch(setActiveDraftMailId(email.id));
      //setEditorFocus(postEmailType.newEmail);
      //Check if email have To Recipients will focus to editor else focus to To Recipients
      // TODO: Fix set Editor focus follow by new editor
      // if (email.toRecipients.length > 0) {
      //   setEditorFocus(postEmailType.editDraftEmail);
      // } else {
      //   setEditorFocus(postEmailType.newEmail);
      // }
    } else {
      dispatch(setPostEmailType(postEmailType.init));
      dispatch(setEnableWriteEmail(false));
    }
  };
  //load more
  const handleLoadMore = async () => {
    if (emails.length) {
      await getListEmail("", false, true);
    }
  };
  // get list email
  const getListEmail = async (
    value,
    isFirstLoad = false,
    isLoadMore = false,
    keyword = "",
    filter = ""
  ) => {
    try {
      if (isAuthenticated) {
        let newEmail = [...emails];
        if (isFirstLoad) {
          setEmails([]);
          newEmail = [];
          setEmailChecked([]);
          setIndexEmailsChecked([]);
        }
        if (isLoadMore && nextLink === "") {
          return;
        }
        const localEmailList =
          JSON.parse(localStorage.getItem("EMAIL_LIST")) || [];
        const isSearchOrFilter = keyword !== "" || filter !== "";
        if (isLoadMore || localEmailList.length === 0) {
          setLoading(true);
          const sendNextLink = isLoadMore ? nextLink : ``;
          const conversationIds = newEmail.map(
            (email) => email?.conversationId
          );
          const result = await services.getMailFoldersById(
            value,
            sendNextLink,
            keyword,
            filter,
            conversationIds
          );
          let listMail = result.value;
          if (isLoadMore) {
            listMail = emails.concat(result.value);
            listMail = mergeEmailByConversationId(listMail.concat(result.old));
            //listMail = emails.concat(result.value)
          }
          const newNextLink = result["@odata.nextLink"]
            ? result["@odata.nextLink"]
            : "";
          setNextLink(newNextLink);
          const { newUniqueEmailPhotos, newUniqueEmail } =
            getNewUniqueEmailPhotos(
              uniqueEmailPhotos,
              uniqueEmail,
              listMail,
              userDomainName
            );

          setUniqueEmailPhotos(newUniqueEmailPhotos);
          setUniqueEmail(newUniqueEmail);
          setEmails(listMail);
          if (!isSearchOrFilter) {
            localStorage.setItem("TYPE_EMAIL", value);
            localStorage.setItem("NEXT_LINK", newNextLink);
            localStorage.setItem("EMAIL_LIST", JSON.stringify(listMail));
          }
          setLoading(false);
        } else if (localEmailList.length > 0) {
          const { newUniqueEmailPhotos, newUniqueEmail } =
            getNewUniqueEmailPhotos(
              uniqueEmailPhotos,
              uniqueEmail,
              emails,
              userDomainName
            );

          setUniqueEmailPhotos(newUniqueEmailPhotos);
          setUniqueEmail(newUniqueEmail);
          setEmails(emails);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // get new email
  const getEmailWithAuto = async () => {
    const emailListLocalStorage = localStorage.getItem("EMAIL_LIST");
    if (emailListLocalStorage && JSON.parse(emailListLocalStorage).length > 0) {
      const result = await services.getNewEmailAuto(typeEmail);
      const newEmail = result.value.filter(
        ({ conversationId: id1 }) =>
          !emails.some(({ conversationId: id2 }) => id2 === id1)
      );
      if (newEmail.length > 0) {
        dispatch(updateUnReadNumber(newEmail.length));
        const newEmailList = newEmail.concat(emails);
        localStorage.setItem("EMAIL_LIST", JSON.stringify(newEmailList));
        setEmails(newEmailList);
        showNotification(newEmail);
      }
    }
  };

  // handle to checkbox
  const handleCheckEmail = (e, index) => {
    e.stopPropagation();
    const {
      target: { value },
    } = e;
    let emailCheckedUpdate = [],
      indexEmailsCheckedUpdate = [];
    if (emailChecked.includes(value)) {
      emailCheckedUpdate = emailChecked.filter((email) => email !== value);
    } else {
      emailCheckedUpdate = [...emailChecked, value];
    }
    if (indexEmailsChecked.includes(index)) {
      indexEmailsCheckedUpdate = indexEmailsChecked
        .filter((item) => item !== index)
        .sort();
    } else {
      indexEmailsCheckedUpdate = [...indexEmailsChecked, index].sort();
    }

    const [firstIndex] = indexEmailsCheckedUpdate;
    const { length, [length - 1]: lastIndex } = indexEmailsCheckedUpdate;
    if (firstIndex - 1 < 0) {
      setNextIndex(lastIndex + 1);
    } else {
      setNextIndex(firstIndex - 1);
    }
    setEmailChecked(emailCheckedUpdate);
    setIndexEmailsChecked(indexEmailsCheckedUpdate);

    if (emailCheckedUpdate.length === 1) {
      handleShowDetailsMessage(emails[firstIndex], firstIndex);
    } else if (emailCheckedUpdate.length > 1) {
      dispatch(setActiveEmail({}));
    }
    if (emailCheckedUpdate.length === 0) {
      dispatch(setActiveEmail({}));
    }
  };

  // handle to checkbox all
  const handleCheckAll = (e) => {
    const {
      target: { checked },
    } = e;
    if (checked) {
      const emailIds = emails.map((mail) => mail.id);
      setEmailChecked(emailIds);
    } else {
      setIndexEmailsChecked([]);
      setEmailChecked([]);
    }
    dispatch(setActiveEmail({}));
  };

  // onResize get list email again
  const resizeWindow = () => {
    const messageListBody = document.getElementById("message-list-body");
    const messageListBodyHeight = messageListBody
      ? messageListBody.offsetHeight
      : 0;
    if (messageListBodyHeight > initHeight) {
      clearDataCached();
      getListEmail(typeEmail, true);
    }
  };

  //change email status
  const changeEmailReadStatus = (mailChange) => {
    const newEmailMapList = [...emails].map((item) => {
      return item.id === mailChange.id
        ? {
            ...item,
            isRead: mailChange.isRead,
          }
        : item;
    });
    setEmails(newEmailMapList);
    localStorage.setItem("EMAIL_LIST", JSON.stringify(newEmailMapList));
  };

  // init height
  useEffect(() => {
    const messageListBody = document.getElementById("message-list-body");
    if (messageListBody) {
      setInitHeight(messageListBody.offsetHeight);
    }
  }, []);

  useEffect(() => {
    !Object.keys(activeEmail).length
      ? dispatch(setActivePanelAction(Panel.WELCOME_EMAIL, null))
      : dispatch(setActivePanelAction(Panel.OUTLOOK_EMAIL));
  }, [activeEmail]);

  useEffect(() => {
    if (isRefresh) {
      handleShowDetailsMessage(activeEmail);
    }
  }, [activeEmail, isRefresh]);

  useEffect(() => {
    if (
      newReplyEmailList.length > 0 &&
      !isFiltering &&
      !isSearching &&
      typeEmail === "inbox"
    ) {
      handleChangeBodyPreview();
    }
  }, [newReplyEmailList]);

  // get flagged email ids
  useEffect(() => {
    const emailFlaggedIds = getEmailFlaggedIds(emails);
    setEmailFlagIds(emailFlaggedIds);
  }, [emails.length]);

  // handle after delete
  useEffect(() => {
    if (deleteId) {
      const deleteArr = deleteId.split(",");
      if (deleteArr.length) {
        const emailsFilter = emails.filter((email) =>
          deleteArr.every((emailId) => email.id !== emailId)
        );
        const updateEmails = [...emailsFilter];
        setEmails(updateEmails);
        localStorage.setItem("EMAIL_LIST", JSON.stringify(updateEmails));
      }
      if (activeEmail && Object.keys(activeEmail).length) {
        handleShowDetailsMessage(emails[nextIndex]);
      }
      // after delete email clear email checked
      setEmailChecked([]);
      setIndexEmailsChecked([]);
      // load more if email less than limit
      if (emails.length < limit) {
        handleLoadMore();
      }
    }
  }, [deleteId]);

  // update info
  useEffect(() => {
    if (Object.keys(activeEmail).length) {
      if (!activeEmail.isRead) {
        const updateInfo = async () => {
          const result = await services.updateEmailInfo(activeEmail.id, {
            isRead: true,
          });
          changeEmailReadStatus(result);
          dispatch(setActiveEmail(result));
        };
        try {
          updateInfo();
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [activeEmail]);

  useEffect(() => {
    if (isConversationRead.id) {
      changeEmailReadStatus(isConversationRead);
    }
  }, [isConversationRead]);
  // after flag, delete,read, unread
  useEffect(() => {
    if (emailsAffected && Object.keys(emailsAffected).length) {
      //console.log(emailsAffected)
      const { data = [], type } = emailsAffected;
      const newEmailsByType = getNewEmailsByType(emails, data, type);
      if (type === "flag" || type === "unFlag") {
        const emailFlaggedIds = getEmailFlaggedIds(newEmailsByType);
        setEmailFlagIds(emailFlaggedIds);
      }
      localStorage.setItem("EMAIL_LIST", JSON.stringify([...newEmailsByType]));
      setEmails([...newEmailsByType]);
      setEmailChecked([]);
      setIndexEmailsChecked([]);
    }
  }, [emailsAffected]);

  // first load
  useEffect(() => {
    getListEmail(typeEmail, true);
    dispatch(setSearching(false));
  }, []);

  // handle onResize
  useEffect(() => {
    //resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, [typeEmail, initHeight]);

  // update list email checked
  useEffect(() => {
    if (emails.length) {
      const emailsConversationId = emails
        .filter((email) => emailChecked.includes(email.id))
        .map((email) => email?.conversationId)
        .filter((v, i, a) => a.indexOf(v) === i);

      dispatch(setConversationEmailsSelected(emailsConversationId));
      dispatch(setEmailsSelected(emailChecked));
    } else {
      dispatch(setEmailsSelected([]));
    }
  }, [emails, emailChecked]);

  useEffect(() => {
    setLoadingRefresh(isRefreshClick);
  }, [isRefreshClick]);

  //Handle active message list item when after send email draft

  useEffect(() => {
    if (sendEmailType === "SEND_DRAFT_EMAIL") {
      if (activeDraftMailId) {
        const emailsFilter = emails.filter(
          (email) => email.id !== activeDraftMailId
        );
        const updateEmails = [...emailsFilter];
        localStorage.setItem("EMAIL_LIST", JSON.stringify(updateEmails));
        setEmails(updateEmails);
        if (activeEmail && Object.keys(activeEmail).length) {
          handleShowDetailsMessage(emails[nextIndex], nextIndex);
        }
        // load more if email less than limit
        if (emails.length < limit) {
          handleLoadMore();
        }
      }
    }
  }, [activeDraftMailId, sendEmailType]);
  // auto refresh
  useEffect(() => {
    if (!isFiltering && !isSearching && typeEmail === "inbox") {
      const interval = setInterval(() => {
        getEmailWithAuto();
      }, autoRefreshTime);
      return () => clearInterval(interval);
    }
  }, [emails, typeEmail]);

  // update list email photo
  useEffect(() => {
    if (uniqueEmailPhotos.length) {
      let newUniqueEmailPhotos = [...uniqueEmailPhotos];
      const getListEmailPhotos = async () => {
        const listEmail = uniqueEmailPhotos.map((item) => item.email);
        const url = `/users/{id}/photo/$value`;
        const results = await createRequestLimit(listEmail, url);
        let responseData = [];
        results.map((item) => {
          responseData = [...responseData, ...item.responses];
          return item;
        });
        newUniqueEmailPhotos = updatePhotoEmails(
          responseData,
          newUniqueEmailPhotos
        );
        const emailColorInLocal = localStorage.getItem("EMAIL_COLOR");
        if (!emailColorInLocal) {
          setDataLocalStorage(newUniqueEmailPhotos);
        } else {
          const newDataEmailColor = getNewEmailsColor(newUniqueEmailPhotos);
          setDataLocalStorage(newDataEmailColor);
        }
      };
      getListEmailPhotos();
    }
  }, [uniqueEmailPhotos.length]);

  return {
    loading,
    setLoading,
    nextIndex,
    setNextIndex,
    handleShowDetailsMessage,
    setDataLocalStorage,
    uniqueEmailPhotos,
    setUniqueEmailPhotos,
    emails,
    setEmails,
    typeEmail,
    setTypeEmail,
    handleCheckEmail,
    handleCheckAll,
    keyword,
    setKeyword,
    handleLoadMore,
    getListEmail,
    openSearch,
    setOpenSearch,
    openSearchAdvanceOption,
    setOpenSearchAdvanceOption,
    loadingRefresh,
    setLoadingRefresh,
    emailFlagIds,
    setEmailFlagIds,
    emailPhotos,
    emailChecked,
    setEmailChecked,
    activeEmail,
    localEmailList,
  };
};

export default useMessage;
