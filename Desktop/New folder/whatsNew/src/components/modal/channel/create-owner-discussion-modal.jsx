import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import {
  fetchUserTypeAction,
  resetCreateChannelAction,
} from "../../../store/actions/channelActions";
import {
  createDiscussionAction,
  resetCreateDiscussionAction,
} from "../../../store/actions/admin-account-action";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import debounce from "lodash/debounce";
import Close from "../../../assets/icons/close.svg";
import { showToast } from "../../../store/actions/toast-modal-actions";
import Suggestions from "./Suggestions";
import CommonUtils from "../../utils/common-utils";
import ChannelConstants from "../../../constants/channel/channel-constants";
import { cleanUserListState } from "../../../store/actions/user-actions";
import ModalActions from "../../../store/actions/modal-actions";
import { RESET_USER_TYPE } from "../../../store/actionTypes/channelActionTypes";

function CreateOwnerDiscussionModal(props) {
  const { t } = useTranslation();
  const titleKey = "discussion:new.discussion";
  const modalTitle = t(titleKey);
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
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
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false); //props.channel ? true :
  const creatingChannel = useSelector(
    (state) => state.ChannelReducer.creatingChannel
  );

  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );
  const createdDiscussion = useSelector(
    (state) => state.AdminAccountReducer.createdDiscussion
  );
  const failedToCreateDiscussion = useSelector(
    (state) => state.AdminAccountReducer.failedToCreateDiscussion
  );
  const [isSubmitBtnEnabled, enableSubmitBtn] = useState(
    props.channel && props.channel.name !== "" ? true : false
  );
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [emailError, setEmailError] = useState("");
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

  useEffect(() => {
    if (createdDiscussion) {
      handleClose();
      dispatch(showToast(t("discussion:created.success"), 3000, "success"));
    } else if (failedToCreateDiscussion) {
      handleClose();
      dispatch(showToast(t("discussion:created.fail")), 3000);
    }
    return () => {
      dispatch(resetCreateDiscussionAction());
    };
  }, [createdDiscussion, failedToCreateDiscussion]);

  const handleUserType = debounce(function (value) {
    dispatch(fetchUserTypeAction(value));
  }, 500);

  function getUserIdByEmail(members, emailToSearch) {
    let memberWithGivenEmail = members.filter(
      (member) => member.email === emailToSearch
    );

    if (memberWithGivenEmail.length > 0) {
      return memberWithGivenEmail[0].id;
    }
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (createChannelApiError) {
      dispatch(resetCreateDiscussionAction());
    }
    setSubmitted(true);
    // if ((userType === ChannelConstants.INTERNAL) || props.owner) {
      name = name.trim();
      let postData = {
        name: name,
        description: description,
        membersList: [
          {
            memberEmail: props.owner ? props.owner : email,
            memberType: "INTERNAL",
            cid: adminSelectedRow?.uid ? adminSelectedRow.uid : "",
          },
        ],

        ownerId: props.owner
          ? adminSelectedRow?.id
            ? adminSelectedRow?.id
            : ""
          : getUserIdByEmail(globalMembers, email)
          ? getUserIdByEmail(globalMembers, email)
          : "",
        createdByAdmin: true,
      };
      dispatch(createDiscussionAction(postData, dispatch));
    // }
  }

  useEffect(() => {
    if (email || props.owner) {
      // setCharLeft(maxChars - value.length);
      enableSubmitBtn(true);
    }
  }, [props.owner, email]);

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
    if (name === "email" || props.owner) {
      // setCharLeft(maxChars - value.length);
      enableSubmitBtn(value && value.length > 0);
    }
    if (createChannelApiError) {
      dispatch(resetCreateDiscussionAction());
    }

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleClose = () => {
    props.closeModal();
    dispatch(cleanUserListState());
    dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal("xyz"));
    setInputs({
      name: (props.channel && props.channel.name) || "",
      email: "",
      description: "",
    });
    setSubmitted(false);
    enableSubmitBtn(false);
    dispatch({
      type: RESET_USER_TYPE,
    });
  };

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

  return (
    <>
      <Modal
        size="lg"
        show={props.showModal}
        onHide={handleClose}
        className="create-channel-modal"
        centered
        // scrollable="true"
      >
        <ModalHeader>
          {modalTitle}
          <button type="button" class="close" onClick={handleClose}>
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span class="sr-only">{t("create.channel.modal:close")}</span>
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
                      />

                      {description && !createChannelApiError && (
                        <InputGroup.Prepend>
                          <span>{descriptionCharLeft}</span>
                        </InputGroup.Prepend>
                      )}
                    </InputGroup>
                  </Form.Group>
                  {props.owner ? (
                    <Form.Group>
                      <Form.Label>
                        {t("discussion:discussion.owner")}
                      </Form.Label>
                      <InputGroup className="char-counter-wrapper">
                        <Form.Control
                          disabled={true}
                          type="email"
                          name="email"
                          value={props.owner}
                          placeholder={t(
                            "discussion:discussion.owner.placeholder"
                          )}
                          onChange={handleNameChange}
                          className={"pr-5"}
                        />
                      </InputGroup>
                    </Form.Group>
                  ) : (
                    <>
                      <Form.Group>
                        <Form.Label>{t("discussion:invite.label")}</Form.Label>
                        <InputGroup className="char-counter-wrapper">
                          <Suggestions
                            showUserAffiliation={true}
                            type="email"
                            name="email"
                            placeholder={t("discussion:invite.placeholder")}
                            value={email}
                            handleChange={handleEmail || addEmailToList}
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
                          {/* {email && hasValidEmail && !fetchingUserType && (
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
                          )} */}
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
                              {t(
                                "create.channel.modal:createChannelApiError:4014"
                              )}
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
                      {isSubmitBtnEnabled &&
                      userType !== ChannelConstants.INTERNAL ? (
                        <div className="text-muted form-text w-100">
                          {t("discussion:invited.user.type.should.INTERNAL")}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </div>
              </Col>
              <Col xs={12}>
                <hr className="hr-border" />
              </Col>
              <Col xs={12}>
                <div className="form-wrapper member-list"></div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary cancel-btn"
            onClick={handleClose}
          >
            {t("button:cancel")}
          </button>
          <button
            className={`btn px-5 ${
              !isSubmitBtnEnabled ? "btn-disabled" : "btn-success"
            }`}
            onClick={!isSubmitBtnEnabled ? null : handleSubmit}
          >
            {creatingChannel && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {t("button:create")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateOwnerDiscussionModal;
