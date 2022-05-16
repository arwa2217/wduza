import React from "react";
import "./project-topbar.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UserType from "../../constants/user/user-type";
import styled from "styled-components";
import Panel from "../actionpanel/panel";
import {
  setActivePanelAction,
  setActiveMenuItem,
} from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import { useHistory } from "react-router";

const Label = styled.p`
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 100;
  line-height: 100%;
  font-size: 14px;
  color: #999999;
  float: right;
  margin-top: 5px;
  margin-left: 5px;
`;

function ProjectTopbar(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const user = useSelector((state) => state.AuthReducer.user);
  let activeMenu = useSelector((state) => state.config.activeMenuItem);

  function handleCreateDiscussion() {
    if (activeMenu !== MENU_ITEMS.COLLECTIONS) {
      dispatch(setActiveMenuItem(MENU_ITEMS.COLLECTIONS));
      history.push(MENU_ITEMS.COLLECTIONS);
    }
    dispatch(setActivePanelAction(Panel.NEW_DISCUSSION));
  }

  return (
    <div className="project-topbar">
      {user.userType !== UserType.GUEST && (
        <button
          className="btn project-topbar-new-discussion-btn"
          type="button"
          onClick={handleCreateDiscussion}
        >
          <Label>{t("discussion:new.discussion")}</Label>
        </button>
      )}
    </div>
  );
}

export default ProjectTopbar;
