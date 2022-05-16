import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SearchIcon from "../../assets/icons/search-icon.png";
import { TextField } from "@material-ui/core";
import AddUserIcon from "../../assets/icons/icon_add_members_green.svg";
import AddUserDefault from "../../assets/icons/icon_add_members_grey.svg";
import AddContactModal from "./add-contact-modal";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import { setKeyword } from "../../store/actions/mail-summary-action";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  addContact: {
    width: "24px",
    height: "24px",
    alignSelf: "center",
    cursor: "pointer",
    backgroundImage: `url(${AddUserDefault})`,
    "&:hover": {
      backgroundImage: `url(${AddUserIcon})`,
    },
  },
});

const ContactSearch = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const dispatch = useDispatch();
  const handleSearchContact = async (value) => {
    dispatch(setKeyword(value));
  };
  const deboundSearch = useCallback(debounce(handleSearchContact, 500), []);
  const handleSearch = (event) => {
    deboundSearch(event.target.value);
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        padding: "0 15px",
        height: "60px",
        borderBottom: "1px solid #DEDEDE",
      }}
    >
      <img
        src={SearchIcon}
        alt="search-icon"
        style={{
          width: "24px",
          height: "24px",
          alignSelf: "center",
        }}
      />
      <TextField
        fullWidth
        variant="standard"
        onChange={handleSearch}
        placeholder={t("mail-contact:searchContact")}
        style={{ padding: "0 10px" }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 150, hide: 100 }}
        trigger={["hover", "focus"]}
        overlay={
          <Tooltip id={"add-contact"}>{t("mail-contact:addContact")}</Tooltip>
        }
      >
        <div
          // src={AddUserDefault}
          alt="search-icon"
          onClick={() => setShowAdd(true)}
          className={classes.addContact}
          // style={{
          //   width: "24px",
          //   height: "24px",
          //   alignSelf: "center",
          //   cursor: "pointer",
          // }}
        />
      </OverlayTrigger>

      <AddContactModal handleCloseAdd={handleCloseAdd} showAdd={showAdd} />
    </div>
  );
};
export default ContactSearch;
