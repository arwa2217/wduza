//Code commented in this file is to be used in future releases, please don't remove the same
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PermissionConstants } from "../../constants/permission-constants";
import Progress from "../utils/progress-bar";
import { StyledModal } from "./styles/styled-modal";
import { FilesBreak, EmailBreak, FileExt } from "./styles/break";
import { CancelButton } from "./styles/cancel-button";
import { ShareButton } from "./styles/share-button";
import Close from "../../assets/icons/attach-close.svg";
import ScriptWindowShare from "../script-window/script-window-share";
import UploadedFileIcon from "../../assets/icons/uploaded-file.svg";
import { Button } from "../shared/styles/mainframe.style";
import debounce from "lodash/debounce";
import moment from "moment";
// import RejectedFileIcon from "../../assets/icons/rejected-file.svg";
import { getFileSizeBytes, fileExtension } from "../utils/file-utility";
import { fetchUserTypeAction } from "../../store/actions/channelActions";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import ArrowUp from "../../assets/icons/attach-arrow-up.svg";
import ArrowDown from "../../assets/icons/attach-arrow-down.svg";
import Suggestions from "../modal/channel/Suggestions.js";
import UserType from "../../constants/user/user-type";
import ChannelConstants from "../../constants/channel/channel-constants";
import ListGroup from "react-bootstrap/ListGroup";
import CommonUtils from "../utils/common-utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import "./files.css";

const hasDecision = true;
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "post__tags__background__hover";
const textColorNormal = "post__tags__color";
const textColorHovered = "post__tags__color__hover";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";

