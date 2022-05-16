import React, { useEffect, useState } from "react";
import "./discussion-list-header.css";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../../assets/icons/filter_nor_union.svg";
import FilterNor from "../../assets/icons/filter-nor.svg";
import newDiscussion from "../../assets/icons/v2/ic_new_discussion.svg";
import newDiscussionActive from "../../assets/icons/v2/ic_new_discussion_active.svg";
import searchIcon from "../../assets/icons/v2/ic_search_discussion.svg";
import searchIconActive from "../../assets/icons/v2/ic_search_discussion_active.svg";
import cancelIcon from "../../assets/icons/v2/ic_cancel_circle.svg";
// import subtract from "../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";
import { MENU_ITEMS } from "../../constants/menu-items";
import {
  setActiveMenuItem,
  setActivePanelAction,
} from "../../store/actions/config-actions";
import Panel from "../actionpanel/panel";
import UserType from "../../constants/user/user-type";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import CollectionServices from "../../services/collection-services";
import { getCollectionData } from "../../store/actions/collection-action";
import SVG from "react-inlinesvg";
import styled from "styled-components";

const SearchBoxWrapper = styled.div`
  .btn-cancel {
    color: #00a95b;
    font-size: 14px;
    margin-left: 16px;
    cursor: pointer;
  }
  .inner-container {
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    padding: 6px;
    height: 32px;
    align-items: center;
    svg {
      fill: rgba(0, 0, 0, 0.5);
    }
    .ic-cancel {
      cursor: pointer;
      margin-right: 2px;
    }
  }
  .input-middle {
    color: rgba(0, 0, 0, 0.9);
    caret-color: #00a95b;
    text-indent: 6px;
  }
`;

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.black90,
    fontWeight: "bold",
    fontSize: "16px",
    maxWidth: "250px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    lineHeight: "134%",
  },
  totalDiscussions: {
    color: theme.palette.text.black50,
    fontSize: "12px",
    marginTop: "3px",
    // backgroundColor: "red",
  },
  hoverIcon: {
    // backgroundColor: "pink",
    "& img:last-child": {
      display: "none",
    },
    "&:hover": {
      "& img:first-child": {
        display: "none",
      },
      "& img:last-child": {
        display: "block",
      },
    },
  },
}));

function DiscussionListHeader(props) {
  const { deletedList = [] } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const currentUser = useSelector((state) => state.AuthReducer.user);
  let title = `${currentUser?.companyName}`;
  const [inputs, setInputs] = useState("");
  const [discussionCount, setDiscussionCount] = useState(0);
  // get latest data
  const getCollections = async () => {
    const result = await CollectionServices.getCollections();
    const collections = result?.data?.collections;
    const collection = collections.find(
      (item) => item.id === props?.activeCollection?.id
    );
    setDiscussionCount(collection?.channelCount);
  };

  useEffect(() => {
    getCollections();
  }, [deletedList.length, props?.activeCollection?.id]);
  const [
    isUpdatedHeaderDiscussionVisible,
    setUpdatedHeaderDiscussionVisiblity,
  ] = useState(false);

  let { name } = inputs;
  function filterDiscussion() {
    props.toggleFilter();
  }
  function searchDiscussionList(e) {
    props.handleNameChange(e.target.value);
  }

  const onHandleCloseSearchBox = (e) => {
    props.resetInputValue(e);
    setUpdatedHeaderDiscussionVisiblity(false);
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.AuthReducer.user);
  let activeMenu = useSelector((state) => state.config.activeMenuItem);
  const handleCreateDiscussion = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const modalType = ModalTypes.NEW_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      ...props,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };
  const numberChanel =
    props?.activeCollection?.id === "ALL"
      ? props?.filterList?.length === 0
        ? "Empty discussions"
        : `${props?.filterList?.length} discussions`
      : props.activeCollection?.channelCount <= 0 && discussionCount <= 0
      ? "Empty discussions"
      : `${discussionCount} discussions`;
  const updatedDiscussionHeader = (
    <SearchBoxWrapper className="discussion-header-outer-container">
      {/*<div className="image-container">*/}
      {/*  <img*/}
      {/*    src={searchIcon}*/}
      {/*    alt="search"*/}
      {/*    // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}*/}
      {/*    // className="image"*/}
      {/*  />*/}
      {/*</div>*/}
      <div className="inner-container">
        <SVG height={16} width={16} src={searchIcon} alt="search" />
        <input
          onChange={props.handleSearchDiscussion}
          placeholder={t("discussion:search.discussion.filter")}
          maxLength="80"
          value={props.value}
          className="input-middle"
          autoFocus
        />
        {props.value && (
          <SVG
            src={cancelIcon}
            alt="cancel"
            onClick={props.onClearValue}
            className="ic-cancel"
          />
        )}
      </div>
      <div className="btn-cancel" onClick={(e) => onHandleCloseSearchBox(e)}>
        Cancel
      </div>
    </SearchBoxWrapper>
  );
  const defaultDiscussionHeader = (
    <div className="discussion-header-outer-container">
      <div style={{ maxWidth: "228px" }}>
        <div className={classes.title} title={props?.activeCollection?.name}>
          {props?.activeCollection?.name}
        </div>

        <div className={classes.totalDiscussions}>{numberChanel}</div>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {/*<img*/}
        {/*  src={props.isActiveFilter ? FilterNor : Filter}*/}
        {/*  alt="union"*/}
        {/*  style={{ cursor: "pointer" }}*/}
        {/*  onClick={() => filterDiscussion()}*/}
        {/*  className="image-filter-union"*/}
        {/*/>*/}
        {user.userType !== UserType.GUEST && (
          <div className={classes.hoverIcon}>
            <img
              src={newDiscussion}
              alt="newDiscussion"
              className="image"
              style={{ marginRight: "6px" }}
              onClick={handleCreateDiscussion}
            />
            <img
              src={newDiscussionActive}
              alt="newDiscussion"
              className="image"
              style={{ marginRight: "6px" }}
              onClick={handleCreateDiscussion}
            />
          </div>
        )}
        <div className={classes.hoverIcon}>
          <img
            src={searchIcon}
            alt="searchIcon"
            className="image"
            onClick={() => {
              setUpdatedHeaderDiscussionVisiblity(true);
            }}
          />
          <img
            src={searchIconActive}
            alt="searchIcon"
            className="image"
            onClick={() => {
              setUpdatedHeaderDiscussionVisiblity(true);
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div id="discussion-list-header-id" className="discussion-list-header">
      {/* <p className="discussion-list-header-title">
        {title}
      </p> */}

      {/* <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        value={props.inputs}
                        maxLength="50"
                        placeholder="Type discussion name here"
                        onChange= {props.handleSearchDiscussion}
                      />

          <InputGroup.Append>
          <span onClick={props.resetInputValue}></span>
          </InputGroup.Append>
      </InputGroup>
      <img src={searchIcon} className="icon-search" />
      <img src={inactiveFilter} className="icon-search"/>
      <button className={`btn discussion-list-header-filter`}
              type="button"
              onClick={filterDiscussion}>
        <img src={props.isActiveFilter ? Filter : inactiveFilter} />
      </button> */}

      {isUpdatedHeaderDiscussionVisible
        ? updatedDiscussionHeader
        : defaultDiscussionHeader}
    </div>
  );
}

export default DiscussionListHeader;
