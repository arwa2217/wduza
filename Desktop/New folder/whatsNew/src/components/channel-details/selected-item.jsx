import React from "react";
import About from "./about";
import Members from "./members";
import Companies from "./companies";
import Tags from "./tags";
import MySaves from "./my-saves";
import Tasks from "./tasks";
import Files from "./files";
import Control from "./control";
import Activity from "./activity";
import SearchResult from "./search-result";

function SelectedItem(props) {
  const Active = () => {
    let Active;
    switch (props.item.key) {
      case "About":
        Active = <About item={props.item} channel={props.channel} />;
        break;
      case "Members":
        Active = <Members item={props.item} channel={props.channel} />;
        break;
      case "Saves":
        Active = <MySaves item={props.item} />;
        break;
      case "Tags":
        Active = <Tags item={props.item} />;
        break;
      case "Files":
        Active = <Files item={props.item} />;
        break;
      case "Companies":
        Active = <Companies item={props.item} channel={props.channel} />;
        break;
      case "Control":
        Active = <Control item={props.item} channel={props.channel} />;
        break;
      case "Notifications":
        Active = <Activity item={props.item} channel={props.channel} />;
        break;
      case "Search":
        Active = <SearchResult item={props.item} channel={props.channel} />;
        break;
      case "Tasks":
        Active = <Tasks item={props.item} />;
        break;
      default:
        break;
    }
    return Active;
  };

  return <Active {...props} />;
}

export default SelectedItem;
