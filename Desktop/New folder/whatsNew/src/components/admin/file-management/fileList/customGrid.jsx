import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import SortAsc from "../../../../../assets/icons/asc-sort.svg";
import SortDesc from "../../../../../assets/icons/desc-sort.svg";
import FilterDown from "../../../../../assets/icons/filter-down.svg";
import PostProfilePicture from "../postProfilePicture/postProfilePicture";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import File from "../../../file";
import FileActivity from "../../../fileActivity/fileActivity";
import { setSelectedFiles } from "../../../../store/actions/main-files-actions";
import { updateFilePanelState } from "../../../../store/actions/config-actions";

function CustomGrid(props) {
  const [allSelected, setAllSelected] = useState(false);
  const [fields, setFields] = useState(props.data);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortKey, setSortKey] = useState("");
  const currentUser = useSelector((state) => state.AuthReducer.user.id);
  let summaryFileDetails = useSelector(
    (state) => state.mainFilesReducer.summaryFileDetails
  );
  const dispatch = useDispatch();

  const onSort = (event, sortKey) => {
    if (sortKey) {
      const data = [...fields];
      data.sort((a, b) => {
        let firstKey = a[sortKey].toLowerCase(),
          secondKey = b[sortKey].toLowerCase();
        if (firstKey < secondKey) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (firstKey > secondKey) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
      setSortKey(sortKey);
      setSortDirection(sortDirection === "asc" ? "dsc" : "asc");
      setFields(data);
    }
  };

  const handleAllRowSelection = () => {
    let newFields = fields.map((field) => {
      return {
        ...field,
        checked: !allSelected,
      };
    });
    setFields(newFields);
    setAllSelected(!allSelected);
    dispatch(setSelectedFiles(newFields.filter((i) => i.checked)));
    if (newFields?.length)
      dispatch(updateFilePanelState(summaryFileDetails ? true : !allSelected));
  };

  const handleRowSelection = (item, index) => {
    let newState = [...fields];
    let currentValue = newState[index].checked;
    newState[index] = {
      ...fields[index],
      checked: !currentValue,
    };
    let isAllRowSelected = newState.every((el) => el.checked);
    setAllSelected(isAllRowSelected ? true : false);
    let selectedList = newState.filter((i) => i.checked);
    dispatch(setSelectedFiles(selectedList));
    dispatch(
      updateFilePanelState(summaryFileDetails ? true : selectedList?.length > 0)
    );
    setFields(newState);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="table-filter-icon">
        <img src={FilterDown} />
      </span>
    </span>
  ));

  const renderRow = () => {
    return fields.map((item, index) => {
      return (
        <div
          key={item.id}
          className={`custom-grid-cell  ${
            item && item.checked !== undefined && item.checked ? "selected" : ""
          }`}
        >
          <div className="custom-grid-header">
            <div className="custom-control custom-checkbox custom-checkbox-green">
              <input
                type="checkbox"
                className="custom-control-input custom-control-input-green"
                id={item.id}
                onChange={() => handleRowSelection(item, index)}
                checked={fields[index].checked}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor={item.id}
              ></label>
            </div>
            <PostProfilePicture
              post={message.post}
              src={message.src}
              user={message.user}
              showNameOnly={false}
              // isSystemMessage={isSystemMessage}
              isOwner={currentUser.id === message.user?.id}
            />
          </div>
          <div>
            <File channelFilesList={message.fileList} />
            <div style={{ padding: "0 20px" }}>
              {message.fileList.map((file) => (
                <FileActivity fileInfo={file} currentUser={currentUser} />
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="table-responsive">
      <div className="table custom-table mt-4">
        <div className="custom-table-head">
          <div className="custom-table-row">
            <div className="custom-table-cell flex-grow-0">
              <div className="custom-control custom-checkbox custom-checkbox-green">
                <input
                  type="checkbox"
                  className="custom-control-input custom-control-input-green"
                  id="all"
                  checked={allSelected}
                  onChange={handleAllRowSelection}
                />
                <label
                  className="custom-control-label pointer-on-hover"
                  htmlFor="all"
                ></label>
              </div>
            </div>
            <div className="custom-table-cell table-filter">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-filter-file">
                  File
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" active>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Read</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Unread</Dropdown.Item>
                  <Dropdown.Item href="#/action-4">My save</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="custom-table-cell text-center table-filter">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-filter-type">
                  Type
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" active>
                    All file type
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Document</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                  <Dropdown.Item href="#/action-4">Presentation</Dropdown.Item>
                  <Dropdown.Item href="#/action-5">Spreadsheet</Dropdown.Item>
                  <Dropdown.Item href="#/action-6">Image</Dropdown.Item>
                  <Dropdown.Item href="#/action-7">
                    Video &amp; Audio
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-8">Other file</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div
              className="custom-table-cell text-center table-sort"
              onClick={(e) => onSort(e, "size")}
            >
              Size
              <span className="table-sort-icon">
                {sortKey === "size" ? (
                  sortDirection === "asc" ? (
                    <img src={SortAsc} />
                  ) : (
                    <img src={SortDesc} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <div
              className="custom-table-cell text-center table-sort"
              onClick={(e) => onSort(e, "uploader")}
            >
              Uploader
              <span className="table-sort-icon">
                {sortKey === "uploader" ? (
                  sortDirection === "asc" ? (
                    <img src={SortAsc} />
                  ) : (
                    <img src={SortDesc} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <div
              className="custom-table-cell text-center table-sort"
              onClick={(e) => onSort(e, "uploadDate")}
            >
              Upload Date
              <span className="table-sort-icon">
                {sortKey === "uploadDate" ? (
                  sortDirection === "asc" ? (
                    <img src={SortAsc} />
                  ) : (
                    <img src={SortDesc} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <div
              className="custom-table-cell table-sort"
              onClick={(e) => onSort(e, "discussionFolder")}
            >
              Discussion/Folder
              <span className="table-sort-icon">
                {sortKey === "discussionFolder" ? (
                  sortDirection === "asc" ? (
                    <img src={SortAsc} />
                  ) : (
                    <img src={SortDesc} />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <div className="custom-table-cell text-center table-filter">
              <Dropdown>
                <Dropdown.Toggle
                  as={CustomToggle}
                  id="dropdown-filter-activity"
                >
                  Activity
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" active>
                    Downloaded by me
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Viewed by me</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Forwarded to internal by me
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-4">
                    Shared with external by me
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="custom-grid-body">
          <div className="custom-grid-row">{renderRow()}</div>
        </div>
      </div>
    </div>
  );
}

export default CustomGrid;
