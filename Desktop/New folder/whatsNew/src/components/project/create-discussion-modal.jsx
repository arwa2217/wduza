import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import styled from "styled-components";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import CheckedIcon from "../../assets/icons/v2/ic_check_act.svg";
import UnCheckedIcon from "../../assets/icons/v2/ic_un_check.svg";
import CircleIcon from "../../assets/icons/v2/ic_circle.svg";
import HelpIcon from "../../assets/icons/v2/ic_help.svg";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@material-ui/core";
import ImportantInputIcon from "../../assets/icons/v2/important_text.svg";
import InviteMemberIcon from "../../assets/icons/v2/ic_add.svg";
import SecurityIcon from "../../assets/icons/v2/ic_security.svg";
import InviteMemberSelect from "./invite-member-select";
import {
  createChannelAction,
  resetCreateChannelAction,
} from "../../store/actions/channelActions";
import SuggestModal from "./suggest-modal";

const StyledModal = styled(Modal)`
.modal-content{
  padding: 0 !important;
}
`;

const ModalHelperContents = {
  securityModal: {
    contents: [
      "Secure communication, free of 3rd party oversight",
      "Secure file exchange",
      "Set person-by-person file permissions",
    ],
  },
  advancedSecurityModal: {
    contents: [
      "Retain tamper-proof data on your own servers for compliance or e-discovery",
      "Retain the right to remove all traces of discussion data from external servers",
    ],
  },
  lockAndArchive: {
    title: "Leaves a data trail for auditing or e-discovery",
    contents: [
      "An owner can lock this discussion at any time",
      "A locked discussion is saved in a tamper-proof, read-only state on all discussion owners’ servers",
    ],
  },
  deleteAll: {
    title: "Protects extremely sensitive data",
    contents: [
      "An owner can permanently delete this discussion at any time",
      "A deleted discussion is no longer visible to any collaborators and is deleted from all servers",
    ],
  },
};

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .help-icon {
    cursor: pointer;
    position: relative;
  }
  .discussion-tag:hover + .advanced-security-help-modal,
  .advance-security:hover + .advanced-security-help-modal {
    display: block !important;
  }
 
`;
const Checklist = styled.div`
   .label-control-checklist img {
    width: 16px;
    height: 16px;
  }
