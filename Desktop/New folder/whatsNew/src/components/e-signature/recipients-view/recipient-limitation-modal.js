
import React,  {useState} from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const RecipientLimitationModal = (props) => {
    const [show, setShow] = useState(props.show);
    const { t } = useTranslation();
    const cancelHandler = () => {
        setShow(false);
        props.cancel();
    }
    const okHandler = () => {
        // navigate here
        props.okay();
        setShow(false)
    }
    return (
        <Modal show={show} centered>
            <Modal.Header className="leave-modal-header">
                <Modal.Title className="leave-modal-title">{t('esign:recipients:limitation:message')}</Modal.Title>
            </Modal.Header>
            <Modal.Footer className="leave-modal-footer">
                {/* <Button className="leave-modal-cancel" onClick={cancelHandler}>{t('esign:recipient:cancel')}</Button> */}
                <Button className="leave-modal-submit" onClick={okHandler}>{t('esign:recipient:ok')}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RecipientLimitationModal;