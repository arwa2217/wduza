import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import "./collection-modal.css";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import close from "../../assets/icons/close.svg";
import MailTextField from "../outlook-shared/mail-text-field";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import CollectionServices from "../../services/collection-services";
import {addSelectedCollectionClass, removeSelectedCollectionClass} from "../utils/collection";
function CollectionModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [show, setShow] = useState(props.show);
  const { collectionItem } = props;
  const formik = useFormik({
    initialValues: {
      collectionName: "",
    },
    validationSchema: Yup.object({
      collectionName: Yup.string().required(`Collection name is required`),
    }),
    onSubmit: async (values, { resetForm }) => {
      const collectionUpdate = {
        name: formik.values.collectionName,
        description: `rename collection to ${formik.values.collectionName}`,
      };
      const result = await CollectionServices.updateCollection(
        collectionUpdate,
        collectionItem.id
      );
      formik.setFieldError("collectionName", result?.message.split(".")[1]);
      if (result.data) {
        hidePopup();
        resetForm();
      }
    },
  });
  const onClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.COLLECTION_MODAL_SHOW));
    removeSelectedCollectionClass(".collection-menu-wrapper")
  };

  const hidePopup = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.COLLECTION_MODAL_SHOW));
    removeSelectedCollectionClass(".collection-menu-wrapper")
  };
  useEffect(() => {
    formik.setFieldValue("collectionName", collectionItem.name);
  }, [collectionItem]);
  const handleDeleteCollection = async () => {
    const result = await CollectionServices.deleteCollection(collectionItem.id);
    if (result.code === 2001) {
      hidePopup();
    }
  };
  useEffect(() => {
    if (show){
      // because onMouseLeave
      setTimeout(() => {
        addSelectedCollectionClass(".collection-menu-wrapper", collectionItem.id)
      })
    }
  },[show])
  return (
    <Modal
      className="discussion-modal collection-modal"
      show={show}
      onHide={onClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="collection-modal-title">
          {props.menuName} collection:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          className="add-contact-form rename-collection"
          onSubmit={formik.handleSubmit}
        >
          {props.menuName === "Rename" ? (
            <>
              <MailTextField
                placeholder={"Enter collection name to change"}
                name="collectionName"
                value={formik.values.collectionName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                title={"Enter new name for new collection to change"}
                error={formik.errors.collectionName}
                isRequired={true}
              />
              <div className="add-collection-button justify-content-end d-flex pt-4">
                <Button
                  className="ml-2 btn-sm"
                  type="submit"
                  disabled={
                    formik.values.collectionName === collectionItem.name
                  }
                >
                  Ok
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-black-50">
                  Are you sure want to delete {collectionItem.name} ?{" "}
                </p>
              </div>
              <div className="add-collection-button justify-content-end d-flex pt-4">
                <Button
                  className="ml-2 btn-sm"
                  type="button"
                  onClick={handleDeleteCollection}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CollectionModal;
