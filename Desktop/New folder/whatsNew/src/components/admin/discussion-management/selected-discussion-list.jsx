import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import ActivationStatus from "../account-management/activation-status";
import CloseIcon from "../../../assets/icons/close.svg";
import { setSelectedDiscussions } from "../../../store/actions/admin-discussion-action";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ExternalDiscussionIcon from "../../../assets/icons/external-discussion.svg";
import GuestDiscussionIcon from "../../../assets/icons/guest-discussion.svg";
import ChannelConstants from "../../../constants/channel/channel-constants";
import DeleteDiscussionModal from "../../../components/modal/discussion/delete-discussion-modal";
import { adminDeleteDiscussionData } from "../../../store/actions/admin-discussion-action";
import { showToast } from "../../../store/actions/toast-modal-actions";

const AccountContainer = styled.div`
  padding: 10px 20px;
  &:hover {
    background: #f8f8f8;
  }
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .close-btn {
    position: absolute;
    display: none;
    right: 20px;
    top: 50%;
    transform: translate(0, -50%);
  }

  &:hover .close-btn {
    display: block;
    img {
      height: 15px;
      width: 15px;
    }
  }
`;

const AccountWrapper = styled.div`
  display: flex;
`;

const AccountInfo = styled.div`
  margin-right: 20px;
`;

const Name = styled.div`
  color: #19191a;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
`;

const Creator = styled.div`
  color: #19191a;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
`;

const UserImg = styled.span`
  margin-left: 15px;
  img {
    height: 100%;
    width: 100%;
  }
`;

const SelectedDiscussionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDiscussions = useSelector(
    (state) => state.AdminDiscussionReducer.selectedDiscussions
  );
  let filteredSelectedDiscussion = selectedDiscussions.filter(
    (el) => el.checked
  );
  let filteredSelectedNotDeletedDiscussion = selectedDiscussions.filter(
    (el) => el.checked && el.status !== "DELETED"
  );

  const [showDeleteDiscussionModal, setShowDeleteDiscussionModal] =
    useState(false);

  const handleRemove = (id) => {
    let data = [...selectedDiscussions];
    let newData = data.map((acc) => {
      if (acc.id === id) acc["checked"] = false;
      return acc;
    });
    dispatch(setSelectedDiscussions(newData));
  };

  const submitDelete = async (list) => {
    let reqSelectedList = list.map((value) => value.id);
    let requestBody = {
      channels: reqSelectedList,
    };
    if (reqSelectedList.length) {
      const response = await dispatch(adminDeleteDiscussionData(requestBody));
      if (response.payload.code === 2001) {
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            t(
              `admin:discussion.management:success.code:${response.payload.code}`
            ),
            3000,
            "success"
          )
        );
      } else if (response.payload.code === 2011) {
        let myList = [...filteredSelectedNotDeletedDiscussion];
        let newList = [];
        myList.forEach((el) => {
          response.payload.data.forEach((element) => {
            if (element.channelID === el.id) {
              let newObj = {
                id: el.id,
                errCode: element.errCode,
                channelName: el.name,
              };
              newList.push(newObj);
            }
          });
        });
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            newList.map((el) => (
              <span className="d-flex" key={el.id}>
                {el.channelName}
                {" - "}
                {t(`admin:discussion.management:error.code:${el.errCode}`)}
              </span>
            )),
            3000,
            "failure"
          )
        );
      }
    }
  };

  return (
    <Col className="pd-20 border-top w-100">
      {filteredSelectedDiscussion.length > 0 ? (
        filteredSelectedDiscussion.map(
          ({ name, creator, id, status, checked, type }, index) => (
            <Row key={id}>
              <AccountContainer>
                <AccountWrapper>
                  <AccountInfo>
                    {name && <Name>{name}</Name>}
                    {creator && <Creator>{creator}</Creator>}
                    <ActivationStatus status={status} />
                  </AccountInfo>
                  <UserImg>
                    {type === ChannelConstants.EXTERNAL ? (
                      <img src={ExternalDiscussionIcon} alt="" />
                    ) : type === ChannelConstants.GUEST ? (
                      <img src={GuestDiscussionIcon} alt="" />
                    ) : (
                      ""
                    )}
                  </UserImg>
                </AccountWrapper>
                <span className="close-btn" onClick={() => handleRemove(id)}>
                  <img src={CloseIcon} alt="Close" />
                </span>
              </AccountContainer>
            </Row>
          )
        )
      ) : (
        <div className="text-center">
          {t("admin:discussion.management:selected.list:no.data")}
        </div>
      )}
      {filteredSelectedDiscussion.length > 0 && (
        <>
          <div className="d-flex justify-content-between custom-form-actions">
            <Button
              variant="outline-primary"
              className={`w-100 ${
                filteredSelectedNotDeletedDiscussion.length ? "" : "disabled"
              }`}
              disabled={
                filteredSelectedNotDeletedDiscussion.length > 0 ? false : true
              }
              onClick={() => {
                setShowDeleteDiscussionModal(true);
              }}
              style={{marginTop: '20px'}}
            >
              Remove
            </Button>
          </div>
          <DeleteDiscussionModal
            showModal={showDeleteDiscussionModal}
            onSubmit={() => submitDelete(filteredSelectedNotDeletedDiscussion)}
            discussionCount={filteredSelectedNotDeletedDiscussion.length}
            closeModal={() => setShowDeleteDiscussionModal(false)}
          />
        </>
      )}
    </Col>
  );
};

export default SelectedDiscussionList;