function ShareFilesModal(props) {
  const scriptWindowSendButton = useRef(null);
  let fileNameDataArr = [];
  let filesCopy = useRef([...props.files]);
  const [filesShow, setFilesShow] = useState(filesCopy.current);
  let myPermission = useRef(true);
  let calenderRef = useRef(null);
  const { t } = useTranslation();
  const [passcode, setPasscode] = useState("");
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [expirationDate, setExpirationDate] = useState(10080);
  const [expirationDateText, setExpirationDateText] = useState("");
  const currentNetworkType = useSelector(
    (state) => state.AuthReducer.networkType
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const [expirationDateSelect, setExpirationDateSelect] = useState({
    label: "7 days",
    value: 10080,
  });
  const [internalPermission, setInternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [internalPermissionOOO, setInternalPermissionOOO] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [externalPermission, setExternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const fileConfig = useSelector((state) => state.config.fileConfig);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const channel = props.channel;
  const [memberList, setMemberList] = useState([]);

  const [inputs, setInputs] = useState({
    email: channel?.otherUserEmail ? channel.otherUserEmail : "",
  });
  const { email } = inputs;
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [fileName, setFileName] = useState([]);
  const [viewPermission, setViewPermission] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [applyCss, setApplyCss] = useState(false);
  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );
  const addMemberApiError = useSelector(
    (state) => state.ChannelMemberReducer.addMemberApiError
  );
  const dispatch = useDispatch();
  const addMemberDuplicateEmailError = useSelector(
    (state) => state.ChannelMemberReducer.user
  );
  const [submitted, setSubmitted] = useState(false);
  const [isValidEmail, setValidEmail] = useState(true);
  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const userTypeData = useSelector((state) => state.ChannelReducer.getUserType);
  const emptyEmail = t("addPeople.modal:email.required");
  const [allOptions, setAllOptions] = useState([
    { label: "7 days", value: 10080 },
    {
      label: "30 days",
      value: 43200,
    },
    {
      label: "1 year",
      value: 525600,
    },
    {
      label: "Set dates",
      value: "CUSTOM",
    },
  ]);
  const [emailError, setEmailError] = useState(emptyEmail);
  const userType = userTypeData ? userTypeData.member_type : "";
  const [memberCID, setMemberCID] = useState(
    userTypeData &&
      userTypeData.member_type === "EXTERNAL" &&
      userTypeData.Ent.length === 1
      ? userTypeData.Ent[0].cid
      : ""
  );

  let content = useRef("");
  function setContent(data) {
    content.current = data;
  }
  useEffect(() => {
    var newDateObj = new Date(new Date().getTime() + expirationDate * 60000);
    let dateString = moment(newDateObj).format("MMM D, YYYY");
    // setExpirationDate(newDateObj.getMinutes());
    setExpirationDateText(
      t("confirm.share.modal:expires.on", { expireDate: dateString })
    );
    if (props.files?.length === 1) {
      if (props.files[0]?.fileForwardDisabled) {
        setIsDisabled(true);
      }
    }
  }, []);

  useEffect(() => {
    if (expirationDateSelect && expirationDateSelect.value) {
      if (expirationDateSelect.value !== "CUSTOM") {
        var newDateObj = new Date(
          new Date().getTime() + expirationDateSelect.value * 60000
        );
        let dateString = moment(newDateObj).format("MMM D, YYYY");
        setExpirationDate(expirationDateSelect.value);
        setExpirationDateText(
          t("confirm.share.modal:expires.on", { expireDate: dateString })
        );
      } else {
        setShowDate(true);
      }
    }
  }, [expirationDateSelect]);

  const saveExpirationTime = (value) => {
    if (value !== "CUSTOM") {
      setExpirationDate(value);
    } else {
      setShowDate(true);
    }
  };
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
      if (props?.expirationDateSelect.value === "CUSTOM") {
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
        setExpirationDateText(
          t("confirm.share.modal:expires.on", { expireDate: expireDate })
        );
      } else {
        setExpirationDate(props?.shareData?.fileExpiry);
      }
    }
  }, [props.shareData]);

  const onSendClick = () => {
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
      props.setExpirationDateSelect(expirationDateSelect);
      props.setShareData(postObj);
      props.handleClose();
    }
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
      setExpirationDateText(
        t("confirm.share.modal:expires.on", { expireDate: dateString })
      );
    }
    setShowDate(false);
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

  const setFileNameAndExt = (id, fullName) => {
    let fileNameArr = [...fileName];
    let selectedId = fileNameArr.find((el) => el.id === id);

    const last_dot = fullName.lastIndexOf(".");
    const myFileName = fullName.slice(0, last_dot);
    let fileNameObj = {};
    fileNameObj.id = id;
    fileNameObj.name = selectedId === undefined ? myFileName : selectedId.name;
    fileNameDataArr.push(fileNameObj);
  };
  const handleModalClose = (value) => {
    props.handleClose();

    fileNameDataArr = [];
  };

  const handleFileDelete = (id) => {
    let fileCopyArr = [...filesCopy.current];
    let filteredCopyArr = fileCopyArr.filter((el) => el.fileId !== id);

    filesCopy.current = [...filteredCopyArr];
    setFilesShow(filesCopy.current);
    if (filesCopy.current.length < 1) {
      handleModalClose();
    }
    if (filesCopy.current?.length === 1) {
      if (filesCopy.current[0].fileForwardDisabled) {
        setIsDisabled(true);
      }
    }
  };
  useEffect(() => {
    if (props.files?.length > 3) {
      props.files.map(({ file, src, id, mimeType, size }, index) =>
        internalPermission === PermissionConstants(t).VIEW ||
        internalPermissionOOO === PermissionConstants(t).VIEW ||
        externalPermission === PermissionConstants(t).VIEW
          ? fileConfig && fileConfig.mime.indexOf(mimeType) !== -1
            ? size < getFileSizeBytes(fileConfig.maxfilesize)
              ? ""
              : setApplyCss(true)
            : mimeType.split("/")[0] === "image" ||
              mimeType === "application/pdf"
            ? ""
            : setApplyCss(true)
          : ""
      );
    }
  }, [internalPermission, internalPermissionOOO, externalPermission]);

  useEffect(() => {
    props.files.map(({ name, src, fileId, mimeType, size }, index) => {
      setFileNameAndExt(fileId, name);
      setFileName(fileNameDataArr);
      if (myPermission.current === true) {
        if (
          (fileConfig &&
            fileConfig.mime.indexOf(mimeType) !== -1 &&
            size < getFileSizeBytes(fileConfig.maxfilesize)) ||
          mimeType.split("/")[0] === "image" ||
          mimeType === "application/pdf"
        ) {
          myPermission.current = true;
        } else {
          myPermission.current = false;
        }
      }
    });

    if (
      props.files.length + props.totalFiles.length >
      fileConfig.maxAllowedFilesInPost
    ) {
      setIsDisabled(true);
    } else {
      // setIsDisabled(false);
    }
    if (props.files?.length === 1) {
      if (props.files[0]?.fileForwardDisabled) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }

    setViewPermission(myPermission.current);
    setInternalPermission(PermissionConstants(t).DOWNLOAD);
    setInternalPermissionOOO(PermissionConstants(t).DOWNLOAD);
    setExternalPermission(PermissionConstants(t).DOWNLOAD);
    if (props.files.length === 0) {
      handleModalClose(false);
    }
  }, [props.files]);

  useEffect(() => {
    if (expirationDate === "CUSTOM") {
      setShowDate(true);
    }
  }, [expirationDate]);

  useEffect(() => {
    if (memberList?.length > 0 && expirationDate) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (passcodeEnabled) {
      if (passcode?.length > 0) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
    if (props.files?.length === 1) {
      if (props.files[0]?.fileForwardDisabled) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
  }, [expirationDate, passcode, passcodeEnabled, props.files, memberList]);

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

  const handleClickOutside = (event) => {
    if (calenderRef.current && !calenderRef.current.contains(event.target)) {
      setShowDate(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <StyledModal
      className={`share-files-modal`}
      show={props.show}
      onHide={() => handleModalClose(true)}
      centered
      backdrop={"static"}
      keyboard={false}
    >
      <Modal.Header className={`attach-header border-none`}>
        <div className="modal-heading">
          <div className="heading">{t("share.modal:file.sharing.header")}</div>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="close attachment-close"
              onClick={(e) => handleModalClose(true)}
            >
              <span aria-hidden="true">
                <img src={Close} alt="" />
              </span>
              <span className="sr-only">
                {t("rename.discussion.modal:close")}
              </span>
            </button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Header
        className={`attach-header ${
          filesShow?.length > 6 || applyCss ? "scrollable-y" : ""
        }`}
      >
        <Progress height="6px" progress={props.progress} />

        <div className="thumbnail-container">
          {filesShow.length > 0 &&
            filesShow.map(
              (
                {
                  file,
                  src,
                  fileId,
                  mimeType,
                  size,
                  name,
                  fileForwardDisabled,
                  creatorId,
                  queryUserType,
                  uploadedFolderId,
                  internalPermission,
                  externalPermission,
                  internalPermissionOoo,
                },
                index
              ) => (
                <div className="d-flex flex-column" key={`thumb-${fileId}`}>
                  <div id={fileId} className="thumbnail-wrapper">
                    <FileExt className="btn thumbnail">{`.${fileExtension(
                      mimeType
                    )}`}</FileExt>
                    <div className="input-group">
                      <input
                        className="form-control thumbnail-caption"
                        value={fileName.length > 0 && name}
                        // onChange={(e) => {
                        //   updateName(id, file, e.target.value);
                        // }}
                        disabled
                      />
                      {props.status !== UploadStatus.PENDING.toString() && (
                        <div className="input-group-append">
                          <span onClick={() => handleFileDelete(fileId)}>
                            <img src={Close} alt="" style={{ width: "13px" }} />
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        height: "20px",
                        textAlign: "right",
                      }}
                    >
                      {Object.keys(props.uploaded).length > 0
                        ? Object.keys(props.uploaded).includes(
                            fileId.toString()
                          ) && (
                            <img
                              src={UploadedFileIcon}
                              alt=""
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "20px",
                              }}
                            />
                          )
                        : ""}
                    </div>
                  </div>
                  {fileForwardDisabled && (
                    <div className="text-danger">
                      {t("share.modal:invalid.file.error")}
                    </div>
                  )}

                  {!fileForwardDisabled &&
                    creatorId !== currentUser?.id &&
                    ((queryUserType === "INTERNAL" &&
                      ((currentNetworkType === "INTERNAL" &&
                        internalPermission !== "DL") ||
                        (currentNetworkType === "EXTERNAL" &&
                          internalPermissionOoo !== "DL"))) ||
                      (queryUserType === "EXTERNAL" &&
                        externalPermission !== "DL")) && (
                      <div className="text-danger">
                        {t("file.forward:shared.error")}
                      </div>
                    )}
                </div>
              )
            )}
        </div>
      </Modal.Header>
      <Modal.Body className="m-pad">
        <div className="share-files-modal-form">
          <Row className="m-0 justify-content-between">
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
          </Row>
          <Form.Group
            ref={calenderRef}
            className={`${showDate ? "" : "d-none"}`}
          >
            {/* <div ref={calenderRef} className={`${showDate ? "" : "d-none"}`}> */}
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
            {/* </div> */}
          </Form.Group>
          <FilesBreak></FilesBreak>
          <Row className="m-0 mb-3 justify-content-between">
            <span className="m-0 title">{t("share.modal:passcode")}</span>
            <Form.Check
              type="switch"
              id="custom-switch"
              label=""
              checked={passcodeEnabled}
              onChange={() => {
                setPasscodeEnabled(!passcodeEnabled);
              }}
            />
          </Row>
          {passcodeEnabled ? (
            <>
              <Form.Group>
                <div className="passcode">
                  <Form.Label>
                    {" "}
                    {t("share.modal:add.passcode")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <span
                    className={`${
                      props.files.length + props.totalFiles.length >
                      fileConfig.maxAllowedFilesInPost
                        ? "text-danger"
                        : "text-primary"
                    }`}
                  >
                    {`${t("share.modal:file.count", {
                      selectedFilesCount: `${passcode.length} `,
                    })} `}
                  </span>
                  &nbsp;&nbsp;{`/12`}
                </div>
                <Form.Control
                  className="folder-input"
                  placeholder={t("share.modal:add.passcode.placeholder")}
                  type="password"
                  name="passcode"
                  autoComplete="new-password"
                  maxLength={12}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                  }}
                />
              </Form.Group>
            </>
          ) : (
            ""
          )}
          <Form.Group>
            <Form.Label>
              {t("share.modal:add.member.label")}{" "}
              <span className="text-danger">*</span>
            </Form.Label>
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
                  "addPeople.modal:addMemberApiError:" + addMemberApiError.code
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
          <Form.Group className={`files-forward-add-notes `}>
            <Form.Label>{t("share.modal:add.notes")}</Form.Label>
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
              onTaskSendClick={onSendClick}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <EmailBreak></EmailBreak>
      <Modal.Footer>
        <div className="form-wrapper">
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
        </div>
        <div className="actions-btn">
          <CancelButton onClick={(e) => handleModalClose(true)}>
            {t("share.modal:cancel.button")}
          </CancelButton>
          <ShareButton
            onClick={() => {
              return getForwardableFiles(filesShow).length < 1
                ? undefined
                : onSendClick();
            }}
            disabled={
              getForwardableFiles(filesShow).length < 1 ||
              (passcodeEnabled && passcode?.length === 0) ||
              memberList?.length === 0
            }
          >
            {t("share.modal:next.button")}
          </ShareButton>
        </div>
      </Modal.Footer>
    </StyledModal>
  );
}

export default ShareFilesModal;
