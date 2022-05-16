import React from "react";
import { Button, Header, Modal } from "semantic-ui-react";
import CloseIcon from "../../../assets/icons/close.svg";
import { fetchHistoryDetails } from "../../../store/actions/tag-actions";
import { useDispatch, useSelector } from "react-redux";
import File from "@toolbar/file.svg";
import timeHistoryIcon from "../../../assets/icons/times-history.svg";
import { useTranslation } from "react-i18next";
import moment from "moment";

function PostHistoryModal(props) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const postHistory = useSelector((state) => state.tagReducer.historyPostList);
  const modifyData = postHistory ? postHistory.data : "";

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(fetchHistoryDetails(props.post.id));
  };
  let date = moment(props.post.updatedAt).format("ddd,MMM D, hh:mmA");

  return (
    <Modal
      closeIcon={
        <Button
          onClick={(e) => e.stopPropagation()}
          style={{ background: "none", float: "right", marginTop: "10px" }}
        >
          <img alt="Close" src={CloseIcon} />
        </Button>
      }
      open={open}
      className="post-history"
      trigger={
        <div
          onClick={(e) => handleChange(e)}
          className="post__time edited__post__time"
        >
          {t("post:edited")} {date}
        </div>
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header
        content={
          props.post.type === "TASK"
            ? t("post:post.history:content.heading.task")
            : t("post:post.history:content.heading")
        }
      />

      <Modal.Content>
        <h6 className="post-heading">{t("post:edited")}</h6>
        {modifyData &&
          modifyData.history &&
          modifyData.history.length > 0 &&
          modifyData.history.map((el) => {
            return (
              <>
                <div className="post-history-content">
                  <div className="d-flex">
                    <div className="edit-icon">
                      <img alt="" src={timeHistoryIcon} />
                    </div>
                    <div className="edit-content">
                      <div className="edit-time">
                        {new Date(el.post.updatedAt * 1000)
                          .toString()
                          .slice(0, 10) +
                          ", " +
                          new Date(el.post.updatedAt * 1000)
                            .toLocaleTimeString("en-US")
                            .slice(0, 5) +
                          " " +
                          new Date(el.post.updatedAt * 1000)
                            .toLocaleTimeString("en-US")
                            .slice(8)}
                      </div>
                      <div
                        className="post-msg"
                        dangerouslySetInnerHTML={{ __html: el.post.content }}
                      />
                    </div>
                  </div>
                  {el.fileInfo && el.fileInfo.fileName && (
                    <div className="edit-file-wrapper">
                      <div className="edit-file">
                        <img alt="" src={File} /> {el.fileInfo.fileName}
                      </div>
                    </div>
                  )}
                  {/* <div className="edit-line" /> */}
                </div>
              </>
            );
          })}
        {modifyData && modifyData.post && (
          <div>
            <h6 className="post-heading">
              {t("post:post.history:posted")} <br />
            </h6>
            <div className="post-history-content">
              <div className="d-flex">
                <div className="edit-icon">
                  <img alt="" src={timeHistoryIcon} />
                </div>
                <div className="edit-content">
                  <div className="edit-time">
                    {new Date(modifyData.post.createdAt)
                      .toString()
                      .slice(0, 10) +
                      ", " +
                      new Date(modifyData.post.createdAt)
                        .toLocaleTimeString("en-US")
                        .slice(0, 5) +
                      "" +
                      new Date(modifyData.post.createdAt)
                        .toLocaleTimeString("en-US")
                        .slice(8)}
                  </div>
                  <div
                    className="post-msg"
                    dangerouslySetInnerHTML={{
                      __html: modifyData.post.content,
                    }}
                  />
                </div>
              </div>
            </div>

            {modifyData && modifyData.fileInfo && modifyData.fileInfo.fileName && (
              <div>
                <img alt="" src={File} /> {modifyData.fileInfo.fileName}
              </div>
            )}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}

export default PostHistoryModal;
