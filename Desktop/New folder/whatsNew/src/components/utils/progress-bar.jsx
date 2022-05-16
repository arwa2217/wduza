import React, { PureComponent } from "react";
import styled from "styled-components";

const ProgressBar = styled.div`
  height: ${(props) => props.height};
  background: #e2e2e2;
  position: absolute;
  top: 0;
  left: 7px;
  right: 7px;
  width: 91%;
`;

const ProgressDiv = styled.div`
  background: var(--primary__dark);
  height: 100%;
  margin: 0;
`;

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ProgressBar height={this.props.height ? this.props.height : "4px"}>
        <ProgressDiv
          className="Progress"
          style={{ width: this.props.progress + "%" }}
        />
      </ProgressBar>
    );
  }
}

export default Progress;
