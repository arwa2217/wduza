import React from "react";

const UserHomeCard = (props) => {
  return (
    <div
      className="pl-0 main-container"
      key={`home-item-${props.item.id}`}
      style={{ marginRight: "10px" }}
    >
      <div
        className="home-card-panel"
        style={
          props.item.key === props.activeTab
            ? { width: "100%", cursor: "pointer", ...props.item.activeStyle }
            : { width: "100%", cursor: "pointer" }
        }
        onClick={() => props.setActiveTab(props.item.key)}
      >
        <div className="home-card-container">
          <div className="home-card-title">
            <div
              className="home-card-container-title"
              style={{ color: "#666666", marginBottom: "10px" }}
            >
              {props.item.value}
            </div>
            <div
              className="count-text"
              style={
                (props.item.key === props.activeTab
                  ? props.item.activeCountStyle
                  : {},
                {})
              }
            >
              {props.item.count}
            </div>
          </div>
          <div className="home-card-icon" style={{ textAlign: "right" }}>
            <img src={props.item.src} alt={`notification bell`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeCard;
