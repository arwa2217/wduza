import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Userprofileimage from "./userProfileImage";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import TimezoneSelect from "react-timezone-select";
import { useTranslation } from "react-i18next";
import { StyledModal, StyledModalButton } from "./userProfileModal.styles";
import Close from "../../assets/icons/close.svg";
import CloseWhite from "../../assets/icons/close-white.svg";
import DefaultUser from "../../assets/icons/default-user.svg";
import { phoneRegex } from "../../utilities/utils";
import { emailRegex } from "../../utilities/utils";
import { UpdateProfile, ResetPassword } from "../../store/actions/user-actions";
import UpdatePasswordModal from "../modal/update-password-modal/update-password-modal";
import UserType from "../../constants/user/user-type";
import {
  isNotificationEnabled,
  isNewPost,
  isMentionAndReaction,
  isTask,
  setNotificationFilter,
  isTag,
  isReply,
} from "../../utilities/notification-utils";
import {
  getContentLanguage,
  setContentLanguage,
} from "../../utilities/app-preference";
// import LanguageSelector from "../../components/language/language-selector";
import Select from "react-select";
function UserProfileModal(props) {
  //TODO need to check this regex as It hanging the UI
  // 1. remove the user USER_NAME_MAX_LENGTH limits from any input field
  // 2. add value on filed: "newuser_PCKUECTN_Verylong name_Verylong name_Verylong name_Verylong name_Verylong name_Verylong name" without double quote
  //3. submit and when API return error then go to the end of display name and try to back press...  UI
  const nameRegex =
    /^[\u0000-\u0019\u0021-\uffff]+((?: {0,1}[\u0000-\u0019\u0021-\uffff]+)+)*$/;
  const USER_NAME_MAX_LENGTH = 64;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer.user);
  const { userProfileUpdateSuccess, userProfileUpdateError } = useSelector(
    (state) => state.AuthReducer
  );
  const { t, i18n } = useTranslation();
  const options = [
    { label: "English", value: "en" },
    { label: "Korean", value: "ko" },
  ];
  const [selectedOption, setSelectedOption] = useState(
    options[
      options.findIndex((item) => item.value === getContentLanguage()) === -1
        ? 0
        : options.findIndex((item) => item.value === getContentLanguage())
    ]
  );
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ...user,
  });
  const { resetSuccess, resetFail, resetFailEmail } = useSelector(
    (state) => state.UserReducer
  );

  const [showModal, setShowModal] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(
    isNotificationEnabled(currentUser.notificationFilter)
  );
  const [allPostsFlag, setAllPostsFlag] = useState(
    isNewPost(currentUser.notificationFilter)
  );
  const [mentionReactionFlag, setMentionReactionFlag] = useState(
    isMentionAndReaction(currentUser.notificationFilter)
  );
  const [emailDeliveryFlag, setEmailDeliveryFlag] = useState(
    currentUser.notifyByEmail
  );
  const [taskFlag, setTaskFlag] = useState(
    isTask(currentUser.notificationFilter)
  );
  const [tagFlag, setTagFlag] = useState(isTag(currentUser.notificationFilter));
  const [replyFlag, setReplyFlag] = useState(
    isReply(currentUser.notificationFilter)
  );

  useEffect(() => {
    if (currentUser !== null && user !== null && user !== currentUser) {
      setCurrentUser({
        ...user,
      });
      setNotificationEnabled(isNotificationEnabled(user.notificationFilter));
      setAllPostsFlag(isNewPost(user.notificationFilter));
      setMentionReactionFlag(isMentionAndReaction(user.notificationFilter));
      setTaskFlag(isTask(user.notificationFilter));
      setTagFlag(isTag(user.notificationFilter));
      setReplyFlag(isReply(user.notificationFilter));
    }
  }, [user]);
  useEffect(() => {
    setCurrentUser({
      ...currentUser,
      notifyByEmail: emailDeliveryFlag,
      notificationFilter: setNotificationFilter(
        notificationEnabled,
        allPostsFlag,
        mentionReactionFlag,
        taskFlag,
        tagFlag,
        replyFlag
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    notificationEnabled,
    allPostsFlag,
    mentionReactionFlag,
    taskFlag,
    emailDeliveryFlag,
    tagFlag,
    replyFlag,
  ]);
  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    type === "file"
      ? fileToDataUri(e.target.files[0]).then((dataUri) => {
          document.querySelector(".loader").classList.add("spin");
          setCurrentUser((currentUser) => ({
            ...currentUser,
            [name]: dataUri,
          }));
          document.querySelector(".loader").classList.remove("spin");
        })
      : setCurrentUser((currentUser) => ({
          ...currentUser,
          [name]: value.replace(/\s\s+/g, " "),
        }));
  };
  function modalProps() {
    let data = "";
    if (resetSuccess) {
      data = {
        showHeader: true,
        header: "reset.password:success.header",
        content1: "reset.password:success.content1",
        user: user,
        isContent2: true,
        content2: "reset.password:success.content2",
        isContent3: false,
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:success.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:success.secondary.button",
      };
    }
    if (resetFail) {
      data = {
        showHeader: false,
        content1: "reset.password:failure.content1",
        isContent2: true,
        content2: "reset.password:failure.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:failure.secondary.button",
      };
    }
    if (resetFailEmail) {
      data = {
        showHeader: true,
        header: "reset.password:failure.email.header",
        content1: "reset.password:failure.email.content1",
        isContent2: true,
        content2: "reset.password:failure.email.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:failure.secondary.button",
      };
    }

    return data;
  }

  function handleModalClose() {
    setShowModal(false);
  }
  const handleSubmitUpdatePassword = (e) => {
    setShowModal(true);
    props.handleClose(false);
    setSubmitted(true);
    if (user.email && emailRegex.test(user.email)) {
      dispatch(ResetPassword(user));
    }
  };
  const handleProfileChange = (e) => {
    setCurrentUser((currentUser) => ({ ...currentUser, userImg: e }));
  };
  const handleTimeZoneChange = (timezone) => {
    setCurrentUser((currentUser) => ({
      ...currentUser,
      timezone: JSON.stringify(timezone),
    }));
  };
  const handleRemoveImage = (e) => {
    setCurrentUser((currentUser) => ({
      ...currentUser,
      userImg: DefaultUser,
    }));
  };
  const handleLanguageChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const { screenName, phoneNumber } = currentUser;
    let isNumberValidation = true;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      isNumberValidation = false;
    }
    if (screenName.toString().trim() && isNumberValidation) {
      if (nameRegex.test(screenName.toString().trim())) {
        currentUser.screenName = screenName.toString().trim();
        const response = await dispatch(UpdateProfile(currentUser));
        if (response.error) {
        } else {
          i18n.changeLanguage(selectedOption ? selectedOption.value : "en");
          setContentLanguage(selectedOption ? selectedOption.value : "en");
          setTimeout(() => {
            props.handleClose(false);
            setSubmitted(false);
          }, 500);
        }
      } else {
      }
    } else {
    }
  };

  const handleCancel = () => {
    setCurrentUser({
      ...user,
    });
    props.handleClose(false);
  };
  return (
    <>
      <StyledModal show={props.show} onHide={props.hide} centered>
        {submitted && userProfileUpdateError && (
          <div className="custom-alert-modal">
            <Alert variant="danger">Something went wrong</Alert>
          </div>
        )}
        {submitted && userProfileUpdateSuccess && (
          <>
            <div className="custom-alert-modal">
              <Alert variant="success">{t("setting.modal:alerts:2001")}</Alert>
            </div>{" "}
          </>
        )}
        <Modal.Header>
          {t("setting.modal:header")}
          <button
            type="button"
            className="close"
            onClick={(e) => handleCancel()}
          >
            <span aria-hidden="true">
              <img src={Close} alt="close btn" />
            </span>
            <span className="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-settings">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <div className="form-header mb-4">
                    <h3 className="form-title">
                      {t("setting.modal:profile:header")}
                    </h3>
                  </div>
                  <div className="profile-img-wrapper">
                    <Userprofileimage
                      src={
                        currentUser && currentUser.userImg
                          ? currentUser.userImg
                          : DefaultUser
                      }
                      currentUser={currentUser}
                      handleChange={
                        currentUser.userType === UserType.GUEST
                          ? null
                          : handleProfileChange
                      }
                      handleRemoveImage={
                        currentUser.userType === UserType.GUEST
                          ? null
                          : handleRemoveImage
                      }
                    />
                    {currentUser &&
                      currentUser.userImg &&
                      currentUser.userImg !== DefaultUser.toString() && (
                        <figure className="profile-img position-absolute m-0 mx-auto">
                          <figcaption>
                            <img
                              src={CloseWhite}
                              alt="remove"
                              onClick={
                                // currentUser.userType === UserType.GUEST
                                //   ? null
                                // :
                                handleRemoveImage
                              }
                            />
                          </figcaption>
                        </figure>
                      )}
                  </div>
                  <div className="profile-form-wrapper">
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:name.label")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "setting.modal:profile:name.placeholder"
                        )}
                        type="text"
                        name="firstName"
                        maxLength={USER_NAME_MAX_LENGTH}
                        value={currentUser.firstName}
                        onChange={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        onInput={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:display.label")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "setting.modal:profile:display.placeholder"
                        )}
                        type="text"
                        name="screenName"
                        value={currentUser.screenName}
                        onChange={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        onInput={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        maxLength={USER_NAME_MAX_LENGTH}
                        className={
                          "form-control" +
                          ((submitted &&
                            !currentUser.screenName.toString().trim()) ||
                          (submitted &&
                            !nameRegex.test(
                              currentUser.screenName.toString().trim()
                            ))
                            ? " is-invalid"
                            : "")
                        }
                      />
                      {submitted &&
                        !currentUser.screenName.toString().trim() && (
                          <Form.Control.Feedback type="invalid">
                            {t("error:screen.name.required")}
                          </Form.Control.Feedback>
                        )}
                      {submitted &&
                        currentUser.screenName &&
                        !nameRegex.test(
                          currentUser.screenName.toString().trim()
                        ) && (
                          <Form.Control.Feedback type="invalid">
                            {t("error:screen.name.invalid")}
                          </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:job.label")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t("setting.modal:profile:job.placeholder")}
                        type="text"
                        name="jobTitle"
                        value={currentUser.jobTitle}
                        onChange={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        onInput={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        maxLength={USER_NAME_MAX_LENGTH}
                        className="customInput"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:affiliation.label")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "setting.modal:profile:affiliation.placeholder"
                        )}
                        type="text"
                        name="affiliation"
                        value={currentUser.affiliation}
                        onChange={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        onInput={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        maxLength={USER_NAME_MAX_LENGTH}
                        className="customInput"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:phone.label")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "setting.modal:profile:phone.placeholder"
                        )}
                        type="text"
                        name="phoneNumber"
                        value={currentUser.phoneNumber}
                        onChange={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        onInput={
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleChange
                        }
                        className={
                          "customInput" +
                          (submitted &&
                          currentUser.phoneNumber.length > 0 &&
                          !phoneRegex.test(currentUser.phoneNumber)
                            ? " is-invalid"
                            : "")
                        }
                      />
                      {submitted &&
                        currentUser.phoneNumber.length > 0 &&
                        !phoneRegex.test(currentUser.phoneNumber) && (
                          <Form.Control.Feedback type="invalid">
                            {t("error:phone.pattern")}
                          </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:timezone.label")}
                      </Form.Label>
                      <TimezoneSelect
                        name="timezone"
                        className="custom-timezone"
                        value={
                          (currentUser.timezone &&
                            currentUser.timezone !== "" &&
                            JSON.parse(currentUser.timezone)) || {
                            value: "Asia/Seoul",
                            label: "(GMT+9:00) Seoul",
                            altName: "Asia/Seoul",
                            abbrev: "Asia/Seoul",
                          }
                        }
                        onChange={(timezone) =>
                          currentUser.userType === UserType.GUEST
                            ? null
                            : handleTimeZoneChange(timezone)
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {t("setting.modal:profile:language")}
                      </Form.Label>

                      <Select
                        value={selectedOption}
                        onChange={handleLanguageChange}
                        options={options}
                        className="selector"
                      />

                      {/* <LanguageSelector/> */}
                    </Form.Group>
                    <h5 className="form-subtitle">
                      {t(
                        "user.profile:user.profile.modal:member.identification"
                      )}
                    </h5>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:email.label")}
                      </Form.Label>
                      <p>{currentUser.email}</p>
                    </Form.Group>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:changePassword.label")}
                      </Form.Label>
                      <p
                        style={{
                          color: "#18B263",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "14px",
                        }}
                        onClick={(e) => handleSubmitUpdatePassword(e)}
                      >
                        {t("setting.modal:profile:resetPassword.link")}
                      </p>
                    </Form.Group>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:uid.label")}
                      </Form.Label>
                      <p>{currentUser.uid}</p>
                    </Form.Group>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:company.label")}
                      </Form.Label>
                      <p>{currentUser.companyName}</p>
                    </Form.Group>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:cid.label")}
                      </Form.Label>
                      <p>{currentUser.cid}</p>
                    </Form.Group>
                    <Form.Group className="member-group">
                      <Form.Label>
                        {t("setting.modal:profile:version.label")}
                      </Form.Label>
                      <p>{t("setting.modal:profile:version.value")}</p>
                    </Form.Group>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <hr />
              </Col>
              <Col xs={12}>
                <div className="form-wrapper notification-setting">
                  <div className="notification-form-header">
                    <div
                      className={`form-title ${
                        notificationEnabled ? "" : "disabled"
                      }`}
                    >
                      <h3> {t("setting.modal:notifications:header")}</h3>
                    </div>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      checked={notificationEnabled}
                      onChange={() => {
                        currentUser.userType !== UserType.GUEST &&
                          setNotificationEnabled(!notificationEnabled);
                      }}
                    />
                  </div>

                  <Form.Group>
                    <h5
                      className={`notification-form-subtitle ${
                        notificationEnabled ? "" : "disabled"
                      }`}
                    >
                      {t("setting.modal:notifications:activity.title")}
                    </h5>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-activity"
                        disabled={!notificationEnabled}
                        checked={allPostsFlag}
                        onChange={() => {
                          setAllPostsFlag(!allPostsFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-activity"
                      >
                        {t("setting.modal:notifications:activity.all.label")}
                      </label>
                    </div>

                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-mentions"
                        disabled={!notificationEnabled}
                        checked={mentionReactionFlag}
                        onChange={() => {
                          setMentionReactionFlag(!mentionReactionFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-mentions"
                      >
                        {t("setting.modal:notifications:activity.reply.label")}
                      </label>
                    </div>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-reply"
                        disabled={!notificationEnabled}
                        checked={replyFlag}
                        onChange={() => {
                          setReplyFlag(!replyFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-reply"
                      >
                        {t(
                          "setting.modal:notifications:activity.replies.label"
                        )}
                      </label>
                    </div>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-tag"
                        disabled={!notificationEnabled}
                        checked={tagFlag}
                        onChange={() => {
                          setTagFlag(!tagFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-tag"
                      >
                        {t("setting.modal:notifications:activity.tag.label")}
                      </label>
                    </div>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-tasks"
                        disabled={!notificationEnabled}
                        checked={taskFlag}
                        onChange={() => {
                          setTaskFlag(!taskFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-tasks"
                      >
                        {t("setting.modal:notifications:activity.task.label")}
                      </label>
                    </div>
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <h5
                      className={`delivery-form-subtitle ${
                        notificationEnabled ? "" : "disabled"
                      }`}
                    >
                      {t("setting.modal:notifications:delivery.title")}
                    </h5>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        id="default-delivery"
                        disabled={!notificationEnabled}
                        checked={emailDeliveryFlag}
                        onChange={() => {
                          setEmailDeliveryFlag(!emailDeliveryFlag);
                        }}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="default-delivery"
                      >
                        {t("setting.modal:notifications:delivery.email.label")}
                      </label>
                    </div>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <StyledModalButton
            onClick={handleCancel}
            style={{ margin: 0, background: "#999999" }}
            className="btn btn-secondary"
          >
            {t("setting.modal:cancel")}
          </StyledModalButton>
          <StyledModalButton
            type="submit"
            style={{ marginTop: "10px " }}
            onClick={
              currentUser.userType === UserType.GUEST ? null : handleSubmit
            }
            className="btn btn-primary"
          >
            {t("setting.modal:save")}
          </StyledModalButton>
        </Modal.Footer>
      </StyledModal>
      <UpdatePasswordModal
        data={modalProps()}
        currentUser={currentUser}
        closeModal={handleModalClose}
        showModal={showModal}
      />
    </>
  );
}

export default UserProfileModal;
