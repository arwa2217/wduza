import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import DefaultUser from "../../../assets/icons/default-user.svg";
import ActivationStatus from "./activation-status";
import CloseIcon from "../../../assets/icons/close.svg";
import {
  setSelectedAccounts,
  assignUuidAdmin,
  activateUser,
  deleteUser,
} from "../../../store/actions/admin-account-action";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import DeleteAccountModal from "../../../components/modal/account/delete-account-modal";
import DeleteAccountFailedModal from "../../../components/modal/account/delete-account-failed-modal";
import { useTranslation } from "react-i18next";
import DeleteWarningModal from "../../../components/modal/account/delete-warning-modal";
import SuccessModal from "../../modal/account/success-modal";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { RESET_USER_STATUS_ACTIVITY } from "../../../store/actionTypes/admin-account-action-types";

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
  //   padding: 10px 20px;
  display: flex;
  //   &:hover {
  //     background: #f8f8f8;
  //   }
`;

const AccountInfo = styled.div`
  margin-right: 20px;
`;

const UserImg = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 15px;
  img {
    height: 100%;
    width: 100%;
  }
`;

const Name = styled.span`
  color: #19191a;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
`;

const VerticalDivider = styled.span`
  width: 1px;
  height: 10px;
  background: #c4c4c4;
  display: inline-block;
  margin: 0 5px;
`;

const Email = styled.div`
  color: #2d76ce;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  text-decoration-line: underline;
`;

const UID = styled.span`
  color: #19191a;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
`;

