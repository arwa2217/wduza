import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";
import UserService from "../../services/user-service";
import { getAuthToken } from "../../utilities/app-preference";
import UserConstants from "../../constants/user/user-constants";
import { useTranslation } from "react-i18next";

/*
 *Component to verify if registration request is made
 *after email confirmation/redirection
 */
function GuestLoginRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const [valid, setValid] = useState(null);
  const [search, setQuery] = useState(location.search);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (getAuthToken()) {
      setValid(false);
    } else {
      if (search.split("?")[1] === undefined) {
        setValid(false);
      } else {
        let params = JSON.parse(
          '{"' +
            search.split("?")[1].replace(/&/g, '","').replace(/=/g, '":"') +
            '"}',
          function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
          }
        );
        if (!params || !params.otlToken || !params.email || !params.channelId) {
          setValid(false);
        } else {
          let result = UserService.guestSignin(
            params.otlToken,
            params.email,
            params.channelId
          );
          result
            .then((user) => {
              if (user) {
                dispatch({ type: UserConstants.SUCCESS_SIGNIN, user });
                setValid(true);
              } else {
                setValid(false);
              }
              //location.reload(true);
            })
            .catch((error) => {
              console.log("Error in login guest", error);
              setValid(false);
            });
        }
      }
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        valid === true ? (
          <Component {...props} />
        ) : valid === false ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        ) : (
          <div className="loading">{t("loading")}&#8230;</div>
        )
      }
    />
  );
}

export default GuestLoginRoute;
