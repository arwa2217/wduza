import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { FormHelperText, TextField } from "@material-ui/core";
import DefaultUser from "@icons/default-user.svg";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import {
  refreshContactData,
  refreshContactImage,
} from "../../store/actions/mail-summary-action";
import ContactImagePreview from "./contactImagePreview";
import services from "../../outlook/apiService";
import OutLookLoading from "../outlook-shared/OutLookLoading";
function ContactModalEdit(props) {
  const { t, i18n } = useTranslation();
  const { show, handleClose, contactId, action, photo, randomColor } = props;
  const [currentContact, setCurrentContact] = useState({});
  const focusElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (show) {
      const getProfile = async () => {
        setLoading(true);
        const result = await services.getContactProfile(contactId);
        setCurrentContact(result);
        setLoading(false);
      };
      try {
        getProfile();
      } catch (e) {}
    } else {
      setErrors({});
    }
  }, [contactId, show]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentContact({
      ...currentContact,
      [name]: value,
    });
    if (name === "emailAddresses") {
      const contact = { ...currentContact };
      contact.emailAddresses[0].address = value;
      setCurrentContact(contact);
    }
    if (value === "" && name === "displayName") {
      setErrors({
        ...errors,
        [name]: `${name} is required!`,
      });
    } else {
      const errorState = { ...errors };
      delete errorState[name];
      setErrors(errorState);
    }
  };
  const dataURItoBlob = (dataURI) => {
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };
  const handlePhotoChange = (e) => {
    setCurrentFile(dataURItoBlob(e));
  };
  const handleEdit = async (event) => {
    if (!Object.keys(errors).length) {
      try {
        setLoadingEdit(true);
        await services.updateContact(currentContact.id, currentContact);
        dispatch(refreshContactData(true));
        setLoadingEdit(false);
        handleClose();
      } catch (e) {}
      if (currentFile) {
        await services.updateContactPhoto(currentContact.id, currentFile);
        dispatch(
          refreshContactImage({
            id: currentContact.id,
            isUpdate: true,
          })
        );
      }
    }
  };
  return (
    <Modal
      show={show}
      className="members-profile"
      onHide={() => {
        setCurrentFile("");
        handleClose();
      }}
      animation={false}
    >
      {loading ? (
        <div className="d-flex w-100 pb-3 justify-content-center align-items-center">
          <OutLookLoading />
        </div>
      ) : (
        <>
          {loadingEdit ? (
            <div
              className="d-flex w-100 pb-3 justify-content-center align-items-center"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <OutLookLoading />
            </div>
          ) : null}
          <Modal.Header closeButton>
            <Modal.Title>{t("user.profile:profile")} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="member-info contact-info d-flex">
              {action === "edit" ? (
                <ContactImagePreview
                  src={photo ? photo : DefaultUser}
                  handleChange={handlePhotoChange}
                />
              ) : photo ? (
                <img
                  style={{
                    width: "140px",
                    height: "140px",
                    marginRight: "50px",
                  }}
                  src={photo ? photo : DefaultUser}
                  alt="user-pic"
                />
              ) : (
                <div
                  className="user-image"
                  style={{
                    borderRadius: "5px",
                    color: "var(--white)",
                    fontSize: "42px",
                    fontWeight: "600",
                    lineHeight: "100px",
                    backgroundColor: `#${randomColor}`,
                  }}
                >
                  {currentContact.displayName ? (
                    <span>
                      {currentContact.displayName.toUpperCase().slice(0, 1)}
                    </span>
                  ) : null}
                </div>
              )}

              {action === "edit" ? (
                <div className="pl-4 member-desc">
                  <TextField
                    fullWidth
                    className="displayName"
                    variant="standard"
                    ref={focusElement}
                    value={
                      currentContact?.displayName
                        ? currentContact.displayName
                        : ""
                    }
                    onChange={handleChange}
                    placeholder={t("email-contact:name")}
                    name="displayName"
                    style={{ fontSize: "20px" }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <FormHelperText error={!!errors.displayName}>
                    {errors.displayName}
                  </FormHelperText>
                  <TextField
                    fullWidth
                    className="user_name"
                    variant="standard"
                    value={
                      currentContact?.jobTitle ? currentContact.jobTitle : ""
                    }
                    onChange={handleChange}
                    placeholder={t("mail-contact:jobTitle")}
                    name="jobTitle"
                    style={{ fontSize: "20px" }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <FormHelperText error={!!errors.jobTitle}>
                    {errors.jobTitle}
                  </FormHelperText>
                  <TextField
                    fullWidth
                    className="user_name"
                    variant="standard"
                    placeholder={t("email-contact:company")}
                    value={
                      currentContact?.companyName
                        ? currentContact.companyName
                        : ""
                    }
                    onChange={handleChange}
                    name="companyName"
                    style={{ fontSize: "20px" }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <FormHelperText error={!!errors.companyName}>
                    {errors.companyName}
                  </FormHelperText>
                  <p className="user_email">
                    {currentContact?.emailAddresses
                      ? currentContact.emailAddresses[0].address
                      : ""}
                  </p>
                  <TextField
                    fullWidth
                    className="user_name"
                    variant="standard"
                    placeholder={t("email-contact:phone")}
                    value={
                      currentContact?.mobilePhone
                        ? currentContact.mobilePhone
                        : ""
                    }
                    onChange={handleChange}
                    name="mobilePhone"
                    style={{ fontSize: "20px" }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <FormHelperText error={!!errors.mobilePhone}>
                    {errors.mobilePhone}
                  </FormHelperText>
                  <div className="contact-action-buttons pt-3">
                    <Button
                      onClick={() => {
                        setCurrentFile("");
                        handleClose();
                      }}
                    >
                      {t("email-contact:cancel")}
                    </Button>
                    <Button className="ml-2" onClick={handleEdit}>
                      {t("email-contact:save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pl-2 member-desc">
                  <span className="user_name" style={{ fontSize: "16px" }}>
                    {currentContact?.displayName
                      ? currentContact.displayName
                      : "-"}
                  </span>
                  {currentContact?.jobTitle ? (
                    <span className="user_company">
                      {currentContact.jobTitle}
                    </span>
                  ) : null}

                  {currentContact?.companyName ? (
                    <span className="affiliation-info">
                      {currentContact.companyName}
                    </span>
                  ) : null}
                  {currentContact?.emailAddresses ? (
                    <span className="user_email">
                      {currentContact.emailAddresses[0].address}
                    </span>
                  ) : null}
                  {currentContact?.mobilePhone ? (
                    <span className="user_email">
                      {currentContact.mobilePhone}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}
export default ContactModalEdit;
