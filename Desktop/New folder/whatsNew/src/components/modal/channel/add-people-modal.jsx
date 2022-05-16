import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTypes from "../../../constants/modal/modal-type";
import { useDispatch, useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalActions from "../../../store/actions/modal-actions";
import ChannelMemberActions from "../../../store/actions/channel-member-actions";
import ChannelType from "../../../props/channel-type";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { fetchUserTypeAction } from "../../../store/actions/channelActions";
import { adminAddDiscussionMember } from "../../../store/actions/admin-discussion-action";
import Suggestions from "./Suggestions";
import { cleanUserListState } from "../../../store/actions/user-actions";
import CommonUtils from "../../utils/common-utils";
import debounce from "lodash/debounce";
import ChannelConstants from "../../../constants/channel/channel-constants";
import Close from "../../../assets/icons/close.svg";
import { Button } from "../../shared/styles/mainframe.style";
import constUserType from "../../../constants/user/user-type";
import InviteMemberSelect from "../../project/invite-member-select";

const hasDecision = true;
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "post__tags__background__hover";
const textColorNormal = "post__tags__color";
const textColorHovered = "post__tags__color__hover";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";
let finalUserMemberList = [];
function AddPeopleModal(props) {
  const [show, setShow] = useState(props.show);
  const channel = props.channel;
  const [count, setCount] = useState(channel.name.length);
  const [isExternalToGuest, setIsExternalToGuest] = useState(false);
  const [isGuestToExternal, setIsGuestToExternal] = useState(false);

  const [inputs, setInputs] = useState({
    email: channel.otherUserEmail ? channel.otherUserEmail : "",
  });
  const { email } = inputs;
  const { t } = useTranslation();

  const [isValidEmail, setValidEmail] = useState(true);

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const addingMember = useSelector(
    (state) => state.ChannelMemberReducer.addingMember
  );
  const addedMember = useSelector(
    (state) => state.ChannelMemberReducer.addedMember
  );
  const addMemberApiError = useSelector(
    (state) => state.ChannelMemberReducer.addMemberApiError
  );
  const addMemberDuplicateEmailError = useSelector(
    (state) => state.ChannelMemberReducer.user
  );
  const creatingChannel = useSelector(
    (state) => state.ChannelReducer.creatingChannel
  );
  const createdChannel = useSelector(
    (state) => state.ChannelReducer.createdChannel
  );
  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );
  const [checkGuestUser, setCheckGuestUser] = useState(false);
  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const userTypeData = useSelector((state) => state.ChannelReducer.getUserType);
  const userType = userTypeData ? userTypeData.member_type : "";
  const [invitedMemberTemp, setInvitedMemberTemp] = useState([]);
  const memberList = useSelector(
    (state) => state.memberDetailsReducer?.memberData
  );
  let [userTypeCount, setUserTypeCount] = useState(53);

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
    setMemberCID(
      userTypeData &&
        userTypeData.member_type === "EXTERNAL" &&
        userTypeData.Ent.length === 1
        ? userTypeData.Ent[0].cid
        : ""
    );
  }, [userTypeData]);

  useEffect(() => {
    if (
      (addedMember ||
        (createdChannel && channel.type === ChannelType.DIRECT_CHANNEL)) &&
      addMemberDuplicateEmailError?.data?.errData?.length ===
        finalUserMemberList?.length
    ) {
      finalUserMemberList = [];
    } else if (
      (addedMember ||
        (createdChannel && channel.type === ChannelType.DIRECT_CHANNEL)) &&
      addMemberDuplicateEmailError?.data?.errData?.length !==
        finalUserMemberList?.length
    ) {
      finalUserMemberList = [];
      handleClose();
      if (addMemberDuplicateEmailError?.data?.errData?.length) {
        dispatch(showToast(t("addPeople.modal:add.partial"), 3000));
      }

      // dispatch(showToast(addMemberDuplicateEmailError?.data?.errData?.Data?.memberEmail, 3000));
      // if (addedMember) {
      //   GetChannelMemberAction(props.channel.id,dispatch);
      // }
    }
  }, [addedMember, createdChannel]);
  // const handleEmail = (value) => {
  //   //if (createChannelApiError) {
  //   //  dispatch(resetCreateChannelAction());
  //   //}
  //   if (addMemberApiError) {
  //     dispatch(ChannelMemberActions.resetAddChannelMember());
  //   }
  //   if (addMemberDuplicateEmailError) {
  //     dispatch(ChannelMemberActions.resetAddChannelMember());
  //   }
  //
  //   setInputs((inputs) => ({ ...inputs, email: value.replace(/\s/g, "") }));
  //   // if (name === "email") {
  //   if (CommonUtils.isValidEmail(value)) {
  //     setValidEmail(true);
  //     handleUserType(value);
  //     setHasValidEmail(true);
  //     setFetchingUser(true);
  //     setFetchedUserType(false);
  //     setTimeout(() => {
  //       setFetchingUser(false);
  //       setFetchedUserType(true);
  //     }, 1500);
  //   } else {
  //     setValidEmail(false);
  //     setHasValidEmail(false);
  //     setFetchingUser(false);
  //     setFetchedUserType(false);
  //   }
  //   // }
  // };

  // const addEmailToList = () => {
  //   const isAlreadyExists =
  //     memberList &&
  //     memberList.length > 0 &&
  //     memberList.some((el) => {
  //       return el.memberEmail === email && el.cid === memberCID;
  //     });
  //
  //   if (email && CommonUtils.isValidEmail(email) && isAlreadyExists === false) {
  //     setMemberList([
  //       ...memberList,
  //       { memberEmail: email, memberType: userType, cid: memberCID },
  //     ]);
  //     setInputs((inputs) => ({ ...inputs, email: "" }));
  //   } else {
  //     setInputs((inputs) => ({ ...inputs, email: "" }));
  //   }
  // };
  // const removeEmailFromList = (memberEmail, cid) => {
  //   let memberListArr = [...memberList];
  //   const indexToRemove = memberListArr.findIndex(
  //     (item) => item.memberEmail === memberEmail && item.cid === cid
  //   );
  //   const filteredMember = memberListArr.filter(
  //     (item, index) => index !== indexToRemove
  //   );
  //   setMemberList(filteredMember);
  // };

  function handleInvite(e) {
    e.preventDefault();
    setSubmitted(true);
    if (channel.type === "EXTERNAL" && userType === "GUEST") {
      setIsExternalToGuest(true);
    } else if (channel.type === "GUEST" && userType === "EXTERNAL") {
      setIsGuestToExternal(true);
    } else if (
      memberList.filter((e) => e.memberType === constUserType.GUEST).length >
        0 &&
      memberList.filter((e) => e.memberType === constUserType.EXTERNAL).length >
        0
    ) {
      setCheckGuestUser(true);
    } else {
      if (invitedMemberTemp.length > 0) {
        if (addMemberApiError) {
          dispatch(ChannelMemberActions.resetAddChannelMember());
        }
        if (addMemberDuplicateEmailError) {
          dispatch(ChannelMemberActions.resetAddChannelMember());
        }
        const channelBody = {};
        channelBody["channel_id"] = channel.id;
        channelBody.name = channel.name;
        channelBody["membersList"] = invitedMemberTemp;

        channelBody.membersList = channelBody.membersList.filter((item) => {
          return item.memberEmail !== "";
        });
        dispatch(
          ChannelMemberActions.addChannelMember(
            channel.id,
            channelBody,
            props.isAdmin
          )
        );
      }
    }
  }
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (memberList && memberList.length > 0) {
      const memberCanInvite = memberList.filter(
        ({ id: id1 }) =>
          !props?.currentMembers.some(({ id: id2 }) => id2 === id1)
      );
      const options = memberCanInvite?.map((item) => {
        return {
          value: item.email,
          label: item.screenName,
          companyName: item.companyName,
          userType: item.userType,
          cid: item.cid,
        };
      });
      setOptions(options);
    }
  }, [memberList]);
  const setMembersValue = (members) => {
    const membertoApi = members?.map((item) => {
      return {
        memberEmail: item.value,
        memberType: item.userType,
        cid: item.cid,
      };
    });
    setInvitedMemberTemp(membertoApi);
  };
  const handleClose = () => {
    finalUserMemberList = [];
    setShow(false);
    dispatch(cleanUserListState());
    dispatch(ChannelMemberActions.resetAddChannelMember());
    //dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal(ModalTypes.ADD_PEOPLE));
    //showSelected();
  };

  function updateCount(e) {
    channel.name = e.target.value;
    setCount(e.target.value.length);
  }

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      className="create-channel-modal"
      centered
    >
      {isExternalToGuest && (
        <div className="custom-alert-modal">
          <Alert variant="danger">
            {t("addPeople.modal:guest.member.cant.be.added")}
          </Alert>
        </div>
      )}
      {isGuestToExternal && (
        <div className="custom-alert-modal">
          <Alert variant="danger">
            {t("addPeople.modal:external.member.cant.be.added")}
          </Alert>
        </div>
      )}
      {checkGuestUser && (
        <div className="custom-alert-modal">
          <Alert variant="danger">
            {t("addPeople.modal:guest.external.member.cant.be.added")}
          </Alert>
        </div>
      )}
      <ModalHeader style={{ padding: "30px 30px 28px 30px!important" }}>
        <div className="d-flex w-100 align-items-center">
          <span
            style={{
              fontSize: "16px",
              lineHeight: "134%",
              color: "rgba(0, 0, 0, 0.9)",
            }}
          >
            Add Members
          </span>
          {/* <span
            style={{
              fontSize: "10px",
              color: "#ffffff",
              lineHeight: "12px",
              padding: "3px",
              borderRadius: "50%",
              backgroundColor: "#7AC448",
              marginLeft: "15px",
            }}
          >
            {userTypeCount}
          </span> */}
        </div>
      </ModalHeader>
      <Modal.Body>
        <Form name="form">
          <div className="row">
            <div className="col-12">
              <div className="form-wrapper">
                <InviteMemberSelect
                  setMembersValue={setMembersValue}
                  options={options}
                  setUserTypeCount={setUserTypeCount}
                  userTypeCount={userTypeCount}
                />
              </div>
            </div>
          </div>
          <div className="add-people-button">
            <button
              onClick={
                (memberList && memberList.length > 0) ||
                (fetchedUserType && hasValidEmail)
                  ? handleInvite
                  : undefined
              }
              className={`btn  ${
                ((memberList && memberList.length) ||
                  (fetchedUserType && hasValidEmail)) > 0
                  ? "active-save-btn btn-primary"
                  : "disabled-save-btn btn-light"
              }`}
            >
              {(addingMember || creatingChannel) && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Add
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPeopleModal;
