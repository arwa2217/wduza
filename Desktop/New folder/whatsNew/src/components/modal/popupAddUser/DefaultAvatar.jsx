import React from "react";
import { makeStyles } from "@material-ui/core";

const backgroundImgColors = [
  "#7AC448",
  "#518BDC",
  "#7579CF",
  "linear-gradient(135deg, #009099 0%, #8AFB7F 100%)",
  "linear-gradient(135deg, #136BAA 0%, #7EF5EE 100%)",
];

const useStyles = makeStyles((theme) => ({
  defaultAvatar: {
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    color: "#FFFFFF",
    cursor: "pointer",
  },
}));

const DefaultAvatar = (props) => {
  const classes = useStyles();

  const getColorIndex = (selectedStr) => {
    if (selectedStr) {
      return (
        [...selectedStr?.split("@")[0]]
          .map((char) => char.charCodeAt(0))
          .reduce((current, previous) => previous + current) % 5
      );
    }
    return 0;
  };

  const randomIndexColor = props?.companyName
    ? getColorIndex(props?.companyName)
    : getColorIndex(props?.memberEmail);
  return (
    <div
      className={classes.defaultAvatar}
      style={{
        background: `${backgroundImgColors[randomIndexColor]}`,
        height: `${props.size ? props.size : 32}px`,
        width: `${props.size ? props.size : 32}px`,
        fontSize: `${props.fontSize ? props.fontSize : 16}px`,
      }}
    >
      {props.memberName && (
        <span>{props.memberName.split(" ")[0].charAt(0).toUpperCase()} </span>
      )}
      {props.companyName && (
        <span style={{ fontSize: "13px", height: "16px" }}>
          {props.companyName.split(" ")[0].slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default DefaultAvatar;
