import React, { useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import UserService from "../../services/user-service";
import { useTranslation } from "react-i18next";
import GuestFileShareModal from "../modal/guest-file-share-modal/guest-file-share-modal";
import PassCodeModal from "../modal/guest-file-share-modal/passcode-modal";

function GuestFileDownload({ component: Component, ...rest }) {
  const location = useLocation();
  const [valid, setValid] = useState(null);
  const [isUnAuth, setUnAuth] = useState();
  const [search, setQuery] = useState(location.search);
  const [filesData, setFilesData] = useState();
  const [params, setParams] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
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
      if (!params || !params.access_code) {
        setValid(false);
      } else {
        setParams(params);
        let result = UserService.sharedGuestFiles({
          postObj: params,
          handleAuth: () => setUnAuth(true),
        });
        result
          .then((res) => {
            if (res) {
              setFilesData(res.data);
              setValid(true);
            } else {
              setValid(false);
            }
          })
          .catch((error) => {
            console.log("Error : ", error);
            setValid(false);
          });
      }
    }
    // }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        valid === true ? (
          isUnAuth ? (
            <PassCodeModal
              {...props}
              params={params}
              fileData={filesData}
              onSuccess={(data) =>
                setFilesData(data) || setValid(true) || setUnAuth(false)
              }
              onFailure={() => setValid(false)}
            />
          ) : (
            <GuestFileShareModal
              fileData={filesData}
              {...props}
              accessCode={params.access_code}
            />
          )
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

export default GuestFileDownload;
