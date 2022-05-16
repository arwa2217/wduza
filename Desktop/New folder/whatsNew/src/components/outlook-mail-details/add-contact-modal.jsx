import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { refreshContactData } from "../../store/actions/mail-summary-action";
import { useFormik } from "formik";
import * as Yup from "yup";
import MailTextField from "../outlook-shared/mail-text-field";
import { useTranslation } from "react-i18next";
import DefaultUser from "../../assets/icons/image-none.png";
import ContactAddImagePreview from "./contactAddImagePreview";
import CloseWhite from "../../assets/icons/close-white.svg";
import services from "../../outlook/apiService";
import OutLookLoading from "../outlook-shared/OutLookLoading";
function AddContactModal(props) {
  const { t, i18n } = useTranslation();
  const { showAdd, handleCloseAdd } = props;
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const dispatch = useDispatch();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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
    setCurrentImage(e);
    setAvatar(dataURItoBlob(e));
  };
  const handleRemoveImage = (e) => {
    setCurrentImage("");
    setAvatar("");
  };
  const formik = useFormik({
    initialValues: {
      givenName: "",
      companyName: "",
      emailAddresses: "",
      mobilePhone: "",
      jobTitle: "",
    },
    validationSchema: Yup.object({
      givenName: Yup.string().required(
        `${t("email-validate:givenName.required")}`
      ),
      emailAddresses: Yup.string()
        .email(`${t("email-validate:email.notValid")}`)
        .required(`${t("email-validate:email.required")}`),
      mobilePhone: Yup.string().matches(
        phoneRegExp,
        `${t("email-validate:phone.notValid")}`
      ),
    }),
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      setLoadingAdd(true);
      const response = await services.emailCheck(values.emailAddresses);
      if (response.value.length) {
        formik.errors.emailAddresses = `${t(
          "email-validate:email.alreadyExits"
        )}`;
      }
      if (values.mobilePhone !== "") {
        const response2 = await services.phoneCheck(values.mobilePhone);
        if (response2.value.length) {
          formik.errors.mobilePhone = `${t(
            "email-validate:phone.alreadyExits"
          )}`;
        }
      }
      setLoadingAdd(false);

      if (!Object.keys(formik.errors).length) {
        const addObject = {
          givenName: formik.values.givenName,
          emailAddresses: [
            {
              address: formik.values.emailAddresses,
              name: formik.values.emailAddresses,
            },
          ],
          mobilePhone: formik.values.mobilePhone,
          jobTitle: formik.values.jobTitle,
          companyName: formik.values.companyName,
        };
        try {
          setLoadingAdd(true);
          const result = await services.addContact(addObject);
          if (result && avatar) {
            await services.updateContactPhoto(result.id, avatar);
          }
          setLoadingAdd(false);
          setAvatar("");
          setCurrentImage("");
          handleCloseAdd();
          resetForm({ values: "" });
          dispatch(refreshContactData(true));
        } catch (e) {}
      }
    },
  });
  return (
    <Modal
      show={showAdd}
      className="members-profile add-contact-modal"
      onHide={() => {
        setCurrentImage("");
        setAvatar("");
        handleCloseAdd();
      }}
      animation={false}
    >
      {loadingAdd ? (
        <div
          className="d-flex w-100 pb-3 justify-content-center align-items-center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1",
          }}
        >
          <OutLookLoading />
        </div>
      ) : null}
      <Modal.Header closeButton>
        <Modal.Title className="text-black-50">
          {t("email-contact:add.contact")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="add-contact-form" onSubmit={formik.handleSubmit}>
          <div className="avatar-section position-relative d-flex justify-content-center">
            <ContactAddImagePreview
              src={currentImage ? currentImage : DefaultUser}
              handleChange={handlePhotoChange}
            />
            {currentImage ? (
              <img
                className="delete-image"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "60px",
                }}
                src={CloseWhite}
                alt="remove"
                onClick={handleRemoveImage}
              />
            ) : null}
          </div>
          <MailTextField
            placeholder={t("email-contact:name")}
            name="givenName"
            value={formik.values.givenName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={t("email-contact:name")}
            error={formik.errors.givenName}
            isRequired={true}
          />
          <MailTextField
            placeholder={t("email-contact:email")}
            name="emailAddresses"
            value={formik.values.emailAddresses}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={t("email-contact:email")}
            error={formik.errors.emailAddresses}
            isRequired={true}
          />
          <MailTextField
            placeholder={t("email-contact:company")}
            name="companyName"
            value={formik.values.companyName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={t("email-contact:company")}
            error={formik.errors.companyName}
            isRequired={false}
          />
          <MailTextField
            placeholder={t("email-contact:phone")}
            name="mobilePhone"
            value={formik.values.mobilePhone}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={t("email-contact:phone")}
            error={formik.errors.mobilePhone}
            isRequired={false}
          />
          <MailTextField
            placeholder={t("mail-contact:jobTitle")}
            name="jobTitle"
            value={formik.values.jobTitle}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={t("mail-contact:jobTitle")}
            error={formik.errors.jobTitle}
            isRequired={false}
          />
          <div className="add-contact-buttons pt-4">
            <Button
              className="cancel-add-contact"
              onClick={() => {
                setCurrentImage("");
                setAvatar("");
                handleCloseAdd();
              }}
            >
              {t("email-contact:cancel")}
            </Button>
            <Button style={{ marginLeft: "10px" }} type="submit">
              {t("email-contact:add.contact")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default AddContactModal;
