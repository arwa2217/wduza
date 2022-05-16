import React, { useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import UserActions from "../../store/actions/user-actions";
import { useDispatch } from "react-redux";
import server from "server";
import RestConstants from "../../constants/rest/rest-constants";
import ValueConstants from "../../constants/rest/value-constants";
import { useTranslation } from "react-i18next";

/*
 *Component to verify if registration request is made
 *after email confirmation/redirection
 */
function RegisterRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [valid, setValid] = useState(null);
  const [search, setQuery] = useState(location.search);
  const { t } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem(ValueConstants.STRING_AUTH)) {
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
        if (!params || !params.uid || !params.email || !params.activationCode) {
          setValid(false);
        } else {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": `${server.apiKey}`,
            },
          };

          fetch(
            `${server.apiUrl}` +
              RestConstants.BASE_URL +
              RestConstants.UIDS +
              params.uid +
              RestConstants.ACCOUNT +
              RestConstants.SLASH +
              RestConstants.VERIFY +
              RestConstants.QUERY_ACTIVATION_CODE +
              params.activationCode,
            requestOptions
          ).then(
            (result) => {
              if (result.ok) {
                dispatch(UserActions.validateRegister(params));
                setValid(true);
              } else {
                setValid(false);
              }
            },
            (error) => {
              console.log(JSON.stringify(error));
              setValid(false);
            }
          );
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

export default RegisterRoute;
