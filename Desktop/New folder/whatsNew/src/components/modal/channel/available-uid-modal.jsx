import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { useDispatch, useSelector } from "react-redux";
import CommonUtils from "../../utils/common-utils";
import Close from "../../../assets/icons/close.svg";
import UploadedFileIcon from "../../../assets/icons/uploaded-file.svg";
import { fetchAvailableUidData } from "../../../store/actions/admin-account-action";
import UserService from "../../../services/user-service";
import { useMemo } from "react";

function AvailableUidModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fetchingAvailableUidList = useSelector(
    (state) => state.AdminAccountReducer?.fetchingAvailableUidList
  );
  const availableUidList = useSelector(
    (state) => state.AdminAccountReducer?.availableUidList
  );
  const assignUuidToNewUserSuccess = useSelector(
    (state) => state.AdminAccountReducer?.assignUuidToNewUserSuccess
  );
  const assignedUidData = useSelector(
    (state) => state.AdminAccountReducer?.assignedUidData
  );

  const [show, setShow] = useState(props.show);
  const [uidList, setUidList] = useState([]);

  useEffect(() => {
    if (availableUidList?.length) setUidList(availableUidList);
  }, [availableUidList]);

  const uidFilteredList = useMemo(
    () =>
      uidList.filter((el) => el.status === "free" || el.status === "pending"),
    [uidList]
  );
  //   useEffect(() => {
  //     if (availableUidList.length > 0) {
  //       let filteredAvailableList = availableUidList.filter(
  //         (el) => el.status === "free" || el.status === "pending"
  //       );
  //       setUidList([...filteredAvailableList]);
  //     }
  //   }, [availableUidList]);

  useEffect(() => {
    if (assignUuidToNewUserSuccess) {
      // const { data, res } = assignedUidData;
      let data = {},
        res = {};
      assignedUidData.data.map((i) => (data[i.uid] = i));
      assignedUidData.res.map((i) => (res[i.uid] = i));
    }
  }, [assignUuidToNewUserSuccess, assignedUidData]);

  const handleClose = () => {
    setShow(!show);
    dispatch(ModalActions.hideModal(ModalTypes.AVAILABLE_UID));
  };

  const handleChange = (e, uid) => {
    let newUidList = [...uidList];
    let index = newUidList.findIndex((el) => el.uid === uid);
    newUidList[index].email = e.target.value;
    newUidList[index].isValid = CommonUtils.isValidEmail(e.target.value)
      ? true
      : false;
    setUidList(newUidList);
  };

  const handleSend = ({ email, uid }) => {
    // dispatch(assignUuidToNewUser([{ email, uid }]));
    const result = UserService.assignUuidToNewUser([{ email, uid }]);
    result.then((res) => {
      let list = [...uidFilteredList];
      let ind = list.findIndex((i) => i.uid === uid);
      if (ind > -1) {
        if (res.data?.length) {
          list[ind] = { ...list[ind], ...res.data[0], isAssigned: false };
        } else if (res.err) {
          list[ind] = { ...list[ind], err: res.err, isAssigned: false };
        } else if (res.code === 2001) {
          list[ind] = {
            ...list[ind],
            reason: "",
            message: res.message,
            isAssigned: true,
          };
        }
      }
      setUidList(list);
    });
  };
  const handleUnassign = ({ email, uid }) => {
    // dispatch(unassignUuid([{ email, uid }]));
    const result = UserService.unassignUuid([{ email, uid }]);
    result.then((res) => {
      let list = [...uidFilteredList];
      let ind = list.findIndex((i) => i.uid === uid);
      if (ind > -1) {
        if (res.data?.length) {
          list[ind] = { ...list[ind], ...res.data[0], isAssigned: true };
        } else if (res.err) {
          list[ind] = { ...list[ind], err: res.err, isAssigned: true };
        } else if (res.code === 2001) {
          list[ind] = {
            ...list[ind],
            reason: "",
            message: res.message,
            isAssigned: false,
          };
        }
      }
      setUidList(list);
    });
  };

  useEffect(() => {
    dispatch(fetchAvailableUidData());
  }, []);

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal" centered>
      <ModalHeader>
        {t("available.uid")}
        <button type="button" className="close uid-close" onClick={handleClose}>
          <span aria-hidden="true">
            <img src={Close} alt="" />
          </span>
          <span className="sr-only">{t("button:close")}</span>
        </button>
      </ModalHeader>
      <Modal.Body>
        <Form name="available-uid" className="available-uid">
          {fetchingAvailableUidList
            ? t("loading")
            : uidFilteredList && uidFilteredList.length > 0
            ? uidFilteredList.map((el) => {
                return (
                  <Form.Group key={el.uid} className=" position-relative">
                    <div className="d-flex align-items-center">
                      <Form.Label className="uid-label">{el.uid}</Form.Label>
                      <div className="input-btn">
                        <Form.Control
                          placeholder={t("available.uid.placeholder")}
                          type="email"
                          name={el.uid}
                          onChange={(e) => handleChange(e, el.uid)}
                          value={el.email || ""}
                          className={
                            el.isValid !== undefined && el.email && !el.isValid
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {el.isValid !== undefined &&
                          el.isValid &&
                          !el.isAssigned && (
                            <span
                              id={`text${el.uid}`}
                              style={{
                                position: "absolute",
                                right: "50px",
                                cursor: "pointer",
                                top: "6px",
                              }}
                              className="text-primary"
                              onClick={() => handleSend(el)}
                            >
                              {t("button:send")}
                            </span>
                          )}
                        {el.isAssigned !== undefined && el.isAssigned && (
                          <span
                            id={`text${el.uid}`}
                            style={{
                              position: "absolute",
                              right: "50px",
                              cursor: "pointer",
                              top: "6px",
                            }}
                            className="text-primary"
                            onClick={() => handleUnassign(el)}
                          >
                            {t("button:unassign")}
                          </span>
                        )}

                        {el.isAssigned !== undefined && el.isAssigned && (
                          <img
                            src={UploadedFileIcon}
                            alt=""
                            style={{
                              position: "absolute",
                              right: "-10px",
                              top: "6px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {el.reason && (
                      <div
                        className="invalid-feedback"
                        style={{ paddingLeft: "80px" }}
                      >
                        {el.reason}
                      </div>
                    )}
                  </Form.Group>
                );
              })
            : t("no.available.uid")}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          {t("button:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AvailableUidModal;
