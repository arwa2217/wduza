import React from "react";
import {
  StyledDiv,
  StyledImg,
  Name,
  Details,
} from "./styles/participant-style";
import DefaultUser from "../../../assets/icons/default-user.svg";

function Participant(props) {
  return (
    <StyledDiv key={`user${props.user.id}`}>
      <StyledImg
        key={`userImg${props.user.id}`}
        src={props.user.userImg ? props.user.userImg : DefaultUser}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DefaultUser;
        }}
      />
      <Name key={`userName${props.user.id}`}>{props.user.screenName}</Name>
      <Details key={`userDetails${props.user.id}`}>
        {props.user.department + " @" + props.user.companyName}
      </Details>
    </StyledDiv>
  );
}

export default Participant;
