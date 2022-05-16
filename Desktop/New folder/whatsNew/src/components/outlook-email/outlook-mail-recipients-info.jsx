import React, { useEffect, useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import IconAddContactGreen from "../../assets/icons/icon-add-contact-green.svg";
import IconAddContactGrey from "../../assets/icons/icon_add_members_grey.svg";
import { useDispatch, useSelector } from "react-redux";
import { useMsal } from "@azure/msal-react";
import {
  InteractionStatus,
} from "@azure/msal-browser";
import { refreshContactData } from "../../store/actions/mail-summary-action";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import services from "../../outlook/apiService";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
  root: {
    fontSize: "12px",
    color: "#19191A",
    fontWeight: "300",
    lineHeight: "14px",
    fontFamily: "Roboto",
    margin: "15px 0 10px 0",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  recipients: {
    backgroundColor: "#F0F0F0",
    padding: "4px 7px",
    borderRadius: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "10px",
  },
  // ccRecipients: {
  //   backgroundColor: "#F0F0F0",
  //   padding: "4px 7px",
  //   borderRadius: "200px",
  //   display: "inline-flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "fit-content",
  //   marginLeft: "5px",
  // },
});

const OutlookMailRecipientsInfo = (props) => {
  const classes = useStyles();
  const { instance, inProgress } = useMsal();
  const [loading, setLoading] = useState(false);
  const { toRecipients, ccRecipients, bccRecipients } = props;
  const activeUser = instance.getActiveAccount();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const contactData = useSelector(
    (state) => state.MailSummaryReducer?.contactData
  );
  const [contactEmails, setContactEmails] = useState([]);
  const [isShowRecipients, setIsShowRecipients] = useState(false);
  useEffect(() => {
    const emailData = contactData?.map((item) => {
      return item.emailAddresses[0]?.address;
    });
    setContactEmails([...emailData]);
    setLoading(false);
  }, [contactData]);
  const handleAddContact = async (event, contactInfo) => {
    event.preventDefault();
    event.stopPropagation();
    if (inProgress === InteractionStatus.None) {
      const data = {
        givenName: contactInfo.emailAddress.name,
        emailAddresses: [
          {
            address: contactInfo.emailAddress.address,
            name: contactInfo.emailAddress.name,
          },
        ],
      };
      try {
        setLoading(true);
        await services.addContact(data);
        dispatch(refreshContactData(true));
      } catch (e) {
        /*if (e instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequest,
            account: instance.getActiveAccount(),
          });
        }*/
      }
    }
  };

  const isNotInListContactEmail = async (email) => {
    if (!contactEmails.includes(email)){
      const result = await services.searchContact(email);
      const {value = []} = result;
      return !value.length > 0
    }
   return false
  }

  return (
    <div className="mb-2">
      <div className={classes.root}>
        <span style={{ marginRight: "15px" }}>To: </span>
        {toRecipients.map((item) => (
          <div key={item.emailAddress.address} className={classes.recipients}>
            <span>
              {item.emailAddress.address === activeUser.username
                ? t("outlook.mail:you")
                : item.emailAddress.name}
            </span>
            {item.emailAddress.address ===
            activeUser.username ? null : (!contactEmails.includes(
                item.emailAddress.address
              ) && isNotInListContactEmail(item.emailAddress.address)) ? (
              loading ? (
                <CircularProgress style={{ marginLeft: "6px" }} size={11} />
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip id={"add-contact"}>{t("outlook.mail.tooltip:add.contact")}</Tooltip>
                  }
                >
                  <img
                    style={{
                      paddingLeft: "5px",
                      verticalAlign: "sub",
                      cursor: "pointer",
                      width: "20px",
                    }}
                    onClick={(event) => handleAddContact(event, item)}
                    src={IconAddContactGrey}
                    alt="add-contact-button"
                  />
                </OverlayTrigger>
              )
            ) : null}
          </div>
        ))}
      </div>
      {ccRecipients.length > 0 && isShowRecipients && (
        <div className={classes.root}>
          <span style={{ marginRight: "15px" }}>Cc: </span>
          {ccRecipients.map((item) => (
            <div key={item.emailAddress.address} className={classes.recipients}>
              <span>{item.emailAddress.name}</span>
              {!contactEmails.includes(item.emailAddress.address) && isNotInListContactEmail(item.emailAddress.address) ? (
                loading ? (
                  <CircularProgress style={{ marginLeft: "6px" }} size={11} />
                ) : (
                  <img
                    onClick={(event) => handleAddContact(event, item)}
                    style={{
                      paddingLeft: "5px",
                      verticalAlign: "sub",
                      cursor: "pointer",
                      width: "16px",
                    }}
                    src={IconAddContactGreen}
                    alt="add-contact-button"
                  />
                )
              ) : null}
            </div>
          ))}
        </div>
      )}
      {bccRecipients.length > 0 && isShowRecipients && (
        <div className={classes.root}>
          <span style={{ marginRight: "15px" }}>Bcc: </span>
          {bccRecipients.map((item) => (
            <div key={item.emailAddress.address} className={classes.recipients}>
              <span>{item.emailAddress.name}</span>
              {!contactEmails.includes(item.emailAddress.address) && isNotInListContactEmail(item.emailAddress.address) ? (
                loading ? (
                  <CircularProgress style={{ marginLeft: "6px" }} size={11} />
                ) : (
                  <img
                    onClick={(event) => handleAddContact(event, item)}
                    style={{
                      paddingLeft: "5px",
                      verticalAlign: "sub",
                      cursor: "pointer",
                      width: "16px",
                    }}
                    src={IconAddContactGreen}
                    alt="add-contact-button"
                  />
                )
              ) : null}
            </div>
          ))}
        </div>
      )}
      <>
        {ccRecipients.length || bccRecipients.length ? (
          <span
            style={{
              fontSize: "12px",
              color: "#308F65",
              cursor: "pointer",
            }}
            onClick={() => setIsShowRecipients(!isShowRecipients)}
          >
            {isShowRecipients ? t("outlook.mail:hide.recipients") : t("outlook.mail:show.recipients")}
          </span>
        ) : null}
      </>
    </div>
  );
};

export default OutlookMailRecipientsInfo;
