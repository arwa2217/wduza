import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";
import UserService from "../../services/user-service";
import {
  getAuthToken,
  removeAuthToken,
  saveAuthToken,
} from "../../utilities/app-preference";
import UserConstants from "../../constants/user/user-constants";
import { useTranslation } from "react-i18next";
import { MENU_ITEMS } from "../../constants/menu-items";
import {
  setESignFileInfo,
  switchPanelView,
} from "../../store/actions/esignature-actions";
import server from "server";
import RestConstants from "../../constants/rest/rest-constants";

/*
 *Component to verify if registration request is made
 *after email confirmation/redirection
 */
function GuestESignRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const [valid, setValid] = useState(null);
  const [search, setQuery] = useState(location.search);
  const [responseData, setResponseData] = useState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (getAuthToken()) {
      setValid(false);
      // removeAuthToken();
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
        if (!params || !params.accessCode || !params.fileId || !params.id) {
          setValid(false);
        } else {
          let result = UserService.guestESignFile(
            params.accessCode,
            params.fileId,
            params.id
          );
          saveAuthToken(params.accessCode);
          result
            .then((data) => {
              let fileData = data;
              if (fileData) {
                const downloadDetails = {
                  fileId: params.fileId,
                  requestingUserEmail: params.id,
                  thumbnailOrDl: "DL",
                  wopiCapable: false,
                  isFresh: true,
                  page: 1,
                  requestedpages: 1,
                  mimetype: fileData.mimetype,
                  fileName: fileData.fileName,
                };
                let recipientData = fileData.result.find(
                  (i) => i.email === params.id
                );
                let esignFileInfoTemp = { ...fileData, ...recipientData };

                esignFileInfoTemp.url =
                  server.apiUrl +
                  RestConstants.BASE_URL +
                  RestConstants.ESIGN +
                  RestConstants.ESIGN_FILE_CONTENT +
                  `${downloadDetails.fileId}?email=${downloadDetails.requestingUserEmail}&q=${downloadDetails.thumbnailOrDl}&wopiCapable=${downloadDetails.wopiCapable}&isFresh=${downloadDetails.isFresh}`;

                dispatch(setESignFileInfo(esignFileInfoTemp));
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
          /*
           * NEED TO CALL ACTUAL COMPONENT HERE
           *Please update this code once BE code is available
           */
          <Redirect
            to={{
              pathname: MENU_ITEMS.SIGN_DOCUMENT,
              // state: { responseData },
            }}
          />
        ) : valid === false ? (
          <Redirect
            to={{
              pathname: "/home",
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

export default GuestESignRoute;
