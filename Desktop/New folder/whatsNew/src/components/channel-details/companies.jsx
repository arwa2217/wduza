import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import "./channel-details.css";
import DefaultUser from "../../assets/icons/default-company.svg";

const ChannelMemberStyle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;

  > img {
    width: 20px;
    height: 20px;
  }
  > p {
    width: 150px;
    margin: 0;
    margin-bottom: 0;
  }
  > button {
    justify-self: flex-end;
  }
`;

export default React.memo((props) => {
  const { t } = useTranslation();
  const { members } = useSelector((state) => state.channelMembers);

  const getUnique = (arr, key) => [...new Set(arr.map((o) => o[key]))];

  useEffect(() => {}, [members]);

  return (
    <div className="row w-100 ml-0 border-top">
      <div className="col-12 p-0">
        <div className="col-12 px-4">
          <h5 className="channel-info-heading">
            {!members
              ? "loading..."
              : `${
                  members.length > 0 &&
                  getUnique(members, "companyName")?.filter((el) => el !== "")
                    .length
                } ${t("organization")}`}
          </h5>
        </div>
        <div className="member-list-wrapper">
          {members &&
            members.length > 0 &&
            getUnique(members, "companyName")
              ?.filter((el) => el !== "")
              ?.map((user, index) => {
                return (
                  <ChannelMemberStyle key={`Fragment${user.id}`}>
                    <div className="member-wrapper px-4">
                      <div className="member-info align-items-center">
                        <img
                          className="ui avatar image"
                          src={DefaultUser}
                          alt="company profile"
                        />
                        <div className="pl-1 w-100 member-desc">
                          <div>
                            <span className="span_ellipsis">{user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ChannelMemberStyle>
                );
              })}
        </div>
      </div>
    </div>
  );
});
