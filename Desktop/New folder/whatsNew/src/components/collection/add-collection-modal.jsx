import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, { useEffect } from "react";
import "./add-collection-modal.css";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import MailTextField from "../outlook-shared/mail-text-field";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import CollectionServices from "../../services/collection-services";
function AddCollectionModal(props) {
  const { t } = useTranslation();
  const { show, handleClose } = props;
  const formik = useFormik({
    initialValues: {
      collectionName: "",
    },
    validationSchema: Yup.object({
      collectionName: Yup.string().required(`Collection name is required`),
    }),
    onSubmit: async (values, { resetForm }) => {
      const collection = {
        name: values.collectionName,
        description: `Create ${values.collectionName}`,
      };
      const result = await CollectionServices.createCollection(collection);
      formik.setFieldError("collectionName", result?.message.split(".")[1]);
      if (result.data) {
        resetForm();
        handleClose();
      }
    },
  });
  return (
    <Modal
      show={show}
      className="discussion-modal collection-modal"
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="collection-modal-title">
          New Collection
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="add-contact-form" onSubmit={formik.handleSubmit}>
          <MailTextField
            placeholder={"Enter collection name"}
            name="collectionName"
            value={formik.values.collectionName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            title={"Enter new name for new collection"}
            error={formik.errors.collectionName}
            isRequired={true}
          />
          <div className="add-collection-button justify-content-end d-flex pt-4">
            <Button className="ml-2 btn-sm" type="submit">
              Create Collection
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default AddCollectionModal;
