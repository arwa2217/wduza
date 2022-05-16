import React, { useEffect, useState } from "react";
import "./e-signatureFolderList.css";
import FilesListHeader from "../files/filesListHeader";
import { useDispatch, useSelector } from "react-redux";
import FilesListItem from "../files/filesListItem";
import Inbox from "../../assets/icons/v2/ic_esignature_inbox.svg";
import InboxActive from "../../assets/icons/v2/ic_esignature_inbox_active.svg";
import SentItems from "../../assets/icons/v2/ic_sent_items.svg";
import SentItemsActive from "../../assets/icons/v2/ic_sent_item_active.svg";
import DeletedItems from "../../assets/icons/v2/ic_delete_items.svg";
import DeletedItemsActive from "../../assets/icons/v2/ic_delete_items_active.svg";
import { ESIGNATURE_MENU_ITEMS } from "../../constants/esignature-menu-items";
import ESignatureListHeader from "./e-signatureListHeader";
import ESignatureFolderListItem from "./e-signatureFolderListItem";
import { SignatureState } from "./constants";
import { setActiveFileMenuItem } from "../../store/actions/config-actions";
import {
  setEsignatureFolder,
  switchPanelView,
} from "../../store/actions/esignature-actions";

function ESignatureFolderList(props) {
  const dispatch = useDispatch();
  const folderList = useSelector((state) => state.folderReducer.folderList);
  const allFilesCount = useSelector(
    (state) => state.esignatureReducer.esignatureList.allCount
  );
  const needToSignCount = useSelector(
    (state) => state.esignatureReducer.esignatureList.needToSignCount
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

  useEffect(() => {
    dispatch(
      setActiveFileMenuItem({
        fileKey: ESIGNATURE_MENU_ITEMS.ESIGNATURE_INBOX,
        folderName: "Inbox",
        totalFiles: needToSignCount,
        icon: Inbox,
        showTotalSize: false,
        showUsedSpace: false,
        showUnreadCount: false,
      })
    );
    dispatch(setEsignatureFolder("Inbox".toUpperCase().split(" ")[0]));
    dispatch(switchPanelView(SignatureState.DEFAULT));
  }, []);

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
    <div className="esign-folder-list">
      <ESignatureListHeader
        toggleFilter={() => filterToggled()}
        isActiveFilter={filterState}
        handleSearchDiscussion={handleNameChange}
        value={inputs}
        resetInputValue={resetInputValue}
      />
      <div className="esign-folder-list-body">
        <ESignatureFolderListItem
          fileKey={ESIGNATURE_MENU_ITEMS.ESIGNATURE_INBOX}
          folderName={"Inbox"}
          totalFiles={needToSignCount}
          icon={Inbox}
          selectedIcon={InboxActive}
          showTotalSize={false}
          showUsedSpace={false}
          showUnreadCount={false}
        />
        <ESignatureFolderListItem
          fileKey={ESIGNATURE_MENU_ITEMS.ESIGNATURE_SENT_ITEMS}
          totalFiles={allFilesCount}
          folderName={"Sent items"}
          icon={SentItems}
          selectedIcon={SentItemsActive}
          showUsedSpace={false}
          showTotalSize={false}
          showUnreadCount={false}
        />
        <ESignatureFolderListItem
          fileKey={ESIGNATURE_MENU_ITEMS.ESIGNATURE_DELETED_ITEMS}
          totalFiles={allFilesCount}
          folderName={"Deleted items"}
          icon={DeletedItems}
          selectedIcon={DeletedItemsActive}
          showTotalSize={false}
          showUsedSpace={false}
          showUnreadCount={false}
        />
      </div>
    </div>
  );
}

export default ESignatureFolderList;
