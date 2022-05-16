import React, { useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import ValueConstants from "../../constants/rest/value-constants";
import { store } from "../../store/store";
import { useTranslation } from "react-i18next";

/*
 *Component to verify if registration request is made
 *after email confirmation/redirection
 */
function MentionProfile({ component: Component, ...rest }) {
  const location = useLocation();
  const [valid, setValid] = useState(null);
  const [search, setQuery] = useState(location.search);
  const { t } = useTranslation();

  useEffect(() => {
    if (!localStorage.getItem(ValueConstants.STRING_AUTH)) {
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
        if (!params || !params.c || !params.u) {
          setValid(false);
        } else {
          let state = store.getState();
          let channels = state.ChannelReducer.channelList;
          channels.map((channel) => {
            if (channel.id === channel) {
              setValid(true);
            }
            return channel;
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

export default MentionProfile;
