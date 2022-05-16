import React, { useEffect, useState } from "react";
import "../channel-details/channel-details.css";
import { useTranslation } from "react-i18next";
import DefaultUser from "../../assets/icons/default-user.svg";
import { getDomainNameByEmail } from "../../utilities/outlook";
import { useMsal } from "@azure/msal-react";
import AddContactICon from "../../assets/icons/add-email-summary.svg";
import { refreshContactData } from "../../store/actions/mail-summary-action";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import SummaryModal from "./summary-modal";
import services from "../../outlook/apiService";
import { Skeleton } from "@material-ui/lab";
import { getDefaultImage } from "../../utilities/outlook-message-list";
function SenderItem(props) {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const { instance } = useMsal();
  const handleClose = () => setShow(false);
  const contactData = useSelector(
    (state) => state.MailSummaryReducer?.contactData
  );
  const [contactEmail, setContactEmails] = useState([]);
  const handleShow = () => setShow(true);
  const { username } = instance.getActiveAccount();
  const [userAvatar, setUserAvatar] = useState({});
  const { item } = props;
  const [userInfo, setUserInfo] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (item) {
      const emailColor = localStorage.getItem("EMAIL_COLOR")
        ? JSON.parse(localStorage.getItem("EMAIL_COLOR"))
        : [];
      const userAvatar = emailColor.find((i) => i.email === item?.address);
      if (userAvatar && Object.keys(userAvatar).length) {
        setUserAvatar(userAvatar);
      } else {
        setUserAvatar({
          isDefault: false,
          value: getDefaultImage(),
        });
      }
    }
  }, [item]);
  useEffect(() => {
    const emailData = contactData?.map((item) => {
      return item.emailAddresses[0]?.address;
    });
    setContactEmails([...emailData]);
    setLoadingAdd(false);
  }, [contactData]);
  useEffect(() => {
    if (
      getDomainNameByEmail(item?.address) === getDomainNameByEmail(username)
    ) {
      const getValues = async () => {
        setLoading(true);
        const values = await services.getUserSummaryInfo(item?.address);
        setUserInfo(values);
        setLoading(false);
      };
      try {
        if (item?.address) {
          getValues();
        }
      } catch (e) {}
    }
  }, [item]);

  const handleAddContact = async (event) => {
    event.stopPropagation();
    if (item) {
      setLoadingAdd(true);
      const data = {
        givenName: item?.name,
        emailAddresses: [
          {
            address: item?.address,
            name: item?.name,
          },
        ],
      };
      try {
        await services.addContact(data);
        dispatch(refreshContactData(true));
      } catch (e) {}
    }
  };
  return (
    <div>
      {loading ? (
        <div className="member-wrapper px-4">
          <div className="member-info">
            <Skeleton
              animation="wave"
              variant="rect"
              width="25vh"
              height={40}
            />
            <div className="pl-2 member-desc">
              <Skeleton
                animation="wave"
                variant="rect"
                width="75vh"
                height={20}
              />
              <Skeleton
                animation="wave"
                variant="rect"
                width="75vh"
                height={20}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="member-wrapper px-4" onClick={handleShow}>
          <div className="member-info">
            {!userAvatar?.isDefault ? (
              <img
                style={{
                  borderRadius: "5px",
                  color: "var(--white)",
                  width: "40px",
                  height: "40px",
                  alignSelf: "flex-start",
                }}
                src={`data:image/png;base64,${userAvatar?.value}`}
                alt=""
              />
            ) : (
              <div
                className="user-image"
                style={{
                  borderRadius: "5px",
                  color: "var(--white)",
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "10px",
                  lineHeight: "2.7",
                  textAlign: "center",
                  backgroundColor: `#${userAvatar?.value}`,
                  width: "40px",
                  height: "40px",
                }}
              >
                {item?.name ? (
                  <span>{item?.name.toUpperCase().slice(0, 1)}</span>
                ) : null}
              </div>
            )}
            <div className="pl-2 member-desc">
              <div className="d-flex">
                <span className="span_ellipsis">{item?.name}</span>{" "}
              </div>
              <span>{userInfo?.jobTitle ? userInfo?.jobTitle : ""}</span>
              <span>{item?.address}</span>
            </div>
          </div>
          {!contactEmail.includes(item?.address) &&
          item?.address !== username ? (
            <div
              className="add-member-summary"
              style={{
                padding: "5px 7px",
                borderRadius: "5px",
                backgroundColor: "#EFF6FF",
              }}
              onClick={handleAddContact}
            >
              {loadingAdd ? (
                <CircularProgress style={{ marginLeft: "6px" }} size={11} />
              ) : (
                <img src={AddContactICon} alt="" />
              )}
            </div>
          ) : null}
        </div>
      )}
      <SummaryModal
        userEmail={item?.address}
        avatar={userAvatar}
        show={show}
        handleClose={handleClose}
        profile={item}
      />
    </div>
  );
}

export default SenderItem;
