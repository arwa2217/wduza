import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import "./create-channel-modal.css";
import ModalActions from "../../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";
import ListGroup from "react-bootstrap/ListGroup";
import ModalTypes from "../../../constants/modal/modal-type";
import ChannelConstants from "../../../constants/channel/channel-constants";
import {
  createChannelAction,
  fetchUserTypeAction,
  resetCreateChannelAction,
} from "../../../store/actions/channelActions";
import { cleanUserListState } from "../../../store/actions/user-actions";

import Suggestions from "./Suggestions";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import debounce from "lodash/debounce";
import CommonUtils from "../../utils/common-utils";
import Close from "../../../assets/icons/close.svg";
import { Button } from "../../shared/styles/mainframe.style";

const hasDecision = true;
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "post__tags__background__hover";
const textColorNormal = "post__tags__color";
const textColorHovered = "post__tags__color__hover";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";

function CreateChannelModal(props) {
  const { t } = useTranslation();
  const channel = props.channel;
  const [show, setShow] = useState(true);
  const titleKey = "discussion:new.discussion";
  const modalTitle = t(titleKey);
  const [emailError, setEmailError] = useState("");
  const [userError, setUserError] = useState("");

  const [inputs, setInputs] = useState({
    name: (props.channel && props.channel.name) || "",
    email: "",
    description: "",
  });
  let { name, email, description } = inputs;
  const [memberList, setMemberList] = useState(
    (props.channel && props.channel.membersList) || []
  );
  const maxChars = 64;
  const descriptionMaxChar = 94;
  const [charLeft, setCharLeft] = useState(maxChars);
  const [descriptionCharLeft, setDescriptionCharLeft] =
    useState(descriptionMaxChar);

  const invalidEmail = t("addPeople.modal:invalid.email");

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false); //props.channel ? true :
  const creatingChannel = useSelector(
    (state) => state.ChannelReducer.creatingChannel
  );
  const createdChannel = useSelector(
    (state) => state.ChannelReducer.createdChannel
  );
  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );

  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const userTypeData = useSelector((state) => state.ChannelReducer.getUserType);
  const userType = userTypeData ? userTypeData.member_type : "";
  const [memberCID, setMemberCID] = useState(
    userTypeData &&
      userTypeData.member_type === "EXTERNAL" &&
      userTypeData.Ent.length === 1
      ? userTypeData.Ent[0].cid
      : ""
  );
  const entList =
    userTypeData && userTypeData.member_type === "EXTERNAL"
      ? userTypeData.Ent
      : [];
  const [isSubmitBtnEnabled, enableSubmitBtn] = useState(
    props.channel && props.channel.name !== "" ? true : false
  );
  let checkUserType = false;
  useEffect(() => {
    setMemberCID(
      userTypeData &&
        userTypeData.member_type === "EXTERNAL" &&
        userTypeData.Ent.length === 1
        ? userTypeData.Ent[0].cid
        : ""
    );
  }, [userTypeData]);

  useEffect(() => {
    if (createdChannel) {
      handleClose();
    }
  }, [createdChannel]);

  const handleUserType = debounce(function (value) {
    dispatch(fetchUserTypeAction(value));
  }, 500);

  function handleEmail(value) {
    setSubmitted(false);
    setEmailError("");
    // const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, email: value.replace(/\s/g, "") }));
    // if (name === "email") {
    if (CommonUtils.isValidEmail(value)) {
      handleUserType(value);
      setHasValidEmail(true);
      setFetchingUser(true);
      setFetchedUserType(false);
      setTimeout(() => {
        setFetchingUser(false);
        setFetchedUserType(true);
      }, 1500);
    } else {
      setHasValidEmail(false);
      setFetchingUser(false);
      setFetchedUserType(false);
    }
    // }
  }

  const handleBack = () => {
    if (channel.showAdvanceControl) {
      const modalType = ModalTypes.CREATE_DISCUSSION_ADVANCE_CTRL;
      const modalProps = {
        show: true,
        closeButton: true,
        channel: channel,
      };
      dispatch(ModalActions.showModal(modalType, modalProps));
    }
  };

  function cleanUserList(list) {
    var result = [];
    list.map((user) => {
      if (user.memberEmail && user.memberEmail !== "") {
        result.push(user);
      }
      return user;
    });
    return result;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (createChannelApiError) {
      dispatch(resetCreateChannelAction());
    }
    setSubmitted(true);
    if (name) {
      name = name.trim();
      if (email && !CommonUtils.isValidEmail(email)) {
        setEmailError(invalidEmail);
        return;
      }

      let userTempList = [];
      if (memberList && memberList.length > 0) {
        console.log("Member list>>>", memberList);
        userTempList.push(...memberList);
      }

      if (hasValidEmail && fetchedUserType) {
        if (!userTempList.includes(email) && email !== "") {
          userTempList.push({
            memberEmail: email,
            memberType: userType,
            cid: memberCID,
          });
        }
      }
      let array = [];
      userTempList.forEach((item) => {
        array.push(item.memberType);
      });
      if (
        array.includes("GUEST") === true &&
        array.includes("EXTERNAL") === true
      ) {
        checkUserType = true;
        setUserError(true);
      }

      channel.name = name;
      channel.description = description;
      var finalList = cleanUserList(userTempList);
      channel["membersList"] = finalList;
      if (!checkUserType) {
        console.log("create Channel Action>>>", createChannelAction);
        dispatch(createChannelAction(channel, dispatch));
      }
      console.log("channel.name>>>", channel.name);
      console.log(" channel.description>>>>>", channel.description);
    }
  }

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

  function handleNameChange(e) {
    var { name, value } = e.target;

    //removing space from input string
    // value = value.replace(/\s/g, "");
    if (name === "description") {
      setDescriptionCharLeft(descriptionMaxChar - value.length);
    }
    if (name === "name") {
      setCharLeft(maxChars - value.length);
      enableSubmitBtn(value && value.length > 0);
    }
    if (createChannelApiError) {
      dispatch(resetCreateChannelAction());
    }

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleClose = () => {
    setShow(false);
    dispatch(cleanUserListState());
    dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal("xyz"));
  };

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="create-channel-modal"
        centered
        // scrollable="true"
      >
        {/* {submitted && name && createChannelApiError && (
          <div style={{ borderBottom: "10px solid rgba(0,0,0,.5)" }}>
            <div
              class="invalid-feedback d-block"
              style={{
                background: "#F36E3A",
                margin: 0,
                padding: "15px",
                color: "#fff",
              }}
            >
              {createChannelApiError.code
                ? t(
                    "create.channel.modal:createChannelApiError:" +
                      createChannelApiError.code
                  )
                : createChannelApiError.message}
            </div>
          </div>
        )} */}
        <ModalHeader>
          {modalTitle}
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">{t("create.channel.modal:close")}</span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Group>
                    <Form.Label>{t("discussion:name.label")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        maxLength={maxChars}
                        placeholder={t("discussion:name.placeholder")}
                        onChange={handleNameChange}
                        className={
                          "pr-5" +
                          (submitted &&
                          (!name ||
                            (createChannelApiError &&
                              createChannelApiError.code === 4012))
                            ? " is-invalid"
                            : "")
                        }
                      />

                      {name && !createChannelApiError && (
                        <InputGroup.Prepend>
                          <span>{charLeft}</span>
                        </InputGroup.Prepend>
                      )}
                      {submitted && !name && (
                        <div className="invalid-feedback">
                          {t("create.channel.modal:name.required")}
                        </div>
                      )}

                      {submitted &&
                        createChannelApiError &&
                        createChannelApiError.code === 4012 && (
                          <div className="invalid-feedback">
                            {t(
                              "create.channel.modal:createChannelApiError:4012"
                            )}
                          </div>
                        )}

                      {/* {!submitted && !createChannelApiError && (
                <div className="feedback">
                  {t("discussion:name.this.discussion.description")}
                </div>
              )} */}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("discussion:description.label")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="description"
                        value={description}
                        maxLength={descriptionMaxChar}
                        placeholder={t("discussion:description.placeholder")}
                        onChange={handleNameChange}
                        className={"pr-5"}
                        // className={
                        //   "pr-5" +
                        //   (submitted &&
                        //   (!description ||
                        //     (createChannelApiError &&
                        //       createChannelApiError.code == 4012))
                        //     ? " is-invalid"
                        //     : "")
                        // }
                      />

                      {description && !createChannelApiError && (
                        <InputGroup.Prepend>
                          <span>{descriptionCharLeft}</span>
                        </InputGroup.Prepend>
                      )}
                      {/* {submitted && !name && (
                        <div className="invalid-feedback">
                          {t("create.channel.modal:name.required")}
                        </div>
                      )} */}

                      {/* {submitted &&
                        createChannelApiError &&
                        createChannelApiError.code == 4012 && (
                          <div className="invalid-feedback">
                            {t(
                              "create.channel.modal:createChannelApiError:4012"
                            )}
                          </div>
                        )} */}

                      {/* {!submitted && !createChannelApiError && (
                <div className="feedback">
                  {t("discussion:name.this.discussion.description")}
                </div>
              )} */}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("discussion:invite.label")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Suggestions
                        showUserAffiliation={true}
                        type="email"
                        name="email"
                        placeholder={t("discussion:invite.placeholder")}
                        value={email}
                        handleChange={handleEmail}
                        className={
                          "member-add-input form-control" +
                          (submitted &&
                          email &&
                          (!email ||
                            (createChannelApiError &&
                              (createChannelApiError.code === 4014 ||
                                createChannelApiError.code === 40014)) ||
                            emailError)
                            ? " is-invalid"
                            : "")
                        }
                      />

                      {hasValidEmail && fetchingUserType && (
                        <InputGroup.Prepend>
                          <span className="spinner-border spinner-border-sm"></span>
                        </InputGroup.Prepend>
                      )}
                      {email && hasValidEmail && !fetchingUserType && (
                        <InputGroup.Prepend
                          style={{
                            cursor: "pointer",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            width: "40px",
                            justifyContent: "center",
                          }}
                        >
                          <span onClick={addEmailToList}>
                            {t("create.channel.modal:add")}
                          </span>
                        </InputGroup.Prepend>
                      )}
                    </InputGroup>
                    {/* {submitted && !email && (
                      <div className="invalid-feedback">
                        {t("create.channel.modal:email.required")}
                      </div>
                    )} */}
                    {submitted && emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}

                    {submitted &&
                      createChannelApiError &&
                      createChannelApiError.code === 4014 && (
                        <div className="invalid-feedback">
                          {t("create.channel.modal:createChannelApiError:4014")}
                        </div>
                      )}
                    {submitted &&
                      createChannelApiError &&
                      createChannelApiError.code === 40014 && (
                        <div className="invalid-feedback">
                          {t(
                            "create.channel.modal:createChannelApiError:40014"
                          )}
                        </div>
                      )}
                    {/* {!submitted &&
                !fetchingUserType &&
                !fetchedUserType &&
                !emailError &&
                !createChannelApiError && (
                  <div className="feedback">
                    {t("discussion:invite.description")}
                  </div>
                )} */}
                    {submitted && userError && (
                      <div className="user-type-error">
                        {t("create.channel.modal:userType.different")}
                      </div>
                    )}
                    {!fetchingUserType &&
                    fetchedUserType &&
                    !emailError &&
                    !createChannelApiError &&
                    userType === ChannelConstants.INTERNAL ? (
                      <div className="text-muted form-text w-100">
                        {email &&
                          email + t("discussion:invited.user.type.INTERNAL")}
                      </div>
                    ) : !fetchingUserType &&
                      fetchedUserType &&
                      !emailError &&
                      !createChannelApiError &&
                      userType === ChannelConstants.GUEST ? (
                      <div className="text-muted form-text w-100">
                        {email &&
                          email + t("discussion:invited.user.type.GUEST")}
                      </div>
                    ) : !fetchingUserType &&
                      fetchedUserType &&
                      !emailError &&
                      !createChannelApiError &&
                      userType === ChannelConstants.EXTERNAL ? (
                      <div className="text-muted form-text w-100">
                        {email &&
                          email + t("discussion:invited.user.type.EXTERNAL")}
                      </div>
                    ) : (
                      ""
                    )}
                  </Form.Group>
                  <Form.Group>
                    {!fetchingUserType &&
                      fetchedUserType &&
                      email &&
                      !createChannelApiError &&
                      entList &&
                      entList.length > 1 &&
                      entList.map((el) => (
                        <Form.Check
                          custom
                          label={el.name}
                          checked={memberCID === el.cid}
                          type="radio"
                          id={`custom-radio-${el.cid}`}
                          onChange={(e) => setMemberCID(el.cid)}
                        />
                      ))}
                  </Form.Group>
                </div>
              </Col>
              <Col xs={12}>
                <hr className="hr-border" />
              </Col>
              <Col xs={12}>
                <div className="form-wrapper member-list">
                  <ListGroup>
                    {memberList &&
                      memberList.length > 0 &&
                      memberList.map((member) => {
                        return (
                          <ListGroup.Item className="d-flex align-items-center justify-content-between member-list-item">
                            <div className="member-info">
                              <span className="mr-3">{member.memberEmail}</span>

                              <Button
                                size="small"
                                strong
                                square
                                bordered={true}
                                backgroundColor={
                                  hasDecision
                                    ? buttonBackgroundColorHovered
                                    : buttonBackgroundColorNormal
                                }
                                textColor={
                                  hasDecision
                                    ? textColorHovered
                                    : textColorNormal
                                }
                                hoverBackgroundColor={
                                  buttonBackgroundColorHovered
                                }
                                hoverTextColor={textColorHovered}
                                borderColor={
                                  hasDecision
                                    ? borderColorHovered
                                    : borderColorNormal
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
                                removeEmailFromList(
                                  member.memberEmail,
                                  member.cid
                                )
                              }
                            >
                              Remove
                            </div>
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {channel.showAdvanceControl && (
            <button onClick={handleBack} className="btn px-5 back">
              {t("discussion:additional.controls:back.button")}
            </button>
          )}
          <button
            // disabled={!(inputs.name && hasValidEmail && !fetchingUserType)}
            className={`btn px-5 ${
              !isSubmitBtnEnabled ? "btn-disabled" : "btn-success"
            }`}
            onClick={!isSubmitBtnEnabled ? null : handleSubmit}
          >
            {creatingChannel && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {
              t("discussion:CREATE_DISCUSSION")
              //!isAdvanced && || "Next"
            }
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateChannelModal;
