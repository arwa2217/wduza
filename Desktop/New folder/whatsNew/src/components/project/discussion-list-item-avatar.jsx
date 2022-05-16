import React from "react";
import { makeStyles } from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Avatar from "@material-ui/core/Avatar";
import DefaultUser from "@icons/default-user.svg";

const backgroundImgColors = [
  "#7AC448",
  "#518BDC",
  "#7579CF",
  "linear-gradient(135deg, #009099 0%, #8AFB7F 100%)",
  "linear-gradient(135deg, #136BAA 0%, #7EF5EE 100%)",
];

const wrapper = {
  flexWrap: "wrap",
  width: "40px",
  height: "40px",
  marginRight: "10px",
};
const useStyles = makeStyles((theme) => ({
  wrapper4Item: {
    ...wrapper,
    "& .discussion-avatar-item-image": {
      width: "20px",
      height: "20px",
      border: "none",
      marginLeft: 0,
      fontSize: "10px",
    },
  },
  wrapper3Item: {
    ...wrapper,
    flexWrap: "nowrap",
    position: "relative",
    paddingTop: "18px",
    "& .discussion-avatar-item-image": {
      width: "24px",
      height: "24px",
      border: "none",
      fontSize: "13px",
      "&:last-child": {
        position: "absolute",
        bottom: "16px",
        left: "16px",
      },
    },
  },
  wrapper2Item: {
    ...wrapper,
    flexWrap: "nowrap",
    position: "relative",
    paddingTop: "14px",
    "& .discussion-avatar-item-image": {
      width: "28px",
      height: "28px",
      fontSize: "13px",
      border: "none",
      "&:last-child": {
        position: "absolute",
        bottom: "10px",
        left: "20px",
      },
    },
  },
  wrapper1Item: {
    ...wrapper,
    "& .discussion-avatar-item-image": {
      width: "40px",
      height: "40px",
      border: "none",
      fontSize: "18px",
      "& span": {
        height: "13px",
      },
    },
  },
}));

function DiscussionListItemAvatar(props) {
  const { members = [] } = props;
  const maxMemberRender = members.slice(0, 4);
  const classes = useStyles();
  const className = `wrapper${maxMemberRender.length}Item`;
  return (
    <>
      {maxMemberRender.length > 0 ? (
        <AvatarGroup max={4} className={classes[className]}>
          {maxMemberRender.map((member, index) => {
            // return (
            //   <Avatar
            //     key={index}
            //     alt={index}
            //     src={member.userImg ? member.userImg : DefaultUser}
            //     className={"discussion-avatar-item-image"}
            //   />
            // );
            const randomIndexColor =
              [...member.email.split("@")[0]]
                .map((char) => char.charCodeAt(0))
                .reduce((current, previous) => previous + current) % 5;
            return member.userImg ? (
              <Avatar
                key={index}
                alt={index.toString()}
                src={member.userImg}
                className={"discussion-avatar-item-image"}
              />
            ) : (
              <div
                key={index}
                className={"discussion-avatar-item-image"}
                style={{
                  background: `${backgroundImgColors[randomIndexColor]}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "500",
                  color: "#FFFFFF",
                }}
              >
                <span>
                  {member.screenName.split(" ")[0].charAt(0).toUpperCase()}
                </span>
              </div>
            );
          })}
        </AvatarGroup>
      ) : (
        <div
          style={{ height: "40px", width: "40px", marginRight: "10px" }}
        ></div>
      )}
    </>
  );
}

export default DiscussionListItemAvatar;
