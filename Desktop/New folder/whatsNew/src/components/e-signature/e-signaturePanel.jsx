import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ESIGNATURE_MENU_ITEMS } from "../../constants/esignature-menu-items";
import { setActiveFileMenuItem } from "../../store/actions/config-actions";
import { ClearFileSearchResultAction } from "../../store/actions/folderAction";
import "./e-signaturePanel.css";
import ESignatureFolderList from "./e-signatureFolderList";
// import EsignFolderList from "./e-signFolderList";

function ESignaturePanel(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearFileSearchResultAction());
    dispatch(
      setActiveFileMenuItem({
        folderName: "Inbox",
        fileKey: ESIGNATURE_MENU_ITEMS.ESIGNATURE_INBOX,
      })
    );
  }, []);

  return (
    <div className="files-panel">
      <ESignatureFolderList />
    </div>
  );
}

export default ESignaturePanel;
