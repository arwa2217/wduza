import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import "./folder.css";
import ModalActions from "../../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";
import {
  createChannelAction,
  resetCreateChannelAction,
} from "../../../store/actions/channelActions";
import { cleanUserListState } from "../../../store/actions/user-actions";
import CommonUtils from "../../utils/common-utils";
import Close from "../../../assets/icons/close.svg";

function DeleteFileModal(props) {
  const { t } = useTranslation();
  const channel = props.channel;

  const [show, setShow] = useState(false);
  const titleKey = "files:delete.file";
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
      if (!CommonUtils.isValidEmail(email)) {
        setEmailError(invalidEmail);
      }

      let userTempList = [];
      if (memberList && memberList.length > 0) {
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
        dispatch(createChannelAction(channel, dispatch));
      }
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
    {
      if (createChannelApiError) {
        dispatch(resetCreateChannelAction());
      }
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleClose = () => {
    setShow(false);
    dispatch(cleanUserListState());
    dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal("xyz"));
  };

  const handleShow = () => setShow(false);
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="create-folder-modal"
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
          <p className="delete-msg">
            {" "}
            {t("files:delete.file.message", { fileCount: 2 })}
          </p>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className="ok-btn"
            onClick={!isSubmitBtnEnabled ? null : handleSubmit}
          >
            {creatingChannel && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {t("files:ok")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteFileModal;
