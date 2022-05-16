import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createFolderAction,
  resetCreateFolderAction,
} from "../../../store/actions/folderAction";
import { ESignatureShareStyledModal } from "./share-esignature-modal.styles";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Close from "../../../assets/icons/close.svg";
import Dropzone from "./e-signature-modal-dropzone";
import { FormControl, InputGroup, ListGroup, Row } from "react-bootstrap";
import closeImage from "../../../assets/icons/v2/ic_input_close.svg";
import logo from "../../../assets/icons/v2/logo.svg";
import pdfIcon from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FilesBreak } from "../../files-forward/styles/break";
import Suggestions from "../channel/Suggestions";
import ScriptWindowShare from "../../script-window/script-window-share";
import CommonUtils from "../../utils/common-utils";
import { getLastSelectedChannelId } from "../../../utilities/app-preference";
import ArrowUp from "../../../assets/icons/attach-arrow-up.svg";
import ArrowDown from "../../../assets/icons/attach-arrow-down.svg";
import "./style.css";
import { fetchUserTypeAction } from "../../../store/actions/channelActions";
import { debounce } from "lodash";
import ChannelConstants from "../../../constants/channel/channel-constants";
import { Button } from "../../shared/styles/mainframe.style";
import moment from "moment";
import UserType from "../../../constants/user/user-type";
import { getFileSize } from "../../utils/file-utility";
import CancelIcon from "../../../assets/icons/v2/ic_cancel.svg";
import ExternalDiscussionImg from "../../../assets/icons/v2/external.svg";
import GuestDiscussionImg from "../../../assets/icons/v2/ic_badge_guest.svg";
import { guestFilesSharing } from "../../../store/actions/main-files-actions";

const allOptions = [
  { label: "7 days", value: 10080 },
  {
    label: "30 days",
    value: 43200,
  },
  {
    label: "60 days",
    value: 86400,
  },
  {
    label: "90 days",
    value: 129600,
  },
  {
    label: "1 year",
    value: 525600,
  },
  // {
  //   label: "Set dates",
  //   value: "CUSTOM",
  // },
];
const uploadSelectStyles = {
  control: () => ({
    border: "none",
    borderRadius: "0px",
    width: "100%",
    display: "flex",
    marginTop: "28px",
  }),
  valueContainer: () => ({
    height: "15px",
    direction: "ltr",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  singleValue: () => ({
    overflow: "visible",
    position: "unset",
    textOverflow: "unset",
    whiteSpace: "unset",
    color: "#308F65",
    textDecorationLine: "underline",
    textDecorationOffset: "2px",
    fontSize: "14px",
    cursor: "pointer",
  }),
  indicatorContainer: () => ({
    padding: "0px",
    color: "#308F65 !important",
  }),
  dropdownIndicator: () => ({
    color: "#308F65 !important",
    marginRight: "5px",
  }),
  menuList: () => ({
    paddingTop: 0,
    direction: "ltr",
  }),
  menu: () => ({
    width: "187px",
    zIndex: "10 !important",
    position: "absolute",
    background: "white",
    boxShadow: "0px 0px 4px rgba(76, 99, 128, 0.3)",
    color: "#19191A",
  }),
  option: (provided, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...provided,
      backgroundColor: isFocused ? "transparent" : null,
      color: "#19191A",
      height: "50px",
      padding: "18px 0 18px 20px",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: "#F8F8F8",
        color: "#308F65",
        padding: "18px 0 18px 20px",
        fontSize: "14px",
        cursor: "pointer",
      },
    };
  },
};

const hasDecision = true;
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "post__tags__background__hover";
const textColorNormal = "post__tags__color";
const textColorHovered = "post__tags__color__hover";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";

function ShareESignatureModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const scriptWindowSendButton = useRef(null);
  let calenderRef = useRef(null);
  const emptyEmail = t("addPeople.modal:email.required");
  const fileConfig = useSelector((state) => state.config.fileConfig);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const currentNetworkType = useSelector(
    (state) => state.AuthReducer.networkType
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );
  const userTypeData = useSelector((state) => state.ChannelReducer.getUserType);
  const addMemberApiError = useSelector(
    (state) => state.ChannelMemberReducer.addMemberApiError
  );
  const addMemberDuplicateEmailError = useSelector(
    (state) => state.ChannelMemberReducer.user
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);

  const userType = userTypeData ? userTypeData.member_type : "";

  let filesCopy = useRef([...props.selectedFiles]);
  const [filesShow, setFilesShow] = useState(filesCopy.current);
  const [memberCID, setMemberCID] = useState(
    userTypeData &&
      userTypeData.member_type === "EXTERNAL" &&
      userTypeData.Ent.length === 1
      ? userTypeData.Ent[0].cid
      : ""
  );
  const [show, setShow] = useState(true);
  const [fileData, setFileData] = useState({ fileName: "", size: "" });
  const [uploadModalBody, setUploadModalBody] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [expirationDate, setExpirationDate] = useState(10080);
  const [expirationDateText, setExpirationDateText] = useState("");
  const [expirationDateSelect, setExpirationDateSelect] = useState({
    label: "7 days",
    value: 10080,
  });
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
  });
  const { email } = inputs;
  const [isValidEmail, setValidEmail] = useState(true);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [emailError, setEmailError] = useState(emptyEmail);

  const titleKey = "Share";
  const modalTitle = t(titleKey);

  let content = useRef("");
  function setContent(data) {
    content.current = data;
  }

  useEffect(() => {
    if (props.selectedFiles?.length) setFileData(props.selectedFiles[0]);
  }, [props.selectedFiles]);

  useEffect(() => {
    if (props?.shareData?.invitee) {
      setExpirationDateSelect(props.expirationDateSelect);
      setTimeout(() => {
        setShowDate(false);
      }, 100);
      setMemberList(props?.shareData?.invitee);
      setPasscode(props?.shareData?.passcode);
      setPasscodeEnabled(props?.shareData?.passcodeReqd);
      setContent(props?.shareData?.content);
      if (props?.expirationDateSelect?.value === "CUSTOM") {
        var newDateObj = new Date(
          new Date().getTime() + props?.shareData?.fileExpiry * 60000
        );
        const diffDays = Math.round(
          Math.abs((newDateObj - new Date()) / (24 * 60 * 60 * 1000))
        );
        newDateObj = new Date(
          new Date().setDate(new Date().getDate() + diffDays)
        );
        const expireDate = moment(newDateObj).format("MMM D, YYYY");
        setExpirationDate(diffDays * 1440); // 1440 is minutes per day
        setExpirationDateText(expireDate);
      } else {
        setExpirationDate(props?.shareData?.fileExpiry);
      }
    }
  }, [props.shareData]);

  useEffect(() => {
    if (expirationDateSelect && expirationDateSelect.value) {
      if (expirationDateSelect.value !== "CUSTOM") {
        var newDateObj = new Date(
          new Date().getTime() + expirationDateSelect.value * 60000
        );
        let dateString = moment(newDateObj).format("MMM D, YYYY");
        setExpirationDate(expirationDateSelect.value);
        setExpirationDateText(dateString);
      } else {
        setShowDate(true);
      }
    }
  }, [expirationDateSelect]);

  const handleClose = () => {
    props.onModalHide();
    dispatch(resetCreateFolderAction());
  };

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={props.selectProps.menuIsOpen ? ArrowUp : ArrowDown}
            alt=""
          />
        </components.DropdownIndicator>
      )
    );
  };

  const handleUserType = debounce(function (value) {
    dispatch(fetchUserTypeAction(value));
  }, 500);

  const removeEmailFromList = (memberEmail, cid) => {
    let memberListArr = [...memberList];
    const indexToRemove = memberListArr.findIndex(
      (item) => item.memberEmail === memberEmail && item.cid === cid
    );
    const filteredMember = memberListArr.filter(
      (item, index) => index !== indexToRemove
    );
    setMemberList(filteredMember);
  };

  const handleEmail = (value) => {
    setInputs((inputs) => ({ ...inputs, email: value.replace(/\s/g, "") }));
    if (CommonUtils.isValidEmail(value)) {
      setValidEmail(true);
      handleUserType(value);
      setHasValidEmail(true);
      setFetchingUser(true);
      setFetchedUserType(false);
      setTimeout(() => {
        setFetchingUser(false);
        setFetchedUserType(true);
      }, 1500);
    } else {
      setValidEmail(false);
      setHasValidEmail(false);
      setFetchingUser(false);
      setFetchedUserType(false);
    }
  };

  const addEmailToList = () => {
    const isAlreadyExists =
      memberList &&
      memberList.length > 0 &&
      memberList.some((el) => {
        return el.memberEmail === email && el.cid === memberCID;
      });

    if (email && CommonUtils.isValidEmail(email) && isAlreadyExists === false) {
      setMemberList([
        ...memberList,
        { memberEmail: email, memberType: userType, cid: memberCID },
      ]);
      setInputs((inputs) => ({ ...inputs, email: "" }));
    } else {
      setInputs((inputs) => ({ ...inputs, email: "" }));
    }
  };

  function getForwardableFiles(filesShow) {
    return filesShow.filter(
      (el) =>
        !(
          el.fileForwardDisabled ||
          (el.creatorId !== currentUser?.id &&
            ((el.queryUserType === "INTERNAL" &&
              ((currentNetworkType === "INTERNAL" &&
                el?.internalPermission !== "DL") ||
                (currentNetworkType === "EXTERNAL" &&
                  el?.internalPermissionOoo !== "DL"))) ||
              (el.queryUserType === "EXTERNAL" &&
                el?.externalPermission !== "DL")))
        )
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
    if (memberList?.length > 0) {
      scriptWindowSendButton.current.click();
      let postObj = {
        fileListIds: getForwardableFiles(filesShow).map(({ fileId }) => fileId),
        fileExpiry: expirationDate,
        passcodeReqd: passcodeEnabled && passcode.length > 0,
        passcode: passcode,
        invitee: memberList,
        content: content.current,
      };
      setExpirationDateSelect(expirationDateSelect);
      postObj.invitee = memberList?.map((i) => i.memberEmail);
      dispatch(guestFilesSharing(postObj));
      // props.setExpirationDateSelect(expirationDateSelect);
      // props.setShareData(postObj);
      handleClose();
    }
  };
  const saveExpirationTime = (value) => {
    if (value !== "CUSTOM") {
      setExpirationDate(value);
    } else {
      setShowDate(true);
    }
  };
  const handleStartDate = (date) => {
    if (date === null) {
      setStartTime(null);
    } else {
      setStartTime(date);
      const diffDays = Math.round(
        Math.abs((date - new Date()) / (24 * 60 * 60 * 1000))
      ); // hours*minutes*seconds*milliseconds
      var newDateObj = new Date(
        new Date().setDate(new Date().getDate() + (diffDays + 1))
      );
      let dateString = moment(newDateObj).format("MMM D, YYYY");
      setExpirationDate((diffDays + 1) * 1440); // 1440 is minutes per day
      setExpirationDateText(dateString);
    }
    setShowDate(false);
  };

  return (
    <>
      <ESignatureShareStyledModal show={show} onHide={handleClose} centered>
        <ModalHeader>
          <span> {modalTitle}</span>
          {/* <button
            type="button"
            className="close"
            onClick={() => {
              props.onModalHide();
            }}
          >
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">
              {t("files:create.folder.modal:close")}
            </span>
          </button> */}
        </ModalHeader>
        <div className="m-pad">
          <div className="share-files-modal-form">
            <Form.Group>
              {/* <Form.Label>
                {t("share.modal:add.member.label")}{" "}
                <span className="text-danger">*</span>
              </Form.Label> */}
              <InputGroup className="char-counter-wrapper">
                <Suggestions
                  showUserAffiliation={true}
                  handleChange={handleEmail}
                  onlyGuest={true}
                  className={
                    "member-add-input form-control" +
                    (submitted &&
                    ((email && !isValidEmail) ||
                      addMemberApiError ||
                      (addMemberDuplicateEmailError &&
                        addMemberDuplicateEmailError.code === "2006" &&
                        memberList.length <= 0) ||
                      createChannelApiError)
                      ? " member-add-input-invalid is-invalid"
                      : " member-add-input-active")
                  }
                  type="email"
                  name="email"
                  placeholder={t("share.modal:add.member.placeholder")}
                  value={email}
                />
                {hasValidEmail && fetchingUserType && (
                  <InputGroup.Prepend>
                    <span className="spinner-border spinner-border-sm"></span>
                  </InputGroup.Prepend>
                )}

                {email && hasValidEmail && !fetchingUserType && (
                  <InputGroup.Prepend
                    style={{ cursor: "pointer" }}
                    className="email-add"
                  >
                    <span onClick={addEmailToList}>
                      {t("create.channel.modal:add")}
                    </span>
                  </InputGroup.Prepend>
                )}
              </InputGroup>

              {submitted &&
                addMemberDuplicateEmailError &&
                addMemberDuplicateEmailError.code === "2006" && (
                  <div className="text-muted form-text w-100">
                    {t(
                      "addPeople.modal:addMemberApiError:" +
                        addMemberDuplicateEmailError.code
                    )}
                  </div>
                )}
              {submitted && memberList.length <= 0 && (
                <div className="invalid-feedback">{emailError}</div>
              )}
              {/* {submitted && (!email || !isValidEmail) &&  (
                    <div className="invalid-feedback">{emailError}</div>
                  )} */}
              {submitted && email && addMemberApiError && (
                <div className="invalid-feedback">
                  {t(
                    "addPeople.modal:addMemberApiError:" +
                      addMemberApiError.code
                  )}
                </div>
              )}

              {submitted && email && createChannelApiError && (
                <div className="invalid-feedback">
                  {t(
                    "addPeople.modal:createChannelApiError:" +
                      createChannelApiError.code
                  )}
                </div>
              )}
              {!fetchingUserType &&
              fetchedUserType &&
              !createChannelApiError &&
              userType === ChannelConstants.INTERNAL ? (
                <div className="text-muted form-text w-100">
                  {email && email + t("discussion:invited.user.type.INTERNAL")}
                </div>
              ) : !fetchingUserType &&
                fetchedUserType &&
                !createChannelApiError &&
                userType === ChannelConstants.GUEST ? (
                <div className="text-muted form-text w-100">
                  {email && email + t("discussion:invited.user.type.GUEST")}
                </div>
              ) : !fetchingUserType &&
                fetchedUserType &&
                !createChannelApiError &&
                userType === ChannelConstants.EXTERNAL ? (
                <div className="text-muted form-text w-100">
                  {email && email + t("discussion:invited.user.type.EXTERNAL")}
                </div>
              ) : (
                ""
              )}
            </Form.Group>

            {memberList?.length ? (
              <div className="member-list">
                {memberList.map((item, index) => (
                  <div
                    className="member-item d-flex align-items-center"
                    key={index}
                  >
                    <span>{item.memberEmail}</span>
                    {item.memberType === ChannelConstants.EXTERNAL ? (
                      <img
                        className="ml-1"
                        src={ExternalDiscussionImg}
                        alt="external-discussion-icon"
                      />
                    ) : item.memberType === ChannelConstants.GUEST ? (
                      <img
                        className="ml-1"
                        src={GuestDiscussionImg}
                        alt="guest-discussion-icon"
                      />
                    ) : (
                      <></>
                    )}
                    <img
                      src={CancelIcon}
                      style={{ cursor: "pointer", marginLeft: "4px" }}
                      alt="cancel-icon"
                      onClick={() =>
                        removeEmailFromList(item.memberEmail, item.cid)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            <Form.Group className={`files-forward-add-notes `}>
              {/* <Form.Label>{t("share.modal:add.notes")}</Form.Label> */}
              <ScriptWindowShare
                title={t("share.modal:enter.notes")}
                channel={activeSelectedChannel}
                fileListIDs={() => {
                  let fileListsIDs = [];
                  filesShow.map((file) => {
                    if (!file.fileForwardDisabled) {
                      fileListsIDs.push(file.fileId);
                    }
                    return file;
                  });
                  return fileListsIDs;
                }}
                channelMembers={CommonUtils.getFilteredMembers(
                  globalMembers,
                  getLastSelectedChannelId()
                )}
                content={content.current}
                setContent={setContent}
                isShareFilesModal={true}
                fwdFilePost={props}
                refscriptWindowSendButton={scriptWindowSendButton}
                onTaskSendClick={handleSubmit}
              />
            </Form.Group>
            <div className="form-control-field">
              <div className="sign-name-image">
                <img
                  style={{ padding: "5px 5px 5px 0" }}
                  src={pdfIcon}
                  alt="pdf"
                />
                <input
                  className="sign-name"
                  type="text"
                  value={fileData?.fileName}
                  readOnly
                />
              </div>
              <span className="file-size">{getFileSize(fileData?.size)}</span>
              {/* <img src={closeImage} alt="close" /> */}
            </div>
            {/* <Row className="m-0 justify-content-between align-items-end">
              <span className="title">{t("share.modal:expiration.date")}</span>
              <div className="expiration">
                <span className="expiration-date">{expirationDateText}</span>
                <Select
                  isRtl
                  components={{ DropdownIndicator }}
                  name="expirationDate"
                  value={expirationDateSelect}
                  onChange={(e) => {
                    setExpirationDate(e.value);
                    setExpirationDateSelect(e);
                    saveExpirationTime(e.value);
                  }}
                  options={allOptions}
                  className="upload-select"
                  styles={uploadSelectStyles}
                />
              </div>
            </Row> */}
            {/* <Form.Group
              ref={calenderRef}
              className={`${showDate ? "" : "d-none"}`}
            > */}
            {/* <div ref={calenderRef} className={`${showDate ? "" : "d-none"}`}> */}
            {/* <DatePicker
                onFocus={(e) => e.target.blur()}
                selected={startTime}
                onChange={(date) =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : handleStartDate(date)
                }
                onSelect={(date) => {
                  return startTime &&
                    date &&
                    date.getTime() === startTime.getTime()
                    ? setShowDate(false)
                    : null;
                }}
                open={showDate}
                selectsStart
                startDate={startTime}
                endDate={stopTime}
                dateFormat="MMM dd, yyyy h:mm aa"
                minDate={new Date()}
                isClearable={!startTime ? false : true}
              /> */}
            {/* </div> */}
            {/* </Form.Group> */}
            {/* <FilesBreak></FilesBreak> */}
            <div className="d-flex">
              <div className="w-50 expiration-date">
                <label>Expiration</label>
                {/* moment(fileData?.expiry).format("MMM D, YYYY") */}
                <div className="date">
                  {moment(expirationDateText).format("MMM D, YYYY")}
                </div>
                <Row className="m-0 justify-content-between align-items-end">
                  {/* <span className="title">
                    {t("share.modal:expiration.date")}
                  </span> */}
                  <div className="expiration">
                    {/* <span className="expiration-date">
                      {expirationDateText}
                    </span> */}
                    <Select
                      isRtl
                      components={{ DropdownIndicator }}
                      name="expirationDate"
                      value={expirationDateSelect}
                      onChange={(e) => {
                        setExpirationDate(e.value);
                        setExpirationDateSelect(e);
                        saveExpirationTime(e.value);
                      }}
                      options={allOptions}
                      className="upload-select"
                      styles={uploadSelectStyles}
                    />
                  </div>
                </Row>
                <Form.Group
                  ref={calenderRef}
                  className={`${showDate ? "" : "d-none"}`}
                >
                  <div
                    ref={calenderRef}
                    className={`${showDate ? "" : "d-none"}`}
                  >
                    <DatePicker
                      onFocus={(e) => e.target.blur()}
                      selected={startTime}
                      onChange={(date) =>
                        currentUser.userType === UserType.GUEST
                          ? null
                          : handleStartDate(date)
                      }
                      onSelect={(date) => {
                        return startTime &&
                          date &&
                          date.getTime() === startTime.getTime()
                          ? setShowDate(false)
                          : null;
                      }}
                      open={showDate}
                      selectsStart
                      startDate={startTime}
                      endDate={stopTime}
                      dateFormat="MMM dd, yyyy h:mm aa"
                      minDate={new Date()}
                      isClearable={!startTime ? false : true}
                    />
                  </div>
                </Form.Group>
              </div>
              <span className="divider"></span>
              <div className="w-50 passcode-wrapper">
                <div className="m-0 d-flex justify-content-between">
                  <label>{t("share.modal:passcode")}</label>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label=""
                    checked={passcodeEnabled}
                    onChange={() => {
                      setPasscodeEnabled(!passcodeEnabled);
                    }}
                  />
                </div>
                {passcodeEnabled ? (
                  <>
                    <div className="passcode mb-0">
                      {/* <Form.Label>
                          {" "}
                          {t("share.modal:add.passcode")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label> */}
                    </div>
                    <Form.Control
                      className="passcode-input"
                      placeholder={"Passcode"}
                      type="password"
                      name="passcode"
                      autoComplete="new-password"
                      maxLength={12}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                      }}
                    />
                    {/* <span
                      //   className={`${
                      //     props.files.length + props.totalFiles.length >
                      //     fileConfig.maxAllowedFilesInPost
                      //       ? "text-danger"
                      //       : "text-primary"
                      //   }`}
                      >
                        {`${t("share.modal:file.count", {
                          selectedFilesCount: `${passcode.length} `,
                        })} `}
                      </span>
                      &nbsp;{`/ 12`} */}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-upload-footer" style={{ border: "none" }}>
          {/* <div className="form-wrapper mt-5">
            <ListGroup>
              {memberList &&
                memberList.length > 0 &&
                memberList.map((member) => {
                  return (
                    <ListGroup.Item
                      className="d-flex align-items-center justify-content-between member-list-item"
                      key={member.memberEmail}
                    >
                      <div className="member-info">
                        <span>{member.memberEmail}</span>
                        <Button
                          size="small"
                          strong
                          square
                          onClick={(e) => e.preventDefault()}
                          bordered={true}
                          backgroundColor={
                            hasDecision
                              ? buttonBackgroundColorHovered
                              : buttonBackgroundColorNormal
                          }
                          textColor={
                            hasDecision ? textColorHovered : textColorNormal
                          }
                          hoverBackgroundColor={buttonBackgroundColorHovered}
                          hoverTextColor={textColorHovered}
                          borderColor={
                            hasDecision ? borderColorHovered : borderColorNormal
                          }
                          hoverBorderColor={borderColorHovered}
                          className="m-0"
                        >
                          {member.memberType}
                        </Button>
                      </div>
                      <div
                        className="remove-member-button"
                        onClick={(e) =>
                          removeEmailFromList(member.memberEmail, member.cid)
                        }
                      />
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
            {memberList.length ? <FilesBreak /> : <></>}
          </div> */}
          <div className="d-flex justify-content-center">
            <button
              className="share-btn"
              onClick={() => {
                if (
                  !(
                    (passcodeEnabled && passcode?.length === 0) ||
                    memberList?.length === 0
                  )
                )
                  handleSubmit();
              }}
              disabled={
                (passcodeEnabled && passcode?.length === 0) ||
                memberList?.length === 0
              }
              style={{ width: "88px" }}
            >
              Share
            </button>
          </div>
        </div>
      </ESignatureShareStyledModal>
    </>
  );
}

export default ShareESignatureModal;
