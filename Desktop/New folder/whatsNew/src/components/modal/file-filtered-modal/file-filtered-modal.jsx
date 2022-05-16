import React, { useState } from "react";
import "./file-filtered-modal.css";
import filterNor from "../../../assets/icons/file-type/filter_nor.png";
import plus from "../../../assets/icons/file-type/plus.png";
import ProgressBar from "react-bootstrap/ProgressBar";
import grayFilter from "../../../assets/icons/filter_nor_union.svg";
import { useTranslation } from "react-i18next";

const FileFilteredModal = (props) => {
  const { t } = useTranslation();

  const [selectedText, setSelectedText] = useState({
    Decision: false,
    Important: false,
  });

  const [isFilteredBoxVisible, setFilteredBoxVisible] = useState(false);
  const [filteredValues, setFilteredValues] = useState([]);

  const onFilteredHandler = (value) => {
    if (filteredValues.includes(value)) {
      setSelectedText({ ...selectedText, [value]: false });
      setFilteredValues(filteredValues.filter((f_value) => f_value !== value));
    } else {
      setSelectedText({ ...selectedText, [value]: true });
      setFilteredValues([...filteredValues, value]);
    }
  };

  return (
    <div className="outer-container">
      <text className="small-font-size text-gray-color">
        AI Yangjae Hub: 100GB in total
      </text>
      <div className="available-data">
        <text className="regular-font-size text-gray-color">64.2GB/ 100GB</text>
        <text className="small-font-size text-gray-color">
          35.8 GB Available
        </text>
      </div>
      <ProgressBar now={60} variant={"Progress-red"} />
      <div className="filter-container">
        {!!filteredValues &&
          filteredValues.map((value) => (
            <filteredValueDisplay className="filter-value-display">
              {
                <>
                  <text className="regular-font-size white-color">{value}</text>
                  <img
                    src={plus}
                    className="cross-button"
                    alt="plus"
                    onClick={() => onFilteredHandler(value)}
                  />
                </>
              }
            </filteredValueDisplay>
          ))}
        <img
          className="filter-nor"
          src={isFilteredBoxVisible ? filterNor : grayFilter}
          alt="union"
          onClick={() => setFilteredBoxVisible(!isFilteredBoxVisible)}
        />
      </div>

      {!!isFilteredBoxVisible && (
        <div className="filter-box-main-container">
          <text className="click-to-filter">
            {t("file:filtered.modal:click.to.filter")}
          </text>

          <div className="inner-container">
            <div className="filter-button-container">
              <text
                className={
                  "text " +
                  (!!selectedText.Decision
                    ? "updated-filter-box-text"
                    : "default-filter-box-text")
                }
                onClick={() => onFilteredHandler("Decision")}
              >
                {t("file:filtered.modal:Decision")}
              </text>

              <text
                className={
                  "text " +
                  (!!selectedText.Important
                    ? "updated-filter-box-text"
                    : "default-filter-box-text")
                }
                onClick={() => onFilteredHandler("Important")}
              >
                {t("file:filtered.modal:important")}
              </text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileFilteredModal;
