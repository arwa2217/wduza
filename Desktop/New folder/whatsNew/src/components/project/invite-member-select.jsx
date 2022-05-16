import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import InviteMemberIcon from "../../assets/icons/v2/ic_add.svg";
import { makeStyles } from "@material-ui/core";
import Select, { components } from "react-select";
import ExternalIcon from "../../assets/icons/v2/external.png";
import GuestIcon from "../../assets/icons/v2/guest.png";
import CancelIcon from "../../assets/icons/v2/ic_cancel.svg";
import ExternalDiscussionImg from "../../assets/icons/v2/external.svg";
import GuestDiscussionImg from "../../assets/icons/v2/ic_badge_guest.svg";
import ChannelConstants from "../../constants/channel/channel-constants";
import ArrowDownIcon from "../../assets/icons/v2/ic_arrow_down.svg";
const useStyles = makeStyles((theme) => ({
  customOption: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginLeft: "15px",
    marginRight: "5px",
    padding: "12px 0",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",

    "& .left-info": {
      display: "flex",
      flexDirection: "column",
      "& .email": {
        fontSize: "14px",
        color: theme.palette.text.primary,
      },
      "& .name": {
        fontSize: "12px",
        color: theme.palette.text.black70,
      },
    },
    "& .right-info": {
      alignSelf: "center",
      "& .company-name": {
        fontSize: "12px",
        color: theme.palette.text.black50,
        marginRight: "10px",
      },
    },
  },
  inviteMembers: {
    "& .invite-icon .css-tlfecz-indicatorContainer": {
      display: 'none',
    },
    "&:hover .invite-icon  .css-tlfecz-indicatorContainer": {
      display: 'block',
    }
  },
  memberList: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    "& .member-item": {
      background: "rgba(240, 251, 245, 0.6)",
      border: "0.5px solid #03BD5D",
      color: theme.palette.text.focused,
      borderRadius: "4px",
      padding: "3.5px 6px",
      marginRight: "4px",
      marginBottom: "4px",
      fontSize: "13px",
      lineHeight: "17.42px",
    },
  },

}));
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    height: "58px",
    display: "flex",
    cursor: "pointer",
    padding: "0",
    // borderBottom: "1px solid #CCCCCC",
    boxSizing: "border-box",
    backgroundColor: state.isSelected ? "rgba(0, 0, 0, 0.02)" : "#ffffff",
    color: "#000000E5",
    "&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0.02)",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.02)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    padding: 0,
    boxShadow: "none",
    border: "1px solid #cccccc",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    "::-webkit-scrollbar": {
      width: "12px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: "transparent !important",
      boxShadow: "inset 0 0 14px 14px rgba(0, 0, 0, 0.1)",
      border: "solid 4px transparent !important",
      borderRadius: "100px",
      height: "144px",
    },
  }),
  control: (provided) => ({
    ...provided,
    border: "none",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    marginBottom: "4px",
    borderRadius: "unset",
    "&:focus": {
      border: "none",
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "unset",
    },
    "&:hover": {
      border: "none",
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "unset",
    },
    boxShadow: "unset",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    border: "1px solid #DEDEDE",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "rgba(240, 251, 245, 0.6)",
    border: "0.5px solid #03BD5D",
    borderRadius: "4px",
    padding: "6px 0 6px 6px",
    display: "flex",
    alignItems: "center",
    "& div:first-child": {
      color: "#00A95B",
      fontSize: "12px",
      padding: 0,
    },
    "& div:last-child": {
      "&:hover": {
        backgroundColor: "transparent",
        border: "none",
      },
      "& svg": {
        color: "#00A95B",
        cursor: "pointer",
      },
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    // padding: isHorizontal ? "2px 0px" : "2px 8px",
    // marginLeft: isHorizontal ? "-5px" : "",
    ".placeholder": {
      fontSize: "14px",
      fontWeight: "normal",
      opacity: 0.4,
      color: `#000000 !important`,
      position: "absolute",
      bottom: "-2px",
    },
    "& div:last-child": {
      paddingBottom: "0 !important",
      marginBottom: "0 !important",
    },
  }),
};
const InviteMemberSelect = (props) => {
  const classes = useStyles();
  const [inviteMembers, setInviteMembers] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  let [userTypeCount, setUserTypeCount] = useState(53);
  const handleInviteMember = () => {
    if (
      Object.keys(selectedValue).length &&
      !inviteMembers.includes(selectedValue["value"])
    ) {
      if (!inviteMembers.some((item) => item.value === selectedValue.value))
        setInviteMembers([...inviteMembers, selectedValue]);
    }
    setSelectedValue({});
    setUserTypeCount(53);
  };
  useEffect(() => {
    if (props?.userTypeCount) {
      props?.setUserTypeCount(userTypeCount);
    }
  }, [userTypeCount]);
  const handleDeleteMembers = (index) => {
    const inviteMembersClone = [...inviteMembers];
    inviteMembersClone.splice(index, 1);
    setInviteMembers(inviteMembersClone);
  };
  const handleInputChange = (data) => {
    setSelectedValue(data);
    setUserTypeCount(53 - data.label.length);
  };
  useEffect(() => {
    if (
      Object.keys(selectedValue).length > 0 &&
      !inviteMembers.includes(selectedValue.value)
    ) {
      if (!inviteMembers.some((item) => item.value === selectedValue.value)) {
        setInviteMembers([...inviteMembers, selectedValue]);
      }
      setSelectedValue({});
    }
  }, [selectedValue]);
  const handleKeyDown = (event) => {
    const key = event.keyCode;
    if (key === 8 || key === 46) {
      if (userTypeCount > 53) {
        setUserTypeCount(53);
      } else if (userTypeCount < 53) {
        setUserTypeCount((userTypeCount += 1));
      }
    } else {
      if (userTypeCount > -1) setUserTypeCount((userTypeCount -= 1));
    }
  };
  useEffect(() => {
    if (inviteMembers.length > 0) {
      props.setMembersValue(inviteMembers);
    }
  }, [inviteMembers]);
  const renderIcon = (type) => {
    switch (type) {
      case "EXTERNAL":
        return <img src={ExternalIcon} alt="external-icon" />;
      case "GUEST":
        return <img src={GuestIcon} alt="guest-icon" />;
      default:
    }
  };
  const CustomOption = (props) => {
    const { data } = props;
    return (
      <div>
        <components.Option {...props}>
          <div className={classes.customOption}>
            <div className="left-info">
              <span className="email">{data.value}</span>
              <span className="name">{data.label}</span>
            </div>
            <div className="right-info">
              {data.userType === "EXTERNAL" && (
                <span className="company-name">{data.companyName}</span>
              )}
              {renderIcon(data.userType)}
            </div>
          </div>
        </components.Option>
      </div>
    );
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={ArrowDownIcon} alt="arrow-down" />
      </components.DropdownIndicator>
    );
  };

  const customComponent = {
    Option: CustomOption,
    DropdownIndicator: DropdownIndicator,
    ClearIndicator: null,
    IndicatorSeparator: () => null,
  };
  return (
    <div className={`${classes.inviteMembers} position-relative invite-member_select`}>
      <CreatableSelect
        options={props.options}
        styles={customStyles}
        placeholder={<span className="placeholder">Invite email</span>}
        components={customComponent}
        value={selectedValue.value ? selectedValue : null}
        onChange={(value) => handleInputChange(value)}
        onKeyDown={(event) => handleKeyDown(event)}
        className="invite-icon"
      />
      {inviteMembers.length > 0 && (
        <div className={classes.memberList}>
          {inviteMembers.map((item, index) => (
            <div className="member-item d-flex align-items-center" key={index}>
              <span>{item.value}</span>
              {item.userType === ChannelConstants.EXTERNAL ? (
                <img
                  className="ml-1"
                  src={ExternalDiscussionImg}
                  alt="external-discussion-icon"
                />
              ) : item.userType === ChannelConstants.GUEST ? (
                <img
                  className="ml-1"
                  src={GuestDiscussionImg}
                  alt="guest-discussion-icon"
                />
              ) : (
                <></>
              )}
              <img
                src={CancelIcon}
                style={{ cursor: "pointer", marginLeft: "4px" }}
                alt="cancel-icon"
                onClick={() => handleDeleteMembers(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default InviteMemberSelect;
