/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./message-list.css";
import { List } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageListHeader from "../outlook/message-list-header";
import MessageListItem from "./message-list-item";
import { useTranslation } from "react-i18next";
import { setHeight, loader, autoRefreshTime } from "../../utilities/outlook";
import AdvancedSearch from "./advanced-search";
import useMessage from "../../hooks/useMessage";
import OutLookLoading from "../outlook-shared/OutLookLoading";

const MessageList = () => {
  const { t } = useTranslation();
  const {
    loading,
    emails,
    setEmails,
    getListEmail,
    typeEmail,
    setTypeEmail,
    handleShowDetailsMessage,
    handleLoadMore,
    loadingRefresh,
    emailPhotos,
    emailFlagIds,
    setEmailFlagIds,
    emailChecked,
    setEmailChecked,
    setNextIndex,
    handleCheckAll,
    handleCheckEmail,
    activeEmail,
    keyword,
    setKeyword,
    openSearch,
    setOpenSearch,
    openSearchAdvanceOption,
    setOpenSearchAdvanceOption,
    localEmailList,
  } = useMessage();

  return (
    <div className="message-list">
      <MessageListHeader
        setEmails={setEmails}
        getListEmail={getListEmail}
        setTypeEmail={setTypeEmail}
        typeEmail={typeEmail}
        handleCheckAll={handleCheckAll}
        emails={emails}
        emailChecked={emailChecked}
        loading={loading}
        setOpenSearch={setOpenSearch}
        openSearch={openSearch}
        setKeyword={setKeyword}
        keyword={keyword}
        setOpenSearchAdvanceOption={setOpenSearchAdvanceOption}
      />
      <AdvancedSearch
        getListEmail={getListEmail}
        typeEmail={typeEmail}
        setTypeEmail={setTypeEmail}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        keyword={keyword}
        openSearchAdvanceOption={openSearchAdvanceOption}
      />
      <div className="message-list-body" id="message-list-body">
        {loadingRefresh ? (
            <div className="pt-3 bg-white" style={{ height : setHeight() }}>
              <OutLookLoading />
            </div>
        ) : (
          <InfiniteScroll
            id="message-list-container"
            dataLength={emails.length}
            next={() => handleLoadMore()}
            hasMore={true}
            height={setHeight(openSearchAdvanceOption)}
            loader={loader(loading)}
            className="message-list-container"
          >
            {emails.length > 0
              ? emails.map((email, index) => (
                  <List.Item
                    key={email?.conversationId}
                    className={`message-list-body-item ${
                      activeEmail && activeEmail.id === email.id
                        ? "active-item"
                        : ""
                    } ${
                      emailFlagIds.includes(email.id) ? "flagged-message" : ""
                    }`}
                    onClick={(e) => handleShowDetailsMessage(email, index)}
                  >
                    <MessageListItem
                      email={email}
                      emailPhotos={emailPhotos}
                      emailFlagIds={emailFlagIds}
                      setEmailFlagIds={setEmailFlagIds}
                      emailChecked={emailChecked}
                      setEmailChecked={setEmailChecked}
                      handleCheckEmail={(e) => handleCheckEmail(e, index)}
                      index={index}
                      setNextIndex={setNextIndex}
                      typeEmail={typeEmail}
                    />
                  </List.Item>
                ))
              : !loading &&
                localEmailList.length === 0 && (
                  <div className="text-center p-3">
                    {t("outlook.mail:no.data")}
                  </div>
                )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default MessageList;
