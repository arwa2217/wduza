import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { useSelector, useDispatch } from "react-redux";
import { getUsersFolderListByAdmin } from "../../../store/actions/admin-account-action";
import { getFileSize } from "../../utils/file-utility";
import "./account-management.css";
import { useTranslation } from "react-i18next";

const LIMIT = 10;
function FileFolder(props) {
  const { t } = useTranslation();
  const adminFolderList = useSelector(
    (state) => state.AdminAccountReducer.adminFolderList
  );
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(LIMIT);

  const selectedUserId = useSelector(
    (state) => state.config.adminSelectedRow?.id
  );

  useEffect(() => {
    if (selectedUserId) {
      dispatch(getUsersFolderListByAdmin(selectedUserId));
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (adminFolderList) {
      setList(
        adminFolderList?.folderList && adminFolderList?.folderList.length
          ? adminFolderList?.folderList.slice(0, LIMIT)
          : []
      );
      setShowMore(
        adminFolderList?.folderList && adminFolderList?.folderList.length > 10
      );
    }
  }, [adminFolderList]);
  const loadMore = () => {
    const newIndex = index + LIMIT;
    const newShowMore = newIndex < adminFolderList?.folderList.length;
    const newList = list.concat(
      adminFolderList?.folderList.slice(index, newIndex)
    );
    setIndex(newIndex);
    setList(newList);
    setShowMore(newShowMore);
  };
  return (
    <div className="w-100 pd-20 border-top">
      <Table className="custom-sidebar-table">
        <thead>
          <tr>
            <th>Folder</th>
            <th className="text-right text-primary">
              {getFileSize(adminFolderList?.totalFolderSize)}
            </th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((folder, i) => {
              return (
                <tr>
                  <td>
                    {folder?.folderName} <strong>{folder?.totalFiles}</strong>
                  </td>
                  <td className="text-right">
                    {getFileSize(folder?.totalSize)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={2} className="text-center">
                {t("no.data.available")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="load-more-container text-center">
        {showMore && (
          <a className="load-more" onClick={loadMore} href>
            {t("more")}
          </a>
        )}
      </div>
    </div>
  );
}
export default FileFolder;
