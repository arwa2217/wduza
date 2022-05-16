/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

const Divider = styled.div`
  border-bottom: 1px solid #dedede;
  width: 100%;
  margin-bottom: 5px;
`;

const Button = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.type);
  return (
    <button
      onClick={(e) => {
        if (selectedValue === props.selectedValue) {
          props.handleFilterSelect("");
          setSelectedValue("");
        } else {
          props.handleFilterSelect(props.type);
          setSelectedValue(props.type);
        }
      }}
      className={
        props.closeOption
          ? "d-flex align-items-center tags-filter-position file-permission-filter-active"
          : `status-buttons d-flex w-100 justify-content-center ${
              selectedValue === props.selectedValue ?
                // ? props.permission
                  // ? "file-permission-filter-active" : 
                  "file-filter-active"
                : ""
            }`
      }
      style={
        props.closeOption && {
          border: "1px solid #03BD5D",
          background: "#03BD5D",
          color: "#ffffff",
          padding: "4px 10px 4px 13px",
          height: "20px",
          borderRadius: "2px",
        }
      }
    >
      {props.label}
      {props.closeOption ? (
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
      ) : (
        <></>
      )}
    </button>
  );
};

const FilesFilters = (props) => {
  const { t } = useTranslation();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        {props.selectedValue === "" ? (
          <h5 className="mb-0"> </h5>
        ) : props.selectedValue === "internal-in" ? (
          <Button
            handleFilterSelect={props.handleFilterSelect}
            label={t("file:filtered.modal:internal.in.office")}
            type="internal-in"
            selectedValue={props.selectedValue}
            closeOption={true}
          />
        ) : props.selectedValue === "internal-out" ? (
          <Button
            handleFilterSelect={props.handleFilterSelect}
            label={t("file:filtered.modal:internal.out.of.office")}
            type="internal-out"
            selectedValue={props.selectedValue}
            closeOption={true}
          />
        ) : props.selectedValue === "external" ? (
          <Button
            handleFilterSelect={props.handleFilterSelect}
            label={t("file:filtered.modal:external")}
            type="external"
            selectedValue={props.selectedValue}
            closeOption={true}
          />
        ) : (
          <></>
        )}
        {props.selectedPermissionValue === "" ? (
          <h5 className="mb-0"> </h5>
        ) : props.selectedPermissionValue === "ro" ? (
          <Button
            handleFilterSelect={props.handlePermissionFilterSelect}
            label={t("file:filtered.modal:view.only")}
            type="ro"
            selectedValue={props.selectedPermissionValue}
            closeOption={true}
            permission={true}
          />
        ) : props.selectedPermissionValue === "dl" ? (
          <Button
            handleFilterSelect={props.handlePermissionFilterSelect}
            label={t("file:filtered.modal:downloadable")}
            type="dl"
            selectedValue={props.selectedPermissionValue}
            closeOption={true}
            permission={true}
          />
        ) : (
          <></>
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
                  style={{ padding: "0 10px" }}
                >
                  <Button
                    handleFilterSelect={props.handleFilterSelect}
                    label={t("file:filtered.modal:internal.in.office")}
                    type="internal-in"
                    selectedValue={props.selectedValue}
                  />
                  <Button
                    handleFilterSelect={props.handleFilterSelect}
                    label={t("file:filtered.modal:internal.out.of.office")}
                    type="internal-out"
                    selectedValue={props.selectedValue}
                  />
                  <Button
                    handleFilterSelect={props.handleFilterSelect}
                    label={t("file:filtered.modal:external")}
                    type="external"
                    selectedValue={props.selectedValue}
                  />
                </div>
                <Divider />
                <div
                  className="user-filter file-filter"
                  style={{ padding: "0 20px" }}
                >
                  <Button
                    handleFilterSelect={props.handlePermissionFilterSelect}
                    label={t("file:filtered.modal:view.only")}
                    type="ro"
                    selectedValue={props.selectedPermissionValue}
                  />
                  <Button
                    handleFilterSelect={props.handlePermissionFilterSelect}
                    label={t("file:filtered.modal:downloadable")}
                    type="dl"
                    selectedValue={props.selectedPermissionValue}
                  />
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