const SelectedAccountsList = () => {
  const { t } = useTranslation();
  const [assignShow, setAssignShow] = useState(false);
  const [activateShow, setActivateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteFailedModal, setShowDeleteFailedModal] = useState(false);
  const [showDeleteWarningModal, setDeleteWarningModal] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(null);
  const [warningList, setWarningList] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    msg: "",
    title: "",
  });

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const closeDeleteFailedModal = () => {
    setShowDeleteFailedModal(false);
  };
  let { userStatusChangeSuccess, userStatusChangeType } = useSelector(
    (state) => state.AdminAccountReducer
  );

  const selectedAccounts = useSelector(
    (state) => state.AdminAccountReducer.selectedAccounts
  );

  const openModal = (msg, title) => {
    setShowModal({ show: true, msg, title });
  };

  const closeModal = () => {
    setShowModal({ show: false, msg: "", title: "" });
  };

  useEffect(() => {
    if (userStatusChangeType === "DELETED") {
      if (userStatusChangeSuccess) {
        setShowDeleteModal(false);
        setDeleteWarningModal(false);
        openModal(t("account:account.delete.success"), t("account:deleted"));
      } else if (userStatusChangeSuccess === false) {
        setDeleteWarningModal(false);
        setShowDeleteModal(false);
        dispatch(
          showToast(
            t("admin:account.management:user.information:error.message"),
            3000
          )
        );
      }
    }
    return () =>
      dispatch({
        type: RESET_USER_STATUS_ACTIVITY,
      });
  }, [userStatusChangeSuccess]);

  const dispatch = useDispatch();
  const handleRemove = (uid) => {
    let data = [...selectedAccounts];
    data = data.map((acc) => {
      if (acc.uid === uid) acc["checked"] = false;
      return acc;
    });
    dispatch(setSelectedAccounts(data));
  };
  let reqSelectedList =
    selectedAccounts &&
    selectedAccounts.length > 0 &&
    selectedAccounts
      .filter((item) => item.activationStatus === "PENDING")
      .map((value) => value.id);

  // useEffect(() => {
  //   if (reqSelectedList && reqSelectedList.length > 0) {
  //     setAssignShow(true);
  //     setDeleteShow(true);
  //   }
  // }, [reqSelectedList]);

  useEffect(() => {
    if (reqSelectedList && reqSelectedList.length > 0) {
      setAssignShow(true);
    }
  }, [reqSelectedList]);

  useEffect(() => {
    if (selectedAccounts && selectedAccounts.length > 0) {
      let reqSelectedList =
        selectedAccounts &&
        selectedAccounts.length > 0 &&
        selectedAccounts
          .filter((item) => item.activationStatus !== "DELETED")
          .map((value) => value.id);
      if (reqSelectedList && reqSelectedList.length) {
        setDeleteShow(true);
      }
    }
  }, [selectedAccounts]);

  const assignUid = () => {
    dispatch(assignUuidAdmin(reqSelectedList));
  };

  const activate = async (e) => {
    e.preventDefault();
    let reqSelectedList = [];
    if (selectedAccounts?.length) {
      reqSelectedList = selectedAccounts
        .filter((item) => item.activationStatus === "PENDING")
        .map((value) => value.id);
      reqSelectedList.length && dispatch(activateUser(reqSelectedList));
    }
  };

  useEffect(() => {
    if (warningList && warningList.length > 0) {
      setCurrentData(warningList[0]);
      setCurrentDataIndex(0);
      setDeleteWarningModal(true);
    }
  }, [warningList]);

  const handleDelete = () => {
    if (selectedAccounts.length) {
      var list = selectedAccounts.filter(
        (item) => item?.ownedDiscussionCount > 0
      );
      if (list.length) {
        setWarningList(list);
      } else {
        openDeleteModal();
      }
    }
  };
  const okAction = () => {
    if (selectedAccounts.length) {
      var list = selectedAccounts.filter(
        (item) => item?.ownedDiscussionCount === 0
      );
      if (list.length) {
        submitDelete(list);
      } else {
        setDeleteWarningModal(false);
        setShowDeleteModal(false);
      }
    }
  };
  const submitDelete = (list) => {
    if (list.length) {
      let reqSelectedList = list
        .filter((item) => item.activationStatus !== "DELETED")
        .map((value) => ({
          userId: value.id,
          activationStatus: "DELETED",
        }));
      if (reqSelectedList.length) {
        dispatch(
          deleteUser(
            reqSelectedList,
            "DELETED",
            "Successfully deleted the selected account."
          )
        );
      }
    } else {
      setDeleteWarningModal(false);
      setShowDeleteModal(false);
    }
  };

  const nextAction = () => {
    if (warningList?.length) {
      setCurrentData(warningList[currentDataIndex + 1]);
      setCurrentDataIndex(currentDataIndex + 1);
    }
  };

  const previousAction = () => {
    if (warningList?.length) {
      setCurrentData(warningList[currentDataIndex - 1]);
      setCurrentDataIndex(currentDataIndex - 1);
    }
  };

  function modalProps() {
    let data = "";
    data = {
      header: "delete.warning.modal:header",
      content1:
        currentData?.ownedDiscussionCount?.length === 1
          ? "delete.warning.modal:content.firstline.single"
          : "delete.warning.modal:content.firstline.multiple",
      total: warningList?.length,
      userData: currentData,
      userIndex: currentDataIndex + 1,
      // discussionList: currentData?.discussionList,
      discussionList: currentData?.discussionList?.map(({ name }) => name),
      ownerName:
        currentData.name === "" ? currentData.screenName : currentData.name,
      content2: "delete.warning.modal:content.secondline",
      primaryButtonText: "delete.warning.modal:ok.button",
      secondaryButtonText: "delete.warning.modal:next.button",
      thirdButtonText: "delete.warning.modal:previous.button",
    };
    return data;
  }

  return (
    <Col className="pd-20 border-top w-100">
      {selectedAccounts.length > 0 ? (
        selectedAccounts.map(
          ({ name, email, uid, activationStatus, userImg, checked }, ind) =>
            checked && (
              <Row key={ind}>
                <AccountContainer>
                  <AccountWrapper>
                    <UserImg>
                      <img
                        src={userImg ? userImg : DefaultUser}
                        alt="user-pic"
                      />
                    </UserImg>
                    <AccountInfo>
                      {name && (
                        <>
                          <Name>{name}</Name>
                          <VerticalDivider></VerticalDivider>
                        </>
                      )}
                      <Name>{name}</Name>
                      <Email>{email}</Email>
                      {uid && (
                        <>
                          <UID>{uid}</UID>
                          <VerticalDivider></VerticalDivider>
                        </>
                      )}
                      <ActivationStatus status={activationStatus} />
                    </AccountInfo>
                  </AccountWrapper>
                  <span className="close-btn" onClick={() => handleRemove(uid)}>
                    <img src={CloseIcon} alt="Close" />
                  </span>
                </AccountContainer>
              </Row>
            )
        )
      ) : (
        <div className="text-center">
          {t("admin:account.management:selected.list:no.data")}
        </div>
      )}
      {selectedAccounts.length > 0 &&  selectedAccounts[0].checked && (
        <>
          <div className="d-flex justify-content-between custom-form-actions">
            <Button
              variant="outline-primary"
              disabled={assignShow ? false : true}
              onClick={() => {
                assignUid();
              }}
              className={assignShow ? "" : "disabled"}
            >
              Assign UID
            </Button>{" "}
            <Button
              variant="outline-primary"
              onClick={() => {
                activate();
              }}
              className={activateShow ? "" : "disabled"}
              disabled={activateShow ? false : true}
            >
              Activate
            </Button>{" "}
            <Button
              variant="outline-primary"
              onClick={() => {
                handleDelete();
              }}
              className={deleteShow ? "" : "disabled"}
              disabled={deleteShow ? false : true}
            >
              Delete
            </Button>
          </div>
          <DeleteAccountModal
            showModal={showDeleteModal}
            onSubmit={() => submitDelete(selectedAccounts)}
            accounts={
              selectedAccounts?.filter(
                (item) => item.activationStatus !== "DELETED"
              )?.length
            }
            closeModal={() => {
              closeDeleteModal();
            }}
          />
          <DeleteAccountFailedModal
            showModal={showDeleteFailedModal}
            closeModal={() => {
              closeDeleteFailedModal();
            }}
          />
          <DeleteWarningModal
            data={modalProps()}
            nextAction={nextAction}
            previousAction={previousAction}
            closeModal={() => setDeleteWarningModal(false)}
            okAction={() => okAction()}
            showModal={showDeleteWarningModal}
          />
          <SuccessModal
            title={showModal.title}
            message={showModal.msg}
            showModal={showModal.show}
            closeModal={() => {
              closeModal();
            }}
          />
        </>
      )}
    </Col>
  );
};

export default SelectedAccountsList;
