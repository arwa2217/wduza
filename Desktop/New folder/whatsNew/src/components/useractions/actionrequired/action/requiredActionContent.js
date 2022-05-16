import React from "react";
import RequiredActionFiles from "./requiredActionFiles";

export default ({ action }) => {
  const { type, user_name, date, question, files } = action;
  switch (type) {
    case "RequestAnswer":
    case "Confirm": {
      return (
        <>
          <div className="action_question">
            <b>{user_name}</b> <span>{new Date(date).toDateString()}</span>
            <p dangerouslySetInnerHTML={{ __html: question }}></p>
          </div>
          <RequiredActionFiles files={files} />
        </>
      );
    }
    case "ApproveRequest":
    default: {
      return <></>;
    }
  }
};
