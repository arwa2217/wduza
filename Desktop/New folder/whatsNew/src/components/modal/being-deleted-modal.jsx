import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import deletingIcon from "../../assets/icons/deleting-discussion.svg";
import { useSelector, useDispatch } from "react-redux";
import { getDeletionStatus } from "../../store/actions/channelActions";
import deleting from "../../assets/icons/deleting.gif";
import done from "../../assets/icons/check_green.svg";
import { hideDeletionUnderProcess } from "../../store/actions/deletion-under-process-actions";

const DeletedStaticModal = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  z-index: 1050;
  padding-top: 50px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
`;

const DeletedStaticModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 40px;
  margin: auto;
  margin-left: ${(props) => (props.footer ? "20%" : "12%")};
  width: 60%;
  // -webkit-animation-name: animatetop;
  // -webkit-animation-duration: 0.4s;
  // animation-name: animatetop;
  // animation-duration: 0.4s;
  height: ${(props) => (props.footer ? "50%" : "62%")};
  max-height: 560px;
  top: ${(props) => (props.footer ? "25%" : "16%")};
  // align-content: center;
  // align-items: center;
  // vertical-align: middle;
  min-width: 600px;
  max-width: 680px;

  .heading {
    font-weight: 400;
    line-height: 1;
    font-size: 20px;
    color: #2c2c2c;
    display: inline-block;
  }
  .message {
    font-weight: 100;
    line-height: 1;
    font-size: 16px;
    display: inline-block;
    color: #3e3f41;
    padding-top: 10px;
  }
  .image-delete {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .owner-deletion {
    margin-top: 20px;
    border: 1px solid #2c2c2c;
    height: 210px;
    overflow-y: auto;
  }

  .image-delete-owner {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    margin-left: 5px;
  }

  .deletion-info {
    margin: 0px;
    margin-top: 8px;
    max-width: 95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${(props) =>
      props.deleted ? "var(--grey__dark)" : "var(--default)"};
  }

  .btn-ok {
    float: right;
    margin-top: 12px;
    min-width: 120px;
    height: 40px;
    background-color: var(--primary);
    color: var(--white);
    border: var(--primary__dark);
    outline: none;
  }

  .btn-ok:hover .btn-ok:focus {
    outline: none;
  }
`;

function BeingDeletedModal(props) {
  const dispatch = useDispatch();
  const showDeletingModal = useSelector(
    (state) => state.DeletionUnderProcess.showDeletingModal
  );
  const deletionOrganizationList = useSelector(
    (state) => state.ChannelReducer.deletionOrganizationList
  );
  const deletionOrganizationStatus = useSelector(
    (state) => state.ChannelReducer.deletionOrganizationStatus
  );

  const showFooter = useSelector(
    (state) => state.DeletionUnderProcess.showFooter
  );
  const [timerId, setTimerId] = useState(null);
  useEffect(() => {
    if (props.channel?.id && props.channel?.isOwner && showDeletingModal) {
      if (timerId) {
        clearInterval(timerId);
      }

      let timer = setInterval(() => {
        dispatch(getDeletionStatus(props.channel?.id));
      }, 3000);
      setTimerId(timer);
    }
    if (!showDeletingModal) {
      if (timerId) {
        clearInterval(timerId);
      }
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [props, props.channel, showDeletingModal]);
  const { t } = useTranslation();

  function handleClose() {
    dispatch(hideDeletionUnderProcess());
  }
  return (
    <DeletedStaticModal show={showDeletingModal}>
      <DeletedStaticModalContent footer={showFooter === true}>
        <span className="heading">
          {deletionOrganizationStatus !== "DELETED" &&
            t("delete.discussion.modal:deleting.under.process.heading")}
          {deletionOrganizationStatus === "DELETED" &&
            t("delete.discussion.modal:deleting.completed.process.heading", {
              discussion: props.channel?.name,
            })}
        </span>
        {!props.channel?.isOwner && (
          <img src={deletingIcon} alt="deleting" className="image-delete" />
        )}

        {props.channel?.isOwner && deletionOrganizationStatus === "DELETED" && (
          <span className="message">
            {t("delete.discussion.modal:deleting.completed.process.message")}
          </span>
        )}
        {props.channel?.isOwner && (
          <div className="owner-deletion">
            {props.channel?.isOwner &&
            deletionOrganizationList?.length !== 0 ? (
              deletionOrganizationList?.map((org) => {
                return (
                  <p
                    className="deletion-info"
                    deleted={(org.status === "DELETED").toString()}
                    key={org.company_name}
                  >
                    <img
                      src={org.status === "DELETED" ? done : deleting}
                      className="image-delete-owner"
                      alt="owner-deleting"
                    />
                    {org.status === "DELETED"
                      ? t("delete.discussion.modal:deletion.completed", {
                          orgName: org.company_name,
                        })
                      : t("delete.discussion.modal:under.deletion", {
                          orgName: org.company_name,
                        })}
                  </p>
                );
              })
            ) : (
              <p className="deletion-info">
                <img
                  src={deleting}
                  className="image-delete-owner"
                  alt="owner-deleting"
                />
                {t("fetching.organizations")}
              </p>
            )}
          </div>
        )}
        <div hidden={showFooter}>
          <button className="btn-ok" onClick={handleClose}>
            {t("delete.discussion.modal:done")}
          </button>
        </div>
      </DeletedStaticModalContent>
    </DeletedStaticModal>
  );
}

export default BeingDeletedModal;
