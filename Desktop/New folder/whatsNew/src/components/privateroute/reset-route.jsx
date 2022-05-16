import React, { useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { validateResetPassword } from "../../store/actions/user-actions";
import { useDispatch } from "react-redux";
import server from "server";
import RestConstants from "../../constants/rest/rest-constants";
import ValueConstants from "../../constants/rest/value-constants";
import { useTranslation } from "react-i18next";

/*
 *Component to verify if registration request is made
 *after email confirmation/redirection
 */
function ResetRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [valid, setValid] = useState(null);
  const [search, setQuery] = useState(location.search);

  const { t } = useTranslation();

  useEffect(() => {
    let updatePasswordParams = JSON.parse(
      '{"' +
        search.split("?")[1].replace(/&/g, '","').replace(/=/g, '":"') +
        '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );

    if (
      localStorage.getItem(ValueConstants.STRING_AUTH) &&
      !updatePasswordParams?.updatePassword
    ) {
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
        if (!params || !params.activationCode || !params.email) {
          setValid(false);
        } else {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };
          let resetPasswordCode = params.activationCode.toString();
          fetch(
            `${server.apiUrl}` +
              RestConstants.BASE_URL +
              RestConstants.USER +
              RestConstants.REMEDIATION +
              RestConstants.SLASH +
              RestConstants.VERIFY +
              RestConstants.QUERY_RESET_PASSWORD_CODE +
              resetPasswordCode +
              RestConstants.QUERY_REMEDIATION_EMAIL +
              params.email,
            requestOptions
          ).then(
            (result) => {
              if (result.ok) {
                result.text().then((text) => {
                  dispatch(validateResetPassword(text));
                  setValid(true);
                });
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

export default ResetRoute;
