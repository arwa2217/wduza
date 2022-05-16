import React, { useEffect, useState, useRef, Fragment } from "react";
import { Main } from "./styled";
import PlusIcon from "../../../assets/plus-icon.svg";
import logo1 from "../../../assets/c1.svg";
import logo2 from "../../../assets/c2.svg";
import logo3 from "../../../assets/c3.svg";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLastSelectedChannelId } from "../../../utilities/app-preference";
import CommonUtils from "../../utils/common-utils";
import ToggleCompanyIconDown from "../../../assets/icons/v2/ic_arrow_down.svg";
import ToggleCompanyIconUp from "../../../assets/icons/v2/ic_arrow_up.svg";
import MemberItem from "./MemberItem";
import DefaultAvatar from "./DefaultAvatar";
import SVG from "react-inlinesvg";

const bgCompany = [logo1, logo2, logo3];

const PopupAddUser = ({
  closePopupAdd,
  isOpenPopup,
  openPopupUser,
  channelCreator,
}) => {
  const [chanelMembers, setGlobalMembers] = useState([]);
  const [chanelCompanies, setChanelCompanies] = useState([]);
  const refWraper = useRef(null);
  const [currentMember, setCurrentMember] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const handleShow = (member, index) => {
    setCurrentMember({
      index: index,
      member: member,
    });
    setShow(true);
  };
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );

  useEffect(() => {
    const members = CommonUtils.getFilteredMembers(
      globalMembersList,
      getLastSelectedChannelId()
    );
    members?.sort((a, b) =>
      a.screenName.toLowerCase() > b.screenName.toLowerCase() ? 1 : -1
    );
    const channelCreatorIndex = members.findIndex(
      (item) => item.id === channelCreator
    );
    members.unshift(members.splice(channelCreatorIndex, 1)[0]);
    setGlobalMembers(members);
  }, [globalMembersList]);

  useEffect(() => {
    const companies = chanelMembers.map((item) =>
      item.companyName.toLowerCase()
    );
    const uniqueCompanies = companies?.filter((item, index) => {
      return companies.indexOf(item.toLowerCase()) === index;
    });
    setChanelCompanies(uniqueCompanies);
  }, [chanelMembers]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refWraper]);

  const handleClickOutside = (event) => {
    if (refWraper && !refWraper.current.contains(event.target)) {
      closePopupAdd(false);
      console.log("handleClickOutside");
    }
  };
  const channel = useSelector((state) => state.config.activeSelectedChannel);
  const channelStatus = useSelector((state) => state.channelDetails.status);

  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleUserAdd = (e) => {
    if (
      channel?.isOwner &&
      channelStatus !== "LOCKED" &&
      channelStatus !== "DELETED"
    ) {
      const modalType = ModalTypes.ADD_PEOPLE;
      const modalProps = {
        show: true,
        closeButton: true,
        skipButton: false,
        title: t("addPeople.modal:add.people"),
        modalType: modalType,
        channel: channel,
        currentMembers: chanelMembers,
      };
      dispatch(ModalActions.showModal(modalType, modalProps));
    }
  };
  return (
    <React.Fragment>
      <Main className="user-wrapper" ref={refWraper}>
        <div className="box-scroll">
          <div className="box companies">
            <p
              className="count-list d-flex justify-content-between w-100"
              style={{
                borderBottom: !isCollapse
                  ? "none"
                  : "1px solid rgba(0,0,0,0.08)",
              }}
              onClick={() => setIsCollapse(!isCollapse)}
            >
              {chanelCompanies.filter((item) => item !== "")?.length} Companies
              <SVG
                className="toggle-company-icon"
                src={isCollapse ? ToggleCompanyIconUp : ToggleCompanyIconDown}
                alt="toggle-company-up"
              />
            </p>
            {isCollapse && (
              <div className="list-inner">
                {chanelCompanies?.map((company, index) => {
                  return (
                    <Fragment key={index}>
                      {company !== "" && (
                        <div className="item-list">
                          <span className="avatar-item">
                            <DefaultAvatar companyName={company} />
                          </span>
                          <p className="name-item">{company}</p>
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="box users-list">
          <p className="count-list">{chanelMembers.length} members</p>
          <div className="list-inner">
            {chanelMembers?.map((member) => {
              return (
                <MemberItem
                  key={member.id}
                  member={member}
                  channelCreator={channelCreator}
                  isOwner={channel?.isOwner}
                  channel={channel}
                />
              );
            })}
          </div>
        </div>

        {channel?.isOwner && (
          <div className="box-fixed">
            <button
              className={`btn btn-block add-user-button ${
                channelStatus !== "LOCKED" && channelStatus !== "DELETED"
                  ? ""
                  : "disabled-add"
              }`}
              onClick={handleUserAdd}
            >
              <span onClick={handleUserAdd}>
                <img src={PlusIcon} alt="PlusIcon" />{" "}
                {t("addPeople.modal:add.people")}{" "}
              </span>
            </button>
          </div>
        )}
      </Main>
    </React.Fragment>
  );
};
export default PopupAddUser;
