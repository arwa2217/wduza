import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import SignatureIcon from "../../../assets/icons/v2/ic_signature.svg";
import StampIcon from "../../../assets/icons/v2/ic_stamp.svg";
import TextIcon from "../../../assets/icons/v2/ic_text.svg";
import CommentIcon from "../../../assets/icons/v2/ic_comment.svg";
import AttachmentIcon from "../../../assets/icons/v2/ic_eattach.svg";
import HelpIcon from "../../../assets/icons/v2/ic_union.svg";
import ArrowUp from "../../../assets/icons/attach-arrow-up.svg";
import ArrowDown from "../../../assets/icons/attach-arrow-down.svg";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import { useTranslation } from "react-i18next";

const colorPalette = (index) => {
  switch (index) {
    case 0:
      return "#F16354";
    case 1:
      return "#FFC700";
    case 2:
      return "#03BD5D";
    case 3:
      return "#0796FF";
    case 4:
      return "#CB46EC";
    default:
      return "#F16354";
  }
};
const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img src={props.selectProps.menuIsOpen ? ArrowUp : ArrowDown} alt="" />
      </components.DropdownIndicator>
    )
  );
};
const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export default function PDFEditorActions(props) {
  const { t } = useTranslation();
  const esignRecipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const [allOptions, setAllOptions] = useState([]);
  const [selectedSignee, setSelectedSignee] = useState("");
  useEffect(() => {
    let list = [...esignRecipientList];
    let newList = [];
    list.forEach((el, index) => {
      if (el?.signNeeded) {
        let obj = {};
        obj.label = el.name;
        obj.value = el.email;
        obj.color = colorPalette(index);
        newList.push(obj);
      }
    });
    setAllOptions(newList);
    setSelectedSignee(newList[0]);
  }, [esignRecipientList]);

  //  DO NOT REMOVE COMMENTED CODE
  const signeeSelectStyles = {
    control: () => ({
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "4px",
      width: "100%",
      height: "32px",
      display: "flex",
    }),
    container: () => ({
      width: "100%",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    // singleValue: () => ({
    //   overflow: "visible",
    //   position: "unset",
    //   textOverflow: "unset",
    //   whiteSpace: "unset",
    //   color: "#308F65",
    //   textDecorationLine: "underline",
    //   textDecorationOffset: "2px",
    //   fontSize: "14px",
    //   cursor: "pointer",
    // }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    indicatorContainer: () => ({
      width: "100%",
    }),
    // dropdownIndicator: () => ({
    //   color: "#308F65 !important",
    //   marginRight: "5px",
    // }),
    // menuList: () => ({
    //   paddingTop: 0,
    //   direction: "ltr",
    // }),
    menu: () => ({
      width: "80%",
      zIndex: "10 !important",
      background: "white",
      height: "150px",
      overflow: "auto",
      boxShadow: "0px 0px 4px rgba(76, 99, 128, 0.3)",
      color: "#19191A",
    }),
    // option: (provided, { data, isDisabled, isFocused, isSelected }) => {
    //   return {
    //     ...provided,
    //     backgroundColor: isFocused ? "transparent" : null,
    //     color: "#19191A",
    //     height: "50px",
    //     padding: "18px 0 18px 20px",
    //     fontSize: "14px",
    //     "&:hover": {
    //       backgroundColor: "#F8F8F8",
    //       color: "#308F65",
    //       padding: "18px 0 18px 20px",
    //       fontSize: "14px",
    //       cursor: "pointer",
    //     },
    //   };
    // },
  };

  const handleRecipientChange = (e) => {
    setSelectedSignee(e);
  };
  return (
    <div className="file-action-container">
      <Row>
        <Col md={12}>
          <div className="custom-button-div">
            <div className="custom-select-box">
              <Select
                // components={{ DropdownIndicator }}
                name="selectedSignee"
                isSearchable={false}
                value={selectedSignee}
                // menuShouldBlockScroll={false}
                onChange={(e) => {
                  handleRecipientChange(e);
                }}
                defaultValue={allOptions[0]}
                options={allOptions}
                // menuPlacement="auto"
                styles={signeeSelectStyles}
              />
            </div>
            <div className="custom-button-box">
              <img
                src={SignatureIcon}
                alt="signature"
                style={{ borderColor: "#FA7E1E" }}
                onClick={() => {
                  props.addField("SIGNATURE", {}, selectedSignee);
                }}
              />
            </div>
            <div className="custom-button-box">
              <img
                src={StampIcon}
                alt="stamp"
                style={{ borderColor: "#FA7E1E" }}
                onClick={() => {
                  props.addField("STAMP", {}, selectedSignee);
                }}
              />
            </div>
            <div className="custom-button-box">
              <img
                src={TextIcon}
                alt="text"
                style={{ borderColor: "#FA7E1E" }}
                onClick={() => {
                  props.addTextField("TEXT", {}, selectedSignee);
                }}
              />
            </div>
            <div className="custom-button-box">
              <img
                src={CommentIcon}
                alt="comment"
                style={{ borderColor: "#FA7E1E" }}
                onClick={() => {
                  props.addField("CHECK", {}, selectedSignee);
                }}
              />
            </div>
            <div className="custom-button-box">
              <img
                src={AttachmentIcon}
                alt="attach"
                style={{ borderColor: "#FA7E1E" }}
                onClick={() => {
                  props.addField("ATTACH", {}, selectedSignee);
                }}
              />
            </div>
            {/* <div className="custom-button-box">
              <button onClick={() => props.applyFields()}>save</button>
            </div> */}
          </div>
        </Col>
      </Row>
    </div>
  );
}
