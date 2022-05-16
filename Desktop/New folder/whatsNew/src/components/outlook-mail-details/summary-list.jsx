import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ArrowDown from "../../assets/icons/arrow-down.svg";
import ArrowRight from "../../assets/icons/arrow-right.svg";
import SenderItem from "./sender-item";
import MailItem from "./mail-item";
import AttachmentsList from "./attachments-list";
import {
  createRequestLimit,
  mapAddress,
  uniqEmail,
} from "../../utilities/outlook";
const detailItems = (t) => {
  return [
    {
      name: "Maillist",
      key: "mail",
      class: " ",
    },
    {
      name: "Member",
      key: "member",
      class: " ",
    },
    {
      name: "File",
      key: "file",
      class: " ",
    },
  ];
};
function SummaryList(props) {
  const { t, i18n } = useTranslation();
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
  );
  const [memberData, setMemberData] = useState([]);
  const [selected, setSelected] = useState("");
  const [currentSelected, setCurrentSelected] = useState("");
  const currentConversationData = useSelector(
    (state) => state.OutlookMailReducer?.conversationData
  );
  const [limitPerLoad, setLimitPerLoad] = useState(5);
  const handleClick = (e) => {
    setCurrentSelected(e);
    let requestedIndex = detailItems(t).findIndex((item) => item.key === e);
    let prevState = selected;
    if (prevState === requestedIndex) requestedIndex = -1;
    setSelected(requestedIndex);
  };
  const mailHighLightId = useSelector(
    (state) => state.OutlookMailReducer.currentHighLightMailId
  );
  useEffect(() => {
    setLimitPerLoad(5);
    setSelected(0);
    setCurrentSelected("mail");
  }, [activeEmail]);
  const handleLoadMore = () => {
    if (
      limitPerLoad < currentConversationData.length &&
      currentConversationData.length > 0
    ) {
      let limitNew = limitPerLoad + 5;
      if (currentConversationData.length - limitPerLoad < 5) {
        limitNew =
          limitPerLoad + (currentConversationData.length - limitPerLoad);
      }
      setLimitPerLoad(limitNew);
    }
  };
  useEffect(() => {
    let toList = [];
    let ccList = [];
    let bccList = [];
    let senderObj = {};
    let dataList = [];
    currentConversationData.map((conversation) => {
      const { toRecipients, ccRecipients, bccRecipients, sender } =
        conversation;
      toList = [...toRecipients.map((item) => item.emailAddress), ...toList];
      ccList = [...ccRecipients.map((item) => item.emailAddress), ...ccList];
      bccList = [...bccRecipients.map((item) => item.emailAddress), ...bccList];
      senderObj = { ...sender.emailAddress };
      dataList = [...dataList].concat(toList, ccList, bccList, [senderObj]);
    });
    setMemberData(uniqEmail(dataList, "address"));
  }, [currentConversationData]);
  const handleMarkAllRead = async () => {
    const listId = currentConversationData.map((item) => {
      return item.id;
    });
    const url = `/me/messages/{id}`;
    await createRequestLimit(listId, url, "PATCH", {
      isRead: true,
    });
  };
  return (
    <Col
      xs={12}
      className="channel-details-body channel-details-content-scroll p-0"
    >
      {detailItems(t).map((item, index) => (
        <Row
          key={"BaseRow" + item.key}
          className={"mr-0 ml-0 pr-0 border-bottom" + item.class}
        >
          <Row
            key={"Row" + item.key}
            className={"center" + ` ${selected === index ? "tab-title" : ""}`}
          >
            <Col key={"Col" + item.key} xs={12} className="p-0 pl-4 pr-4">
              <button
                key={"button" + item.key}
                onClick={() => handleClick(item.key)}
                className="channel-details-content-button text-left btn-block p-0"
              >
                <span style={{ fontSize: "15px", color: "#19191a" }}>
                  {t(`mail-summary-title:${item.name}`)}
                </span>
                <div key={"div" + item.key} className="float-right">
                  {selected === index ? (
                    <img src={ArrowDown} style={{ width: "15px" }} alt="" />
                  ) : (
                    <img src={ArrowRight} style={{ width: "15px" }} alt="" />
                  )}
                </div>
              </button>
            </Col>
          </Row>
          {selected === index && currentSelected !== "" ? (
            currentSelected === "mail" ? (
              <div className="row w-100 ml-0">
                <span
                  className="mark-as-read-mail"
                  style={{ cursor: "pointer" }}
                  onClick={handleMarkAllRead}
                >
                  {t("mail-summary-action:markAll")}
                </span>
                <div className="col-12 p-0 email-list">
                  {[...currentConversationData]
                    .splice(0, limitPerLoad)
                    ?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            item?.id === mailHighLightId
                              ? "mail-summary-active"
                              : ""
                          }
                        >
                          <MailItem
                            item={item}
                            handleLoadMore={handleLoadMore}
                          />
                        </div>
                      );
                    })}
                </div>
                {currentConversationData.length > limitPerLoad ? (
                  <span className="load-more-list-mail" onClick={handleLoadMore}>
                    {t("mail-contact:more")}
                  </span>
                ) : null}
              </div>
            ) : currentSelected === "member" ? (
              <div className="row w-100 ml-0">
                <div className="col-12 p-0">
                  {memberData.length
                    ? memberData.map((item, index) => {
                        return <SenderItem item={item} key={index} />;
                      })
                    : null}
                </div>
              </div>
            ) : (
              <AttachmentsList />
            )
          ) : null}
        </Row>
      ))}
    </Col>
  );
}
export default SummaryList;
