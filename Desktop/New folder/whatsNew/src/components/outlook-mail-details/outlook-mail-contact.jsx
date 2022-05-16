import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import "../channel-details/channel-details.css";
import ContactItem from "./contact-item";
import services from "../../outlook/apiService";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@material-ui/core";
import {
  refreshContactData,
  setContactList,
} from "../../store/actions/mail-summary-action";
import CheckboxCustom from "../../assets/icons/check-box.svg";
import { withStyles } from "@material-ui/core/styles";
import {
  setActiveEmail,
  setListEmailSendFromContact,
  setPostEmailType,
  setSendEmailType,
} from "../../store/actions/outlook-mail-actions";
import SendEmailInContact from "../../assets/icons/post.svg";
import DeleteContactIcon from "../../assets/icons/delete-contact.svg";
import { postEmailType } from "../../outlook/config";
import { createRequestLimit, setEditorFocus } from "../../utilities/outlook";
import DeleteAllPopUp from "./delete-all-popup";
import OutLookLoading from "../outlook-shared/OutLookLoading";
import { useTranslation } from "react-i18next";
const checkBoxStyles = () => ({
  root: {
    color: "#c8c8c8",
    "&$checked": {
      color: "#18B263",
    },
    "&$indeterminate": {
      color: "#18B263",
    },
    "& .MuiIconButton-label": {
      width: "16px",
      height: "16px",
    },
  },
  indeterminate: {
    color: "#18B263",
  },
  checked: {},
});
const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

function OutlookMailContact() {
  const [contacts, setContacts] = useState([]);
  const [nextLink, setNextLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const searchValue = useSelector(
    (state) => state.MailSummaryReducer.searchValue
  );
  const [contactChecked, setContactChecked] = useState([]);
  const [warning, setWarning] = useState(false);
  const handleSendEmailMultiple = () => {
    const currentContactChecked = [];
    for (const checked of contactChecked) {
      currentContactChecked.push(contacts.find((item) => item.id === checked));
    }
    const listSendObject = currentContactChecked.reduce((acc, item) => {
      const obj = {
        email: item?.emailAddresses[0]?.address,
        label: item?.emailAddresses[0]?.name,
        value: item?.emailAddresses[0]?.address,
      };
      acc.push(obj);
      return acc;
    }, []);
    dispatch(setPostEmailType(postEmailType.newEmail));
    setEditorFocus(postEmailType.newEmail);
    dispatch(setSendEmailType(""));
    dispatch(setListEmailSendFromContact(listSendObject));
    setContactChecked([]);
  };
  const handleCheckContact = (e, index) => {
    e.stopPropagation();
    const {
      target: { value },
    } = e;
    let contactCheckedUpdate = [];
    if (contactChecked.includes(value)) {
      contactCheckedUpdate = contactChecked.filter(
        (contact) => contact !== value
      );
    } else {
      contactCheckedUpdate = [...contactChecked, value];
    }
    setContactChecked(contactCheckedUpdate);
  };
  const handleCheckAll = (e) => {
    const {
      target: { checked },
    } = e;
    if (checked) {
      const emailIds = contacts.map((mail) => mail.id);
      setContactChecked(emailIds);
    } else {
      setContactChecked([]);
    }
  };
  const dispatch = useDispatch();
  const isRefresh = useSelector((state) => state.MailSummaryReducer.isRefresh);
  const getContacts = async () => {
    setLoading(true);
    const result = await services.getContactList();
    result["@odata.nextLink"]
      ? setNextLink(result["@odata.nextLink"])
      : setNextLink("");
    setContacts(result.value);
    dispatch(setContactList([...result.value]));
    setLoading(false);
  };
  useEffect(() => {
    try {
      getContacts();
    } catch (error) {}
  }, []);
  useEffect(() => {
    if (isRefresh) {
      try {
        getContacts();
        dispatch(refreshContactData(false));
      } catch (error) {}
    }
  }, [isRefresh]);
  useEffect(() => {
    if (searchValue !== "") {
      const result = [...contacts].filter((item) => {
        return (
          item.displayName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item?.emailAddresses[0]?.address
            .toUpperCase()
            .includes(searchValue.toUpperCase())
        );
      });
      setContacts(result);
    } else {
      const searchContact = async () => {
        setLoading(true);
        const result = await services.searchContact(searchValue);
        setContacts(result.value);
        setLoading(false);
      };
      try {
        searchContact();
      } catch (e) {}
    }
  }, [searchValue]);
  const handleLoadMore = async () => {
    if (nextLink !== "") {
      const result = await services.getContactList(nextLink);
      result["@odata.nextLink"]
        ? setNextLink(result["@odata.nextLink"])
        : setNextLink("");
      setContacts(contacts.concat(result.value));
    }
  };
  const handleShowWarning = () => {
    setWarning(true);
  };
  const handleCloseWarning = () => {
    setWarning(false);
  };
  return (
    <>
      {loading ? (
        <div className="d-flex w-100 pb-3 justify-content-center align-items-center">
          <OutLookLoading />
        </div>
      ) : (
        <Col
          xs={12}
          className="channel-details-body channel-details-content-scroll p-0 contact-section"
        >
          <div className="check-all-contact">
            <div>
              <CustomCheckbox
                icon={<img src={CheckboxCustom} alt={"check-box"} />}
                onClick={handleCheckAll}
                className="p-0"
                checked={
                  contactChecked.length > 0 &&
                  contacts.length === contactChecked.length
                }
                indeterminate={
                  contactChecked.length > 0 &&
                  contacts.length !== contactChecked.length
                }
              />
            </div>

            <div
              className="contact-action"
              style={{ display: contactChecked.length ? "block" : "none" }}
            >
              <img
                src={SendEmailInContact}
                className="contact-send-email"
                alt="contact-send-email"
                onClick={handleSendEmailMultiple}
              />
              <img
                src={DeleteContactIcon}
                alt="delete-contact"
                onClick={handleShowWarning}
              />
            </div>
          </div>
          <div className="row w-100 ml-0">
            <div className="col-12 p-0">
              <div className="member-list-wrapper">
                <div id="members-list">
                  {contacts?.map((item, index) => {
                    return (
                      <ContactItem
                        key={item.id}
                        contact={item}
                        contactChecked={contactChecked}
                        setEmailChecked={setContactChecked}
                        handleCheckContact={(e) => handleCheckContact(e, index)}
                      />
                    );
                  })}
                </div>
                {nextLink !== "" && (
                  <span className="load-more-list-mail" onClick={handleLoadMore}>
                    {t("mail-contact:more")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DeleteAllPopUp
            setContactChecked={setContactChecked}
            contactsCheckList={contactChecked}
            handleCloseWarning={handleCloseWarning}
            showWarning={warning}
          />
        </Col>
      )}
    </>
  );
}

export default OutlookMailContact;
