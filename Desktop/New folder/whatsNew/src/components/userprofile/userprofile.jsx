import React from "react";
import { Icon } from "semantic-ui-react";
import "./userprofile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function UserProfile(props) {
  const profileLoading = useSelector(
    (state) => state.AuthReducer.profileLoading
  );
  const { t } = useTranslation();

  function onPauseNotificationClick() {
    console.log("onPauseNotificationClick");
  }

  function onHelpClick() {
    console.log("onHelpClick");
  }
  function onPreferenceClick() {
    console.log("onPreferenceClick");
  }
  function onProfileClick() {
    console.log("onProfileClick");
  }

  return profileLoading ? (
    <p>{t("loading")} </p>
  ) : (
    <>
      <div className="col-md-12 whiteBg m-0 p-0 ">
        <Row
          className="profile-row mt-1 p-1 border-top"
          onClick={onPauseNotificationClick}
        >
          <Col className="pl-2">{t("user.profile:pause_notification")}</Col>
          <div className="flex-flex-row-reverse pl-2">
            <Icon
              className="align-content-end"
              name="angle right"
              width="25px"
              height="25px"
            ></Icon>
          </div>
        </Row>
        <Row className="profile-row mt-1 p-1" onClick={onProfileClick}>
          {" "}
          <Col className="pl-2">{t("user.profile:profile")}</Col>
        </Row>
        <Row className="profile-row mt-1 p-1" onClick={onPreferenceClick}>
          <Col className="pl-2"> {t("user.profile:preferences")} </Col>
        </Row>
        <Row className="profile-row mt-1 p-1" onClick={onHelpClick}>
          <Col className="pl-2">{t("user.profile:help")}</Col>
          <div className="flex-flex-row-reverse">
            <Icon
              className="align-content-end"
              name="angle right"
              width="25px"
              height="25px"
            ></Icon>
          </div>
        </Row>
        <Row className="mb-3 pt-3 pb-3 mt-3 "></Row>
        <Row className="profile-row mt-5 p-1 " onClick={props.onSignoutClick}>
          <Col className="pl-2 pt-2 border-top">
            {t("user.profile:signout")}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
