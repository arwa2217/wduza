import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  saveDiscussionData,
  adminDeleteDiscussionData,
  fetchDiscussionData,
} from "./../../../store/actions/admin-discussion-action";
import DeleteDiscussionModal from "../../../components/modal/discussion/delete-discussion-modal";
const USER_NAME_MAX_LENGTH = 64;
import { showToast } from "./../../../store/actions/toast-modal-actions";
export default function DiscussionInformation() {
  const fetchedDiscussionData = useSelector(
    (state) => state.config.adminSelectedRow
  );

  const [currentData, setCurrentData] = useState({
    ...fetchedDiscussionData,
  });
  const discussionFilterObj = useSelector(
    (state) => state.AdminDiscussionReducer.discussionFilterObj
  );
  const [showDeleteDiscussionModal, setShowDeleteDiscussionModal] =
    useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(currentData.isConfidential);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const nameRegex =
    /^[\u0000-\u0019\u0021-\uffff]+((?: {0,1}[\u0000-\u0019\u0021-\uffff]+)+)*$/;
  const USER_NAME_MAX_LENGTH = 64;

  useEffect(() => {
    if (
      currentData !== null &&
      fetchedDiscussionData !== null &&
      fetchedDiscussionData !== currentData
    ) {
      setCurrentData(fetchedDiscussionData);
    }
  }, [fetchedDiscussionData]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setCurrentData((currentData) => ({
      ...currentData,
      [name]: value.replace(/\s\s+/g, " "),
    }));
  };
  const handleOwnerChange = (e) => {
    let { name, value } = e.target;
    setCurrentData((currentData) => ({
      ...currentData,
      [name]: value.replace(/\s\s+/g, " "),
    }));
  };

  const setConfidentialEnabled = () => {
    setIsSwitchOn(!isSwitchOn);
    let { isConfidential } = currentData;
    setCurrentData((currentData) => ({
      ...currentData,
      isConfidential: !isConfidential,
    }));
  };

  const setAdvacedEnabled = () => {
    let { isAdvanced } = currentData;
    setCurrentData((currentData) => ({
      ...currentData,
      isAdvanced: !isAdvanced,
    }));
  };
  const setAdvancedDiscussionValue = (e, radioType) => {
    // let { isLockable, isDeletable } = currentData;
    if (radioType === "DELETED") {
      setCurrentData((currentData) => ({
        ...currentData,
        isDeletable: !e.target,
        isLockable: e.target,
      }));
    }
    if (radioType === "LOCKED") {
      setCurrentData((currentData) => ({
        ...currentData,
        isLockable: !e.target,
        isDeletable: e.target,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const { id, name, creator, status } = currentData;
    if (
      creator.toString().trim() &&
      nameRegex.test(creator.toString().trim()) &&
      name.toString().trim() &&
      nameRegex.test(name.toString().trim())
    ) {
      const response = await dispatch(saveDiscussionData(id, currentData));
      if (response.error) {
        dispatch(
          showToast(
            t("admin:discussion.management:error.message"),
            3000,
            "failure"
          )
        );
      } else {
        dispatch(fetchDiscussionData(discussionFilterObj));
        dispatch(
          showToast(
            t("admin:discussion.management:success.message"),
            3000,
            "success"
          )
        );
      }
    } else {
    }
  };

  const submitDelete = async (list) => {
    let reqSelectedList = list.map((value) => value.id);
    let requestBody = {
      channels: reqSelectedList,
    };
    if (reqSelectedList.length) {
      const response = await dispatch(adminDeleteDiscussionData(requestBody));
      if (response.payload.code === 2001) {
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            t(
              `admin:discussion.management:success.code:${response.payload.code}`
            ),
            3000,
            "success"
          )
        );
      } else if (response.payload.code === 2011) {
        let myList = [...list];
        let newList = [];
        myList.forEach((el) => {
          response.payload.data.forEach((element) => {
            if (element.channelID === el.id) {
              let newObj = {
                id: el.id,
                errCode: element.errCode,
                channelName: el.name,
              };
              newList.push(newObj);
            }
          });
        });
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            newList.map((el) => (
              <span className="d-flex" key={el.id}>
                {el.channelName}
                {" - "}
                {t(`admin:discussion.management:error.code:${el.errCode}`)}
              </span>
            )),
            3000,
            "failure"
          )
        );
      }
    }
  };

  return (
    <div className="w-100 pd-20 border-top">
      <Form className="custom-sidebar-form">
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            maxLength={USER_NAME_MAX_LENGTH}
            value={currentData.name}
            onChange={handleChange}
            onInput={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Owner</Form.Label>
          <Form.Control
            type="text"
            name="owner"
            value={currentData.creator}
            onChange={handleOwnerChange}
            onInput={handleOwnerChange}
            maxLength={USER_NAME_MAX_LENGTH}
            // className={
            //   "form-control" +
            //   ((submitted && !currentUser.screenName.toString().trim()) ||
            //   (submitted &&
            //     !nameRegex.test(currentUser.screenName.toString().trim()))
            //     ? " is-invalid"
            //     : "")
            // }
          />
        </Form.Group>
        <Form.Group className="d-flex align-items-center justify-content-between switch-group">
          <Form.Label>Confidential</Form.Label>
          <Form.Check
            type="switch"
            id="custom-switch"
            label=""
            checked={currentData.isConfidential}
            onChange={() => {
              setConfidentialEnabled();
            }}
          />
        </Form.Group>
        <Form.Group
          className="d-flex align-items-center justify-content-between switch-group"
          style={currentData.isAdvanced ? { marginBottom: "15px" } : {}}
        >
          <Form.Label>Advanced</Form.Label>
          <Form.Check
            type="switch"
            id="advance-switch"
            label=""
            checked={currentData.isAdvanced}
            onChange={() => {
              setAdvacedEnabled();
            }}
          />
        </Form.Group>
        {currentData.isAdvanced && (
          <>
            <Form.Group style={{ marginBottom: "15px" }}>
              <div className="custom-radio">
                <input
                  type="radio"
                  id="locked"
                  name="advancedType"
                  checked={currentData.isLockable}
                  onChange={(e) => {
                    setAdvancedDiscussionValue(e, "LOCKED");
                  }}
                />
                <label htmlFor="locked">Locked</label>
              </div>
            </Form.Group>
            <Form.Group>
              <div className="custom-radio">
                <input
                  type="radio"
                  id="deleted"
                  name="advancedType"
                  checked={currentData.isDeletable}
                  onChange={(e) => {
                    setAdvancedDiscussionValue(e, "DELETED");
                  }}
                />
                <label htmlFor="deleted">Deleted</label>
              </div>
            </Form.Group>
          </>
        )}
        <div className="d-flex justify-content-between custom-form-actions">
          <Button
            variant="outline-primary"
            style={{ width: "calc(50% - 5px)" }}
          >
            {t("button:delete")}
          </Button>
          <Button
            variant="primary"
            style={{ width: "calc(50% - 5px)" }}
            onClick={currentData.status === "DELETED" ? null : handleSubmit}
          >
            {t("button:save")}
          </Button>{" "}
        </div>
      </Form>
      <DeleteDiscussionModal
        showModal={showDeleteDiscussionModal}
        onSubmit={() => submitDelete([currentData])}
        discussionCount={1}
        closeModal={() => {
          setShowDeleteDiscussionModal(false);
        }}
      />
    </div>
  );
}
