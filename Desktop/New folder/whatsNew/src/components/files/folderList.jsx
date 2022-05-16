import React, { useEffect, useState } from "react";
import "./folderList.css";
import FilesListHeader from "./filesListHeader";
import { useSelector } from "react-redux";
import FilesListItem from "./filesListItem";
import AllFiles from "../../assets/icons/all-files.svg";
import PopularFiles from "../../assets/icons/popular-files.svg";
import RecentFiles from "../../assets/icons/recent-files.svg";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";

function FolderList(props) {
  const folderList = useSelector((state) => state.folderReducer.folderList);
  const allFilesCount = useSelector(
    (state) => state.folderReducer.allFilesCount
  );
  const [filterState, setFilterState] = useState(false);
  const [inputs, setInputs] = useState("");
  const [filterList, setFilterList] = useState(
    folderList !== undefined && folderList.length > 0 ? [...folderList] : []
  );
  const fileQuotaAllowed = useSelector(
    (state) => state.fileReducer.channelFilesStorage?.fileQuotaAllowed
  );
  const fileQuotaUsed = useSelector(
    (state) => state.fileReducer.channelFilesStorage?.fileQuotaUsed
  );

  useEffect(
    () =>
      setFilterList(
        folderList?.sort((a, b) => {
          let fa = a.folderName.toLowerCase(),
            fb = b.folderName.toLowerCase();
          if (fa < fb) return -1;
          if (fa > fb) return 1;
          return 0;
        })
      ),
    [folderList]
  );

  function filterToggled() {
    setFilterState(!filterState);
  }
  function resetInputValue(event) {
    event.preventDefault();
    setInputs("");
    applyFilter("");
    setFilterList([...folderList]);
  }

  function handleNameChange(e) {
    e.preventDefault();
    let value = e.target.value;
    //remove leading white space, Used replace method as trimStart does not support by IE browser
    value = value.replace(/^\s+/g, "");

    setInputs(value);
    applyFilter(value);
  }

  function applyFilter(filterValue, originalDataList) {
    let tempFilterList = [];
    filterValue = filterValue === undefined ? "" : filterValue;
    let masterList = folderList;
    // let masterList = folderList === undefined || folderList.length === 0
    //   ? displayList
    //   : folderList;
    if (filterValue.length > 0) {
      for (let i = 0; i <= masterList?.length - 1; i++) {
        let x = masterList[i]?.folderName.trim().toLowerCase();
        if (x.includes(filterValue.toLowerCase())) {
          tempFilterList.push(masterList[i]);
        }
      }
      setFilterList(tempFilterList);
    } else {
      setFilterList(masterList);
    }
  }
  return (
    <div className="folder-list">
      <FilesListHeader
        toggleFilter={() => filterToggled()}
        isActiveFilter={filterState}
        handleSearchDiscussion={handleNameChange}
        value={inputs}
        resetInputValue={resetInputValue}
      />
      <div className="folder-list-body">
        <FilesListItem
          fileKey={FILES_MENU_ITEMS.FILES_ALL}
          folderName={"All files"}
          totalFiles={allFilesCount}
          description={""}
          icon={AllFiles}
          usedSpace={fileQuotaUsed * 1024}
          totalSize={fileQuotaAllowed * 1024}
          showTotalSize={true}
          showUsedSpace={true}
          showUnreadCount={true}
        />
        <FilesListItem
          fileKey={FILES_MENU_ITEMS.FILES_POPULAR}
          totalFiles={0}
          folderName={"Popular"}
          icon={PopularFiles}
          showUsedSpace={false}
          showTotalSize={false}
          showUnreadCount={false}
        />
        <FilesListItem
          fileKey={FILES_MENU_ITEMS.FILES_RECENT}
          totalFiles={0}
          folderName={"Recent"}
          icon={RecentFiles}
          showTotalSize={false}
          showUsedSpace={false}
          showUnreadCount={false}
        />
        {filterList?.length ? (
          filterList.map((file, ind) => (
            <FilesListItem
              {...file}
              key={ind}
              folderName={file.folderName}
              totalFiles={file.totalFiles}
              description={file.description}
              usedSpace={file.totalSize}
              showTotalSize={false}
              showUsedSpace={true}
              showUnreadCount={true}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default FolderList;
