import React from "react";
import { getHighlightedHtml } from "./post-utils";

class HighlightPath extends React.Component {
  render = () => {
    return (
      <p
        ref="test"
        dangerouslySetInnerHTML={{
          __html: getHighlightedHtml(this.props.quote, this.props.content),
        }}
        style={this.props.owner ? { color: "#2d76ce" } : { color: "#1919A" }}
      />
    );
  };
}

export default HighlightPath;
