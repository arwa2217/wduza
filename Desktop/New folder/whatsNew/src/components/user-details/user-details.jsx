import React from "react";
import Card from "react-bootstrap/Card";
import "./user-details.css";
import UserStatus from "../../constants/user/user-status";
import online from "../../assets/icons/online.svg";
import offline from "../../assets/icons/offline.svg";
import away from "../../assets/icons/away.svg";

function UserDetails(props) {
  return (
    <Card className="p-0 m-0 cardWidth">
      <Card.Img variant="top" src={props.userImg} />
      <Card.Body>
        <Card.Title>
          {props.userName}
          <img
            className="pl-1 pt-1"
            src={
              props.userStatus === UserStatus.ACTIVE.state
                ? online
                : props.userStatus === UserStatus.AWAY.state
                ? away
                : offline
            }
            alt=""
          />
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default UserDetails;
