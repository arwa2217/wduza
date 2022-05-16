import React, { useState, useEffect } from "react";
import "./userpanel.css";
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  List,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import UserActions from "../../store/actions/user-actions";
import { useTranslation } from "react-i18next";

function UserPanel() {
  const { t } = useTranslation();

  const user = useSelector((state) => state.AuthReducer.user);
  const signoutFailed = useSelector((state) => state.AuthReducer.signoutFailed);
  const [open, setOpen] = useState(false);
  const [showSignout, setShowSignout] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (signoutFailed) {
      setShowSignout(false);
    }
  }, [user]);

  function showUserDetails() {
    return (
      <List>
        <List.Item as="a" className="userData pl-1">
          <h4
            className="textStyle"
            style={{ margin: 2, marginBottom: 6, fontSize: "15px" }}
          >
            {user.companyName}
          </h4>
          {/*<h5 className="textStyle" style={{ margin: 2, marginBottom: 4, fontSize: "13px" }}>{user.department}</h5>
                    <h5 className="textStyle" style={{ margin: 2, marginBottom: 4, fontSize: "13px" }}>
                        <img className="pt-0 pr-1 mr-0 pl-0 ml-0" src={
                            user.onlineStatus === UserStatus.ACTIVE.state ? online : 
                            user.onlineStatus === UserStatus.AWAY.state ? away : offline} />      
                        {user.screenName}
                        </h5>*/}
        </List.Item>
      </List>
    );
  }

  function onSignoutClick() {
    closePopup();
    setShowSignout(true);
  }

  function handleSignout() {
    dispatch(UserActions.signout());
  }

  function handleSignoutCancel() {
    setShowSignout(false);
  }

  function closePopup() {
    setOpen(false);
  }

  function openPopup() {
    setOpen(true);
  }

  function hideSignoutError() {
    dispatch(UserActions.cleanSignoutFail());
    setShowSignout(false);
  }

  return (
    <Grid className="customColumn userTabColor paddingLeft">
      <GridColumn className="leftMargin">
        <GridRow className="userRow">
          <Header className="userHeader" floated="left">
            <HeaderContent>{t("project:Project")}</HeaderContent>
          </Header>
        </GridRow>
      </GridColumn>
      {/* <SignoutModal
        show={showSignout}
        handleClose={handleSignoutCancel}
        handleSignout={handleSignout}
      />
      <SignoutError show={signoutFailed} handleClose={hideSignoutError} /> */}
    </Grid>
  );
}

export default connect()(UserPanel);
