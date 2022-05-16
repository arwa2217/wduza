import React, { useEffect, useState } from "react";
import "../channel-details/channel-details.css";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { postEmailType } from "../../outlook/config";
import DefaultUser from "../../assets/icons/default-user.svg";
import SendEmailInContact from "../../assets/icons/post2.svg";
import ContactEditIcon from "../../assets/icons/contact-edit.svg";
import DeleteContactIcon from "../../assets/icons/delete-contact.svg";
import ContactModalEdit from "./contact-modal-edit";
import DeleteWarningPopup from "./delete-warning-popup";

import {
  setContactSenderEmail,
  setEnableWriteEmail,
  setPostEmailType,
  setSendEmailType,
} from "../../store/actions/outlook-mail-actions";
import { setEditorFocus } from "../../utilities/outlook";
import { useDispatch, useSelector } from "react-redux";
import services from "../../outlook/apiService";
import { refreshContactImage } from "../../store/actions/mail-summary-action";
import { Skeleton } from "@material-ui/lab";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import CheckboxCustom from "../../assets/icons/check-box.svg";
import { withStyles } from "@material-ui/core/styles";
const ChannelMemberStyle = styled.div`
  display: flex;
  align-items: center;
  // margin: 0 16px;
  overflow: hidden;
  // padding: 9.5px 0;
  width: 100%;

  > img {
    width: 20px;
    height: 20px;
  }
  > p {
    width: 150px;
    margin: 0;
    margin-bottom: 0;
  }
  > button {
    justify-self: flex-end;
  }
`;
const checkBoxStyles = () => ({
  root: {
    "&$checked": {
      color: "#03BD5D",
    },
    borderRadius: 0,
  },
  checked: {},
});
const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

function ContactItem(props) {
  const { t, i18n } = useTranslation();
  const { contact, contactChecked, handleCheckContact } = props;
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const contactImageUpdate = useSelector(
    (state) => state.MailSummaryReducer.isImageUpdate
  );
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const [photo, setPhoto] = useState(null);
  const emailColors = localStorage.getItem("EMAIL_COLOR")
    ? JSON.parse(localStorage.getItem("EMAIL_COLOR"))
    : [];
  const emailAvatar = emailColors.find((item) => {
    return item.email === contact?.emailAddresses[0]?.address;
  });
  const emailRegex = /^[^ ,@]+@[^ ,@]+$/;
  const handleShow = (event, action) => {
    event.stopPropagation();
    setShow(true);
    setAction(action);
  };
  const handleCloseWarning = () => setShowWarning(false);
  const getPhoto = async () => {
    setImageLoading(true);
    try {
      const result = await services.getContactPhoto(contact.id);
      const link = URL.createObjectURL(result);
      setPhoto(link);
    } catch (e) {
    } finally {
      setImageLoading(false);
    }
  };
  useEffect(() => {
    if (contact) {
      try {
        getPhoto();
      } catch (e) {}
    }
  }, [contact]);
  useEffect(() => {
    if (
      contactImageUpdate.isUpdate === true &&
      contact.id === contactImageUpdate.id
    ) {
      getPhoto();
      dispatch(
        refreshContactImage({
          id: "",
          isUpdate: false,
        })
      );
    }
  }, [contact, contactImageUpdate]);
  const handleDeleteContact = (event) => {
    event.stopPropagation();
    setShowWarning(true);
  };
  const handleMailSendInContact = (event, email, name) => {
    event.stopPropagation();
    dispatch(setPostEmailType(postEmailType.newEmail));
    setEditorFocus(postEmailType.newEmail);
    dispatch(setEnableWriteEmail(true));
    dispatch(setSendEmailType(""));
    dispatch(
      setContactSenderEmail({
        type: "contact",
        email: email,
        name: name ? name : email,
      })
    );
  };
  return (
    <ChannelMemberStyle>
      <div
        className="member-wrapper contact-wrapper"
        onClick={(event) => handleShow(event, "show")}
      >
        <CustomCheckbox
          icon={
            <img
              src={CheckboxCustom}
              alt={"check-box"}
              style={{ marginTop: "3px" }}
            />
          }
          onClick={handleCheckContact}
          color="primary"
          checked={contactChecked.includes(contact.id)}
          value={contact.id}
          className={`check-mail-item ${
            contactChecked.length > 0 ? "has-checked" : ""
          }`}
        />
        <div
          className="member-info"
          style={{
            width: "calc(100% - 110px)",
          }}
        >
          {imageLoading ? (
            <Skeleton animation="wave" variant="rect" width={40} height={40} />
          ) : (
            !contactChecked.includes(contact.id) && (
              <img
                src={photo ? photo : DefaultUser}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "5px",
                }}
                alt="user-pic"
              />
            )
          )}
          <div
            className="pl-2"
            style={{
              width: "calc(100% - 34px)",
            }}
          >
            <span
              className="member-text contact-text"
              style={{
                verticalAlign: "top",
                fontWeight: "400",
                marginBottom: 0,
                paddingLeft: 0,
                color: "#19191A",
                fontSize: "15px",
                display: "block",
              }}
              title={contact.displayName ? contact.displayName : ""}
            >
              {contact.displayName}
            </span>
            <span
              className="member-text contact-text"
              style={{
                verticalAlign: "top",
                fontWeight: "400",
                color: "#999999",
                fontSize: "12px",
                marginBottom: 0,
                paddingLeft: 0,
              }}
              title={
                contact.emailAddresses ? contact.emailAddresses[0]?.address : ""
              }
            >
              {contact.emailAddresses &&
              emailRegex.test(contact.emailAddresses[0]?.address)
                ? contact.emailAddresses[0]?.address
                : ""}
            </span>
          </div>
        </div>
        <div className="contact-action">
          <img
            src={SendEmailInContact}
            // className="contact-send-email"
            alt="contact-send-email"
            onClick={(event) =>
              handleMailSendInContact(
                event,
                contact?.emailAddresses[0]?.address,
                contact?.emailAddresses[0]?.name
              )
            }
          />
          <img
            src={ContactEditIcon}
            alt="contact-edit"
            onClick={(event) => handleShow(event, "edit")}
          />
          <img
            src={DeleteContactIcon}
            alt="delete-contact"
            onClick={handleDeleteContact}
          />
        </div>
      </div>
      <ContactModalEdit
        photo={photo}
        show={show}
        action={action}
        handleClose={handleClose}
        contactId={contact.id}
      />
      <DeleteWarningPopup
        handleCloseWarning={handleCloseWarning}
        showWarning={showWarning}
        contactId={contact.id}
        contactName={contact.displayName}
      />
    </ChannelMemberStyle>
  );
}

export default ContactItem;
