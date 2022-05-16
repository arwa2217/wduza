import React from "react";
import UserRequiredActionType from "../../../../props/required-actions-type"
import { PostRequiredActions } from "../../../../store/actions/user-actions";
import { useDispatch } from "react-redux";
import RequiredActionResp from "../../../../props/required-action-resp";
import { useTranslation } from "react-i18next";


function RequiredActionActions(props) {
  const action = props.action;
  const dispatch = useDispatch();
   const { t, i18n } = useTranslation()

  function handledJoinChannel(e) {
    e.preventDefault();
    let body = JSON.stringify({
      actionType: action.actionType,
      channelId: action.channelId,
      actionResponse: RequiredActionResp.ACCEPT
    })
    dispatch(PostRequiredActions(body, dispatch))
  }
  function handledNotJoinChannel(e) {
    e.preventDefault();

    let body = JSON.stringify({
      actionType: action.actionType,
      channelId: action.channelId,
      actionResponse: RequiredActionResp.DECLINE
    })
    dispatch(PostRequiredActions(body, dispatch))
  }

  switch (action.actionType) {
    case UserRequiredActionType.APPROVE_AUTHENTICATION: {
      return (
        <div className="actions">
          <button style={{ background: "red", color: "white" }}>{t("approve")}</button>
          <button className="gray-button">{t("not.approve")}</button>
        </div>
      );
    }
    case "RequestAnswer": {
      return (
        <div className="actions">
          <button style={{ background: "red", color: "white" }}>{t("answer")}</button>
          <button className="gray-button inactive">11:00</button>
        </div>
      );
    }
    case "Confirm": {
      return (
        <div className="actions">
          <button>{t("yes")}</button>
          <button>{t("no")}</button>
          <button className="gray-button inactive">10:30</button>
        </div>
      );
    }
    default: {
      return (
        <div className="actions">
          <button style={{ background: "skyblue" }} onClick={handledJoinChannel}>{t("join")}</button>
          <button className="gray-button" onClick={handledNotJoinChannel} >{t("not.join")}</button>
        </div>
      );
    }
  }
};
export default RequiredActionActions;
