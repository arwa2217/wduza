/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const FilesFilters = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.selectedValue);
  const { t } = useTranslation();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        {selectedValue === "" ? (
          <h5 className="mb-0"> </h5>
        ) : selectedValue === "uploaded" ? (
          <button
            className={`d-flex align-items-center m-0 tags-filter-position`}
            style={{
              border: "1px solid #03BD5D",
              background: "#03BD5D",
              color: "#ffffff",
              padding: "4px 10px 4px 13px",
              height: "20px",
              borderRadius: "2px",
            }}
          >
            {selectedValue === "uploaded"
              ? t("file:filtered.modal:my.upload")
              : ""}
            <span
              className="pl-2"
              style={{
                fontSize: "19px",
                lineHeight: "10px",
                fontWeight: "normal",
              }}
              onClick={() => {
                props.handleFilterSelect("");
                setSelectedValue("");
              }}
            >
              &times;
            </span>
          </button>
        ) : (
          <button
            className={`d-flex align-items-center m-0 tags-filter-position`}
            style={{
              border: "1px solid #03BD5D",
              background: "#03BD5D",
              color: "#ffffff",
              padding: "4px 10px 4px 13px",
              height: "20px",
              borderRadius: "2px",
            }}
          >
            {selectedValue === "downloaded"
              ? t("file:filtered.modal:my.download")
              : ""}
            <span
              className="pl-2"
              style={{
                fontSize: "19px",
                lineHeight: "10px",
                fontWeight: "normal",
              }}
              onClick={() => {
                props.handleFilterSelect("");
                setSelectedValue("");
              }}
            >
              &times;
            </span>
          </button>
        )}
      </div>
      <a
        href
        className="filter__icon"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </a>
    </div>
  ));

  return (
    <div className="post-tag-menu post-task-menu-filter post-files-menu-filter">
      <Dropdown>
        <Dropdown.Toggle
          menuAlign="right"
          as={CustomToggle}
          id="dropdown-button-drop-left"
        ></Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white file-dropdown-menu"
        >
          <Dropdown.Header className="menu-header">
            {t("file:filtered.modal:click.to.filter")}
          </Dropdown.Header>
          <div className="dropdown-content">
            <div className="dropdown-content">
              <div className="task-modal">
                <div
                  className="user-filter file-filter"
                  style={{ padding: "0 20px" }}
                >
                  <button
                    onClick={(e) => {
                      if (selectedValue === "uploaded") {
                        props.handleFilterSelect("");
                        setSelectedValue("");
                      } else {
                        props.handleFilterSelect("uploaded");
                        setSelectedValue("uploaded");
                      }
                    }}
                    className={`status-buttons d-flex w-100 justify-content-center ${
                      selectedValue === "uploaded" ? "file-filter-active" : ""
                    }`}
                  >
                    {t("file:filtered.modal:my.upload")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue === "downloaded") {
                        props.handleFilterSelect("");
                        setSelectedValue("");
                      } else {
                        props.handleFilterSelect("downloaded");
                        setSelectedValue("downloaded");
                      }
                    }}
                    className={`status-buttons d-flex w-100 justify-content-center ${
                      selectedValue === "downloaded" ? "file-filter-active" : ""
                    }`}
                  >
                    {t("file:filtered.modal:my.download")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FilesFilters;
