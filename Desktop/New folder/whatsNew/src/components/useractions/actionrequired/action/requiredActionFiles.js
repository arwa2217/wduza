import React from "react";
import { Icon } from "semantic-ui-react";

export default ({ files }) => {
  if (files) {
    return (
      <ul className="action_files_list">
        {files.map((file) => {
          return (
            <li key={file.name}>
              <Icon size="big" name="facebook" className="files_list_icon" />
              <span className="files_list_name">{file.name}</span>
              <span className="files_list_detail">{file.details}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  return <></>
};
