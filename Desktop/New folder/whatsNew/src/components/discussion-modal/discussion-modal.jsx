import React, {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import close from "../../assets/icons/close.svg";
import {useTranslation} from "react-i18next";
import "./discussion-modal.css";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import CollectionServices from "../../services/collection-services";
import {CircularProgress, FormControl, FormControlLabel, InputLabel} from "@material-ui/core";
import CollectionSelectList from "./collection-select-list";
import {Alert} from "@material-ui/lab";
import {collectionConstants} from "../../constants/collection";
import StatusCode from "../../constants/rest/status-codes";

function DiscussionModal(props) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {action, channelId, activeCollectionId, setDeleteList} = props
    const collectionData = useSelector(state => state.CollectionReducer?.collectionData);
    const {collections = []} = collectionData
    const [show, setShow] = useState(props.show);
    const [isDisabled, setIsDisabled] = useState(false);
    const [errors, setErrors] = useState([])

    const collectionsList = useMemo(() => {
        return collections.filter(collection => collection.id !== "ALL").filter(collection => collection.id !== activeCollectionId)
    }, [collections])
    const [firstCollection] = collectionsList
    const collectionId = firstCollection?.id
    const defaultValue = action === "move" ? collectionId: []
    const [value, setValue] = useState(defaultValue)
    const removeActiveClass = () => {
        const discussionBodyItem = document.querySelectorAll(".discussion-list-body-item.active")
        if (discussionBodyItem){
            for (let i = 0; i < discussionBodyItem.length; i++) {
                const item = discussionBodyItem[i]
                item.classList.remove("active")
            }
        }
    }
    const onClose = () => {
        setShow(false);
        dispatch(ModalActions.hideModal(ModalTypes.DISCUSSION_MODAL_SHOW));
        removeActiveClass()
    };
    const hidePopup = () => {
        setShow(false);
        dispatch(ModalActions.hideModal(ModalTypes.DISCUSSION_MODAL_SHOW));
        setIsDisabled(false);
        removeActiveClass()
    }
    const handleSendAction = async () => {
        setIsDisabled(true)
        setErrors([])
        const data = {
            action: action.toUpperCase(),
            oldCollection: activeCollectionId,
        }
        let isCanSend
        if (action === collectionConstants.ACTION_MOVE && activeCollectionId !== collectionConstants.COLLECTION_ALL_ID){
            data.collectionList = [value]
            isCanSend = true
        }else if (action === collectionConstants.ACTION_DUPLICATE){
            data.collectionList = value
            isCanSend = true
        }
        if (isCanSend){
            const result = await CollectionServices.moveOrDuplicateDiscussionToCollection(channelId, data);
            const {code, message} = result;
            if (action === collectionConstants.ACTION_MOVE){
                if (code === StatusCode.COMMON_SUCCESS || code === StatusCode.COLLECTION_ACTION_SUCCESS){
                    setDeleteList(prevState => {
                        return [channelId, ...prevState]
                    })
                }
            }

            if (code === StatusCode.COLLECTION_ACTION_ERROR){
                setIsDisabled(false)
                return setErrors(prevState => {
                    return [t(`discussion:collection:error:exits`), ...prevState]
                })
            }else if (code === StatusCode.COMMON_ERROR){
                setIsDisabled(false)
                return setErrors(prevState => {
                    return [message, ...prevState]
                })
            }
        }
        hidePopup()
    }
    const handleChange = (e) => {
        const collectionId = e?.target?.value
        if (!collectionId){
            return
        }
        setValue(collectionId);
        setErrors([])
    }

    const handleSelect = (collectionId) => {
        setValue(prevState => {
            return prevState.includes(collectionId) ? prevState.filter(id => id !== collectionId): [collectionId, ...prevState]
        })
        setErrors([])
    }
    const selectedCollection = useMemo(() => {
        return collectionsList.filter(collection => value.includes(collection.id))
    }, [value])

    return (
        <Modal
            className="discussion-modal"
            show={show}
            centered
        >
            <Modal.Header className="m-pad">
                <Modal.Title closeButton>
                    {t(`discussion:collection:header:${action}`)}
                    <img src={close} alt="subtract" onClick={onClose} className="cross-image"/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="m-pad">
                <div className="collection-modal-form">
                    <label>Collection Name</label>
                    <FormControl className="form-control">
                        <CollectionSelectList
                            value={value}
                            handleChange={handleChange}
                            action={action}
                            handleSelect={handleSelect}
                            collectionsList={collectionsList}
                            selectedCollection={selectedCollection}
                            className="collection-list-input"
                        />

                    </FormControl>

                    {(selectedCollection.length > 0 && action === "duplicate") &&  (<FormControl className="d-flex form-selected-wrapper">
                            <div className="collection-selected-wrapper">
                                {selectedCollection.map(collection => {
                                    return (
                                        <div key={collection.id} className="collection-item d-flex justify-content-between">
                                            <div className="collection-item-name">
                                                {collection.name}
                                            </div>
                                            <div className="collection-item-remove">
                                                <img src={close} alt="subtract" onClick={() => handleSelect(collection.id)} className="remove-collection"/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                    </FormControl>)}
                    <FormControl>
                        {errors.map((error, index) =>{
                            return (
                                <Alert key={index} severity="error">{error}</Alert>
                            )
                        })}
                    </FormControl>
                </div>
            </Modal.Body>
            <Modal.Footer className="m-pad">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="footer-buttons"
                >
                    {t(`discussion:collection:button:cancel`)}
                </Button>
                <Button
                    variant="primary"
                    className="footer-buttons"
                    disabled={isDisabled}
                    onClick={handleSendAction}
                >
                    {isDisabled && ( <CircularProgress color="inherit" style={{width: 15, height: 15, marginRight: 5}} />)}
                    {t(`discussion:collection:button:${action}`)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DiscussionModal;
