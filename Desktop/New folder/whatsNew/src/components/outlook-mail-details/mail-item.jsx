import React, { useEffect, useState } from "react";
import "../channel-details/channel-details.css";
import DefaultUser from "../../assets/icons/default-user.svg";
import moment from "moment";
import styled from "styled-components";
import { getDomainNameByEmail } from "../../utilities/outlook";
import { Skeleton } from "@material-ui/lab";
import { useMsal } from "@azure/msal-react";
import services from "../../outlook/apiService";
import { useDispatch, useSelector } from "react-redux";
import {
  isReadMailId,
  setIsReadMailId,
  setMailHighLight,
} from "../../store/actions/outlook-mail-actions";
import { getDefaultImage } from "../../utilities/outlook-message-list";
const AllReadMessage = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 12px;
  width: calc(100% - 28px) !important;
  > p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
function MailItem(props) {
  const { item, handleLoadMore } = props;
  const [profilePhotoUrl, setProfilePhotoUrl] = useState({});
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageFromApi, setImageFromApi] = useState("");
  const { instance } = useMsal();
  const { username } = instance.getActiveAccount();
  const dispatch = useDispatch();
  const currentMailHightLight = useSelector(
    (state) => state.OutlookMailReducer.currentHighLightMailId
  );
  const isReadMailId = useSelector(
    (state) => state.OutlookMailReducer.isReadMailId
  );
  const [currentMail, setCurrentMail] = useState("");
  useEffect(() => {
    setCurrentMail(item);
  }, [item]);
  useEffect(() => {
    if (isReadMailId === currentMail.id) {
      setCurrentMail({ ...item, isRead: true });
    }
    dispatch(setIsReadMailId(""));
  }, [isReadMailId]);
  useEffect(() => {
    if (item.sender) {
      setLoadingImage(true);
      const emailColor = localStorage.getItem("EMAIL_COLOR")
        ? JSON.parse(localStorage.getItem("EMAIL_COLOR"))
        : [];
      const userAvatar = emailColor?.find(
        (i) => i.email === item?.sender?.emailAddress?.address
      );
      const listEmails = emailColor.map((item) => item.email);
      if (
        listEmails.length &&
        !listEmails.includes(item?.sender?.emailAddress?.address) &&
        getDomainNameByEmail(item?.sender?.emailAddress?.address) ===
          getDomainNameByEmail(username)
      ) {
        const getImage = async () => {
          const result = await services.getUserImage(
            item?.sender?.emailAddress?.address
          );
          const link = URL.createObjectURL(result);
          setImageFromApi(link);
        };
        getImage();
      }
      if (userAvatar && Object.keys(userAvatar).length) {
        setProfilePhotoUrl(userAvatar);
      } else {
        setProfilePhotoUrl({
          isDefault: false,
          value: getDefaultImage(),
        });
      }
      setLoadingImage(false);
    }
  }, [item]);
  const handleHighLight = (mailId) => {
    dispatch(setMailHighLight(mailId));
  };
  return (
    <div>
      <div
        className="member-wrapper"
        style={{
          padding: "5px 20px 0px 20px!important",
          height: "70px",
        }}
        onClick={() => handleHighLight(item.id)}
      >
        {!profilePhotoUrl?.isDefault && profilePhotoUrl !== undefined ? (
          loadingImage ? (
            <Skeleton animation="wave" variant="rect" width={40} height={40} />
          ) : imageFromApi !== "" ? (
            <img
              style={{
                borderRadius: "5px",
                color: "var(--white)",
                width: "40px",
                height: "40px",
                alignSelf: "flex-start",
              }}
              src={imageFromApi}
              alt=""
            />
          ) : (
            <img
              style={{
                borderRadius: "5px",
                color: "var(--white)",
                width: "40px",
                height: "40px",
                alignSelf: "flex-start",
              }}
              src={
                profilePhotoUrl?.value !== undefined
                  ? `data:image/png;base64,${profilePhotoUrl?.value}`
                  : DefaultUser
              }
              alt=""
            />
          )
        ) : (
          <div
            className="user-image"
            style={{
              borderRadius: "5px",
              color: "var(--white)",
              fontSize: "15px",
              lineHeight: "2.5",
              textAlign: "center",
              minWidth: "40px",
              height: "40px",
              alignSelf: "flex-start",
              backgroundColor: `#${profilePhotoUrl?.value}`,
            }}
          >
            {currentMail?.sender?.emailAddress?.name ? (
              <span>
                {currentMail?.sender?.emailAddress?.name
                  .toUpperCase()
                  .slice(0, 1)}
              </span>
            ) : null}
          </div>
        )}
        <div
          className="w-100"
          style={{ paddingLeft: "15px", paddingTop: "5px" }}
        >
          <div className="d-flex">
            <span
              className="span_ellipsis"
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "#19191A",
                lineHeight: "14px",
              }}
            >
              {currentMail?.sender?.emailAddress?.name}
            </span>
          </div>
          <span
            style={{ fontSize: "12px", color: "#999999", lineHeight: "12px" }}
          >
            {moment(currentMail?.sentDateTime).format("ddd, MMM DD, hh:mmA")}
          </span>
          <AllReadMessage
            dangerouslySetInnerHTML={{
              __html: currentMail?.bodyPreview?.split("\r")[0],
            }}
            style={{ color: !currentMail.isRead ? "#308F65" : "#333333" }}
            className="message-list-message"
          />
        </div>
      </div>
    </div>
  );
}

export default MailItem;