`

const useStyles = makeStyles((theme) => ({
  newDiscussionWrapper: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    padding: "32px",
    width: "570px",
    "& .modal-title": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
      "& .discussion-name": {
        color: theme.palette.text.primary,
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: "16px",
      },
      "& .discussion-tag": {
        color: theme.palette.text.black40,
        fontSize: "11px",
        fontWeight: "normal",
        lineHeight: "14.74px",
        cursor: "pointer",
      },
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)!important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
    "& .advanced-security-section": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "28px",
      marginBottom: "5px",
      "& .label": {
        display: "flex",
        alignItems: "center",
        "& .text": {
          color: "#00A95B",
          fontSize: "16px",
          lineHeight: "14px",
          fontWeight: "bold",
          paddingLeft: "4px",
        },
      },
      "& .switch": {
        "& .MuiSwitch-root": {
          padding: 0,
          width: "28px",
          height: "16px",
        },
        "& .MuiSwitch-track": {
          // width: "36px",
          // height: "18px",
          borderRadius: "20px",
          background: "#CCCCCC",
          opacity: 1,
        },
        "& .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track": {
          background: "#03BD5D",
          opacity: 1,
        },
        "& .MuiSwitch-switchBase": {
          padding: "1px",
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          transform: "translateX(12px)",
        },
        "& .MuiSwitch-thumb": {
          height: "14px",
          width: "14px",
        },
        "& .MuiSwitch-colorPrimary.Mui-checked": {
          color: "#ffffff",
        },
      },
    },
    "& .advance-expand-option": {
      paddingLeft: "34px",
      "& label": {
        marginBottom: "0 !important",
      },
      "& .MuiCheckbox-root": {
        padding: "5px !important",
      },
      "& .data-handling-title": {
        fontSize: "14px",
        lineHeight: "14px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
        paddingBottom: "5px",
        paddingTop: "12px",
        marginLeft: "-6px",
      },
      "& .MuiButtonBase-root": {
        padding: "5px",
      },
      "& .MuiFormControlLabel-label": {
        "& span": {
          fontSize: "14px",
          lineHeight: "14px",
          color: "rgba(0, 0, 0, 0.7)"
        },
        "& .checked-title": {
          color: "#00A95B",
        }
      },
    },
    "& .create-discussion-input": {
      marginBottom: "8px",

      "& .MuiInput-formControl": {
        "& .MuiInputBase-input": {
          height: "17px",
        },
      },
      "& input::placeholder": {
        color: `${theme.palette.color.black40} !important`,
        fontSize: "14px",
        opacity: "0.4 !important",
        "& ::after": {
          content: ImportantInputIcon,
        },
      },
    },
  },
  placeholder: {
    color: theme.palette.color.black40,
    fontSize: "14px",
    lineHeight: "14px%",
  },
  importantIcon: {
    margin: "0 0 10px 2px",
  },
  inviteMemberIcon: {
    cursor: "pointer",
  },
  confirmButtonDisabled: {
    backgroundColor: theme.palette.text.focused,
    opacity: 0.3,
    borderRadius: "4px",
    textAlign: "center",
    marginTop: "27px",
    color: "#ffffff !important",
    cursor: "default",
    fontSize: "14px",
    lineHeight: "14px",
    padding: "9px 14px",

    "&:hover": {
      backgroundColor: theme.palette.text.focused,
    },
  },
  confirmButton: {
    backgroundColor: theme.palette.text.focused,
    borderRadius: "4px",
    textAlign: "center",
    marginTop: "27px",
    color: "#ffffff",
    fontSize: "14px",
    lineHeight: "14px",
    padding: "9px 14px",

    "&:hover": {
      backgroundColor: theme.palette.text.focused,
    },
  },
  radio: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      lineHeight: "14px",
      color: theme.palette.text.primary,
    },
    "& .MuiSvgIcon-root": {
      fill: "#CCCCCC!important",
    },
  },
}));

function CreateDiscussionModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [show, setShow] = useState(props.show);
  const [dataHandling, setDataHandling] = useState("");
  const [isShowPlaceHolder, setShowPlaceHolder] = useState(true);
  const [isSubmitBtnEnabled, enableSubmitBtn] = useState(
    props.channel && props.channel.name !== "" ? true : false
  );
  const createChannelApiError = useSelector(
    (state) => state.ChannelReducer.createChannelApiError
  );
  const memberList = useSelector(
    (state) => state.memberDetailsReducer?.memberData
  );
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (memberList && memberList.length > 0) {
      const options = memberList?.map((item) => {
        return {
          value: item.email,
          label: item.screenName,
          companyName: item.companyName,
          userType: item.userType,
          cid: item.cid,
        };
      });
      setOptions(options);
    }
  }, [memberList]);
  const [channel, setChannel] = useState({
    channel_id: "",
    description: "",
    isAdvanced: false,
    isConfidential: false,
    isDeletable: false,
    isLockable: false,
    membersList: [],
    name: "",
    showAdvanceControl: false,
  });
  const onClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.NEW_DISCUSSION));
  };
  const setMembersValue = (members) => {
    const membertoApi = members?.map((item) => {
      return {
        memberEmail: item.value,
        memberType: item.userType,
        cid: item.cid,
      };
    });
    setChannel({ ...channel, membersList: membertoApi });
  };

  const handleDataHandling = (event) => {
    const { value } = event.target;
    setDataHandling(value);
    switch (value) {
      case "LOCK":
        setChannel({ ...channel, isLockable: true, isDeletable: false });
        break;
      case "NONE":
        setChannel({ ...channel, isLockable: false, isDeletable: false });
        break;
      case "DELETE":
        setChannel({ ...channel, isDeletable: true, isLockable: false });
        break;
      default:
    }
  };
  const handleChangeConfidentiality = (event) => {
    setChannel({ ...channel, isConfidential: event.target.checked });
  };
  const handleAddChannel = async (event) => {
    event.preventDefault();
    if (createChannelApiError) {
      dispatch(resetCreateChannelAction());
    }
    await dispatch(createChannelAction(channel, dispatch));
    enableSubmitBtn(false);
    onClose();
  };
  const handleFocus = (event) => {
    setShowPlaceHolder(false);
  };
  const handleBlur = (event) => {
    setShowPlaceHolder(true);
  };

  return (
    <StyledModal show={show} onHide={onClose} centered>
      <Modal.Body className={classes.newDiscussionWrapper}>
        <div className="modal-title">
          <span className="discussion-name">New discussion</span>
          <ModalWrapper>
            <span className="discussion-tag">Monoly security</span>
            <SuggestModal
              monolySecurity={true}
              modalName={"advanced-security-help-modal"}
              detailsList={ModalHelperContents.securityModal.contents}
            />
          </ModalWrapper>
        </div>
        <form>
          <FormGroup>
            <TextField
              className={"create-discussion-input"}
              InputLabelProps={{ disableAnimation: true }}
              label={
                <Fragment>
                  {isShowPlaceHolder && (
                    <div className="d-fldivex align-items-start">
                      <span className={classes.placeholder}>
                        Discussion title
                      </span>
                      <img
                        className={classes.importantIcon}
                        src={ImportantInputIcon}
                        alt="important-icon"
                      />
                    </div>
                  )}
                </Fragment>
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(event) => {
                enableSubmitBtn(
                  event.target.value && event.target.value.length > 0
                );
                setChannel({ ...channel, name: event.target.value });
              }}
            />
            <InviteMemberSelect
              setMembersValue={setMembersValue}
              options={options}
            />
            <div className="advanced-security-section">
              <div className="label">
                <Title>
                  <img src={SecurityIcon} alt="advanced-security" />
                  <span className="text">Advanced security</span>
                </Title>
                <ModalWrapper>
                  <SVG
                    src={HelpIcon}
                    alt="help-icon"
                    className="help-icon advance-security"
                  />
                  <SuggestModal
                    modalName={"advanced-security-help-modal"}
                    detailsList={
                      ModalHelperContents.advancedSecurityModal.contents
                    }
                  />
                </ModalWrapper>
              </div>
              <div className="switch">
                <Switch
                  color="primary"
                  onChange={(event) =>
                    setChannel({
                      ...channel,
                      isAdvanced: event.target.checked,
                      showAdvanceControl: event.target.checked,
                    })
                  }
                  female="true"
                />
              </div>
            </div>
            {channel.showAdvanceControl && (
              <Checklist className="advance-expand-option d-flex flex-column">
              
                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                    className="label-control-checklist"
                      control={
                        <Checkbox
                          checked={channel.isConfidential}
                          onChange={handleChangeConfidentiality}
                          icon={
                            <img src={UnCheckedIcon} alt="un-checked-icon" />
                          }
                          checkedIcon={
                            <img src={CheckedIcon} alt="checked-icon" />
                          }
                          size="small"
                        />
                      }
                      label={
                        <Fragment>
                          <div className="d-flex align-items-center">
                            <span className={`pr-1 ${channel.isConfidential ? "checked-title": ""}`}>
                              Require all collaborators to agree to
                              confidentiality
                            </span>
                          </div>
                        </Fragment>
                      }
                    />
                  </FormGroup>
                </FormControl>

                <span className="data-handling-title">Data handling</span>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="data"
                    value={dataHandling}
                    onChange={handleDataHandling}
                  >
                    <FormControlLabel
                    className="label-control-checklist"
                      value="NONE"
                      checked={
                        channel.isDeletable === false &&
                        channel.isLockable === false
                      }
                      control={
                        <Radio
                          icon={
                            <img src={UnCheckedIcon} alt="un-checked-icon" />
                          }
                          checkedIcon={
                            <img src={CheckedIcon} alt="checked-icon" />
                          }
                          classes={{
                            root: classes.radio,
                          }}
                          size="small"
                        />
                      }
                      label={
                        <Fragment>
                          <div className="d-flex align-items-center">
                              <span
                                  className={`pr-1 ${
                                    (channel.isDeletable === false && channel.isLockable === false) 
                                    ? "checked-title": 
                                    ""
                              }`}>
                              None
                            </span>
                          </div>
                        </Fragment>
                      }
                    />
                    <FormControlLabel
                    className="label-control-checklist"
                      value="LOCK"
                      checked={
                        channel.isDeletable === false &&
                        channel.isLockable === true
                      }
                      control={
                        <Radio
                          icon={
                            <img src={UnCheckedIcon} alt="un-checked-icon" />
                          }
                          checkedIcon={
                            <img src={CheckedIcon} alt="checked-icon" />
                          }
                          classes={{
                            root: classes.radio,
                          }}
                          size="small"
                        />
                      }
                      label={
                        <div className="d-flex align-items-center">
                          <span className={
                            `pr-1 ${
                                (channel.isDeletable === false && channel.isLockable === true) 
                                    ? "checked-title"
                                    : ""
                            }`}>
                            Lock and archive
                          </span>
                          <ModalWrapper>
                            <SVG
                              src={HelpIcon}
                              alt="help-icon"
                              className="help-icon advance-security"
                            />
                            <SuggestModal
                              modalName={"advanced-security-help-modal"}
                              title={ModalHelperContents.lockAndArchive.title}
                              detailsList={
                                ModalHelperContents.lockAndArchive.contents
                              }
                            />
                          </ModalWrapper>
                        </div>
                      }
                    />
                    <FormControlLabel
                    className="label-control-checklist"
                      value="DELETE"
                      checked={
                        channel.isDeletable === true &&
                        channel.isLockable === false
                      }
                      control={
                        <Radio
                          icon={
                            <img src={UnCheckedIcon} alt="un-checked-icon" />
                          }
                          checkedIcon={
                            <img src={CheckedIcon} alt="checked-icon" />
                          }
                          classes={{
                            root: classes.radio,
                          }}
                          size="small"
                        />
                      }
                      label={
                        <div className="d-flex align-items-center">
                           <span className={
                             `pr-1 ${
                                 (channel.isDeletable === true && channel.isLockable === false)
                                     ? "checked-title"
                                     : ""
                             }`}>
                            Delete for all
                          </span>
                          <ModalWrapper>
                            <SVG
                              src={HelpIcon}
                              alt="help-icon"
                              className="help-icon advance-security"
                            />
                            <SuggestModal
                              modalName={"advanced-security-help-modal"}
                              title={ModalHelperContents.deleteAll.title}
                              detailsList={
                                ModalHelperContents.deleteAll.contents
                              }
                            />
                          </ModalWrapper>
                        </div>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Checklist>
            )}
            <div className="d-flex justify-content-center">
              <Button
                className={
                  isSubmitBtnEnabled
                    ? classes.confirmButton
                    : classes.confirmButtonDisabled
                }
                disabled={!isSubmitBtnEnabled}
                onClick={isSubmitBtnEnabled && handleAddChannel}
              >
                Create discussion
              </Button>
            </div>
          </FormGroup>
        </form>
      </Modal.Body>
    </StyledModal>
  );
}

export default CreateDiscussionModal;
