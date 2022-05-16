import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Figure from "react-bootstrap/Figure";
import DefaultUser from "./../../../assets/icons/default-user.svg";
import { NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Options,
  OptionsDropdown,
} from "./../../post-view/post-msg-view/styles/attachment-post-style";
import {
  fetchUserData,
  saveUserData,
  deleteUser,
} from "./../../../store/actions/admin-account-action";
import { emailRegex, phoneRegex } from "./../../../utilities/utils";
import SuccessModal from "../../modal/account/success-modal";
import DeleteAccountModal from "../../modal/account/delete-account-modal";
import DeleteWarningModal from "../../modal/account/delete-warning-modal";
import { RESET_ASSIGN_UUID_STATUS } from "../../../store/actionTypes/admin-account-action-types";

import { showToast } from "./../../../store/actions/toast-modal-actions";

const nameRegex =
  /^[\u0000-\u0019\u0021-\uffff]+((?: {0,1}[\u0000-\u0019\u0021-\uffff]+)+)*$/;
const USER_NAME_MAX_LENGTH = 64;

export default function UserInformation() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let { userStatusChangeSuccess, userStatusChangeType } = useSelector(
    (state) => state.AdminAccountReducer
  );
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const fetchedUserData = useSelector(
    (state) => state.AdminAccountReducer.fetchedUserData
  );
  const assignUuidSuccess = useSelector(
    (state) => state.AdminAccountReducer.assignUuidSuccess
  );

  const [submitted, setSubmitted] = useState(false);
  const [currentData, setCurrentData] = useState({
    ...fetchedUserData,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteWarningModal, setDeleteWarningModal] = useState(false);
  const [warningList, setWarningList] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    msg: "",
    title: "",
  });

  const openModal = (msg, title) => {
    setShowModal({ show: true, msg, title });
  };

  const closeModal = () => {
    setShowModal({ show: false, msg: "", title: "" });
  };

  useEffect(() => {
    if (userStatusChangeType === "ACTIVE") {
      if (userStatusChangeSuccess) {
        openModal(
          t("account:account.activateUser.success"),
          t("account:activateUser")
        );
      } else if (userStatusChangeSuccess === false) {
        dispatch(
          showToast(
            t("admin:account.management:user.information:error.message"),
            3000
          )
        );
      }
    }
  }, [userStatusChangeSuccess]);

  const enableActivate = useSelector(
    () =>
      currentData?.activationStatus === "INACTIVE" ||
      currentData?.activationStatus === "PENDING" ||
      currentData?.activationStatus === "ADMIN_BLOCKED" ||
      currentData?.activationStatus === "PASSWORD_LOCKED",
    shallowEqual
  );

  useEffect(() => {
    if (assignUuidSuccess)
      openModal(t("account:account.assignUid.success"), t("account:assignUid"));
    else if (assignUuidSuccess === false)
      dispatch(
        showToast(
          t("admin:account.management:user.information:error.message"),
          3000
        )
      );
    return () => dispatch({ type: RESET_ASSIGN_UUID_STATUS });
  }, [assignUuidSuccess]);

  useEffect(() => {
    if (
      currentData !== null &&
      fetchedUserData !== null &&
      fetchedUserData !== currentData
    ) {
      setCurrentData(fetchedUserData);
    }
  }, [fetchedUserData]);

  useEffect(() => {
    if (adminSelectedRow !== null) {
      dispatch(fetchUserData(adminSelectedRow.id));
    }
  }, [adminSelectedRow]);

  const getPossibleUserStatus = (currentStatus) => {
    switch (currentStatus) {
      case "INACTIVE":
        return ["ACTIVE", "ADMIN_BLOCKED", "DELETED"];
      case "PENDING":
        return ["ACTIVE", "ADMIN_BLOCKED", "DELETED"];
      case "ACTIVE":
        return ["ADMIN_BLOCKED", "DELETED"];
      case "ADMIN_BLOCKED":
        return ["ACTIVE", "DELETED"];
      case "PASSWORD_LOCKED":
        return ["ACTIVE", "ADMIN_BLOCKED", "DELETED"];
      case "DELETED":
      case "INIT":
        return ["INACTIVE"];
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setCurrentData((currentData) => ({
      ...currentData,
      [name]: value.replace(/\s\s+/g, " "),
    }));
  };

  const handleStatusUpdate = async (status) => {
    if (status === "DELETED") {
      if (adminSelectedRow?.ownedDiscussionCount > 0) {
        let list = [adminSelectedRow];
        setWarningList(list);
      } else {
        setShowDeleteModal(true);
      }
    } else {
      let deleteUserArray = [];
      deleteUserArray.push({
        userId: currentData.id,
        activationStatus: status,
      });
      const response = await dispatch(deleteUser(deleteUserArray));
      if (response?.payload?.data[0]?.errCode === "4033") {
        dispatch(
          showToast(
            t(
              "admin:account.management:user.information:error.action.not.allowed"
            ),
            3000
          )
        );
      } else if (response?.payload?.data[0]?.errCode === "2061") {
        dispatch(
          showToast(
            t(
              "admin:account.management:user.information:error.action.not.allowed"
            ),
            3000
          )
        );
      } else if (response?.payload?.data[0]?.errCode === "2062") {
        dispatch(
          showToast(
            t(
              "admin:account.management:user.information:error.invalid.state.transition"
            ),
            3000
          )
        );
      } else if (response?.payload?.data[0]?.errCode === "2063") {
        dispatch(
          showToast(
            t("admin:account.management:user.information:error.database"),
            3000
          )
        );
      } else if (response?.payload?.data[0]?.errCode === "2064") {
        dispatch(
          showToast(
            t(
              "admin:account.management:user.information:error.internal.processing"
            ),
            3000
          )
        );
      } else {
        let updatedData = {
          ...currentData,
          activationStatus: status,
        };
        setCurrentData(updatedData);
        dispatch(
          showToast(
            t("admin:account.management:user.information:status.changed"),
            3000,
            "success"
          )
        );
      }
    }
  };

  useEffect(() => {
    if (warningList && warningList.length > 0) {
      setDeleteWarningModal(true);
    }
  }, [warningList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const { id, screenName, phoneNumber, email } = currentData;

    let isNumberValidation = true;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      isNumberValidation = false;
    }
    if (
      email &&
      emailRegex.test(email) &&
      screenName.toString().trim() &&
      nameRegex.test(screenName.toString().trim()) &&
      isNumberValidation
    ) {
      const response = await dispatch(saveUserData(id, currentData));
      if (response.error) {
        dispatch(
          showToast(
            t("admin:account.management:user.information:error.message"),
            3000,
            "danger"
          )
        );
      } else {
        dispatch(
          showToast(
            t("admin:account.management:user.information:success.message"),
            3000,
            "success"
          )
        );
      }
    } else {
    }
  };

  const activate = async (e, status) => {
    e.preventDefault();
    if (currentData?.id) {
      dispatch(
        deleteUser(
          [
            {
              userId: currentData.id,
              activationStatus: status,
            },
          ],
          status,
          t("account:account.delete.success")
        )
      );
      // const response = await dispatch(
      //   activateUser({ users: [currentData.id] })
      // );
      // if (response.error) {
      // } else {
      // }
    }
  };

  function modalProps() {
    let data = "";
    data = {
      header: "delete.warning.modal:header",
      content1:
        adminSelectedRow?.ownedDiscussionCount === 1
          ? "delete.warning.modal:content.firstline.single"
          : "delete.warning.modal:content.firstline.multiple",
      total: warningList?.length,
      userData: adminSelectedRow,
      userIndex: 1,
      discussionList: adminSelectedRow?.discussionList?.map(({ name }) => name),
      ownerName:
        adminSelectedRow?.name === ""
          ? adminSelectedRow?.screenName
          : adminSelectedRow?.name,
      content2: "delete.warning.modal:content.secondline",
      primaryButtonText: "delete.warning.modal:ok.button",
      secondaryButtonText: "delete.warning.modal:next.button",
      thirdButtonText: "delete.warning.modal:previous.button",
    };
    return data;
  }
  const submitDelete = (list) => {
    if (list.length) {
      let reqSelectedList = list.map((value) => ({
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
  const okAction = () => {
    setDeleteWarningModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="w-100 pd-20 border-top">
      {currentData !== undefined &&
      currentData !== null &&
      Object.keys(currentData).length > 0 ? (
        <Form className="custom-sidebar-form">
          <Form.Group>
            <Figure className="d-flex justify-content-center m-0">
              <Figure.Image
                width={100}
                height={100}
                src={
                  currentData?.userImg !== ""
                    ? currentData?.userImg
                    : DefaultUser
                }
                style={{ borderRadius: "8px" }}
                className="m-0"
              />
            </Figure>
          </Form.Group>
          <Form.Group className="position-relative">
            {/* admin:account.management:user.information:name.label */}
            <Form.Label>
              {t("admin:account.management:user.information:name.label")}
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:name.placeholder")}
              type="text"
              name="firstName"
              maxLength={USER_NAME_MAX_LENGTH}
              value={currentData?.firstName}
              onChange={handleChange}
              onInput={handleChange}
            />
            {getPossibleUserStatus(currentData.activationStatus) &&
            getPossibleUserStatus(currentData.activationStatus).length > 0 ? (
              <Menu key={"user-status"} className="user-status">
                <Options id={`nav-dropdown`}>
                  <OptionsDropdown
                    id={`nav-dropdown`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    title={
                      <div
                        className={
                          currentData.activationStatus === "INIT"
                            ? "text-info"
                            : currentData.activationStatus === "ACTIVE"
                            ? "text-primary"
                            : currentData.activationStatus === "PENDING"
                            ? "text-warning"
                            : "text-danger"
                        }
                      >
                        <Badge
                          pill
                          className={
                            currentData.activationStatus === "INIT"
                              ? "badge-info"
                              : currentData.activationStatus === "ACTIVE"
                              ? "badge-primary"
                              : currentData.activationStatus === "PENDING"
                              ? "badge-warning"
                              : "badge-danger"
                          }
                        >
                          &nbsp;
                        </Badge>
                        {t(`activation.status:${currentData.activationStatus}`)}
                      </div>
                    }
                    // drop="auto"
                    alignRight
                    onMouseEnter={(e) => {
                      // setShowOverlay(false);
                    }}
                    onMouseLeave={() => {
                      // setShowOverlay(true);
                    }}
                  >
                    {currentData &&
                      currentData.activationStatus !== "" &&
                      currentData.activationStatus !== undefined &&
                      getPossibleUserStatus(currentData.activationStatus).map(
                        (el) => {
                          return (
                            <NavDropdown.Item
                              key={el}
                              style={{ lineHeight: "40px" }}
                              onClick={() => handleStatusUpdate(el)}
                            >
                              <span className="item-name">
                                {t(`activation.status:${el}`)}
                              </span>
                            </NavDropdown.Item>
                          );
                        }
                      )}
                  </OptionsDropdown>
                </Options>
              </Menu>
            ) : (
              <div
                className="user-status"
                style={{ height: "30px", lineHeight: "30px", right: "0" }}
              >
                <div className="nav-item">
                  <div
                    className={
                      currentData.activationStatus === "INIT"
                        ? "text-info"
                        : currentData.activationStatus === "ACTIVE"
                        ? "text-primary"
                        : currentData.activationStatus === "PENDING"
                        ? "text-warning"
                        : "text-danger"
                    }
                  >
                    <Badge
                      pill
                      className={
                        currentData.activationStatus === "INIT"
                          ? "badge-info"
                          : currentData.activationStatus === "ACTIVE"
                          ? "badge-primary"
                          : currentData.activationStatus === "PENDING"
                          ? "badge-warning"
                          : "badge-danger"
                      }
                    >
                      &nbsp;
                    </Badge>
                    {t(`activation.status:${currentData.activationStatus}`)}
                  </div>
                </div>
              </div>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:screen.label")}{" "}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:display.placeholder")}
              type="text"
              name="screenName"
              value={currentData.screenName}
              onChange={handleChange}
              onInput={handleChange}
              maxLength={USER_NAME_MAX_LENGTH}
              className={
                (submitted && !currentData.screenName.toString().trim()) ||
                (submitted &&
                  !nameRegex.test(currentData.screenName.toString().trim()))
                  ? " is-invalid"
                  : ""
              }
            />
            {submitted && !currentData.screenName.toString().trim() && (
              <Form.Control.Feedback type="invalid">
                {t("error:screen.name.required")}
              </Form.Control.Feedback>
            )}
            {submitted &&
              currentData.screenName &&
              !nameRegex.test(currentData.screenName.toString().trim()) && (
                <Form.Control.Feedback type="invalid">
                  {t("error:screen.name.invalid")}
                </Form.Control.Feedback>
              )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:affiliation.label")}
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:affiliation.placeholder")}
              type="text"
              name="affiliation"
              value={currentData.affiliation}
              onChange={handleChange}
              onInput={handleChange}
              maxLength={USER_NAME_MAX_LENGTH}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:job.label")}
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:job.placeholder")}
              type="text"
              name="jobTitle"
              value={currentData.jobTitle}
              onChange={handleChange}
              onInput={handleChange}
              maxLength={USER_NAME_MAX_LENGTH}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:email.label")}{" "}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:job.placeholder")}
              type="email"
              name="email"
              value={currentData.email}
              onChange={handleChange}
              onInput={handleChange}
              className={
                (submitted && !currentData.email.toString().trim()) ||
                (submitted &&
                  !emailRegex.test(currentData.email.toString().trim()))
                  ? " is-invalid"
                  : ""
              }
            />
            {submitted && !currentData.email.toString().trim() && (
              <Form.Control.Feedback type="invalid">
                {t("error:email.required")}
              </Form.Control.Feedback>
            )}
            {submitted &&
              currentData.email &&
              !emailRegex.test(currentData.email.toString().trim()) && (
                <Form.Control.Feedback type="invalid">
                  {t("error:email.invalid")}
                </Form.Control.Feedback>
              )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:phone.label")}
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:phone.placeholder")}
              type="text"
              name="phoneNumber"
              value={currentData.phoneNumber}
              onChange={handleChange}
              onInput={handleChange}
              className={
                "customInput" +
                (submitted &&
                currentData.phoneNumber.length > 0 &&
                !phoneRegex.test(currentData.phoneNumber)
                  ? " is-invalid"
                  : "")
              }
            />
            {submitted &&
              currentData.phoneNumber.length > 0 &&
              !phoneRegex.test(currentData.phoneNumber) && (
                <Form.Control.Feedback type="invalid">
                  {t("error:phone.pattern")}
                </Form.Control.Feedback>
              )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {t("admin:account.management:user.information:uid.label")}
            </Form.Label>
            <Form.Control
              // placeholder={t("setting.modal:profile:phone.placeholder")}
              disabled
              readOnly
              type="text"
              name="uid"
              value={currentData.uid}
            />
          </Form.Group>
          <div className="d-flex justify-content-between custom-form-actions">
            <Button
              variant="outline-primary"
              disabled={currentData.uid}
              className={currentData.uid ? "disabled" : ""}
              onClick={(e) => {
                if (!currentData.uid) {
                  // dispatch(assignUuidAdmin({ users: [currentData.id] }));
                  activate(e, "INACTIVE");
                }
              }}
            >
              {t("button:assign.uid")}
            </Button>
            <Button
              variant="outline-primary"
              disabled={!enableActivate}
              className={enableActivate ? "" : "disabled"}
              onClick={(e) => enableActivate && activate(e, "ACTIVE")}
            >
              {t("button:activate")}
            </Button>
            <Button
              variant="primary"
              disabled={currentData.activationStatus === "DELETED"}
              className={
                currentData.activationStatus === "DELETED" ? "disabled" : ""
              }
              onClick={
                currentData.activationStatus === "DELETED" ? null : handleSubmit
              }
            >
              {t("button:save")}
            </Button>
          </div>
        </Form>
      ) : (
        <div className="text-center">{t('loading')}</div>
      )}
      <SuccessModal
        title={showModal.title}
        message={showModal.msg}
        showModal={showModal.show}
        closeModal={() => {
          closeModal();
        }}
      />
      <DeleteAccountModal
        showModal={showDeleteModal}
        onSubmit={() => submitDelete([adminSelectedRow])}
        accounts={1}
        closeModal={() => setShowDeleteModal(false)}
      />
      <DeleteWarningModal
        data={modalProps()}
        nextAction={false}
        previousAction={false}
        closeModal={() => setDeleteWarningModal(false)}
        okAction={() => setDeleteWarningModal(false)}
        showModal={showDeleteWarningModal}
      />
    </div>
  );
}
