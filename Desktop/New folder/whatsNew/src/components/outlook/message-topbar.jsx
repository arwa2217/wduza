import React from "react";
import "./message-topbar.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UserType from "../../constants/user/user-type";
import styled from "styled-components";
import {
  setActiveDraftMailId,
  setContactSenderEmail,
  setEnableWriteEmail,
  setListEmailSendFromContact,
  setPostEmailType,
  setSendEmailType,
} from "../../store/actions/outlook-mail-actions";
import { postEmailType } from "../../outlook/config";
import { setEditorFocus } from "../../utilities/outlook";

const Label = styled.p`
  font-style: normal;
  font-weight: 100;
  line-height: 100%;
  font-size: 14px;
  color: #999999;
  float: right;
  margin-top: 5px;
  margin-left: 5px;
`;

function MessageTopBar(props) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.AuthReducer.user);
  const { isOpenWriteEmailModalPopup } = useSelector(
    (state) => state.OutlookMailReducer
  );
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer?.postEmailType
  );
  // let activeMenu = useSelector((state) => state.config.activeMenuItem);

  function handleWriteEmail() {
    if (postEmailTypeReducer !== postEmailType.newEmail) {
      dispatch(setPostEmailType(postEmailType.newEmail));
      setEditorFocus(postEmailType.newEmail);
      dispatch(setEnableWriteEmail(true));
      dispatch(setSendEmailType(""));
      //Reset Draft Mail Id when write new emails
      dispatch(setActiveDraftMailId(""));
      dispatch(setContactSenderEmail({}));
      dispatch(setListEmailSendFromContact([]));
    }
  }
  return (
    <div className="project-topbar">
      {user.userType !== UserType.GUEST && (
        <button
          className={`btn project-topbar-new-discussion-btn ${
            isOpenWriteEmailModalPopup ? "disabled" : ""
          }`}
          type="button"
          onClick={handleWriteEmail}
        >
          <Label>{t("email-contact:newEmail")}</Label>
        </button>
      )}
    </div>
  );
}

export default MessageTopBar;
