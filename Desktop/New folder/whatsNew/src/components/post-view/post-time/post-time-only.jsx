import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import LocalTime from "../../local-date-time/local-time";

export default class PostTimeOnly extends React.PureComponent {
  static propTypes = {
    isLink: PropTypes.bool.isRequired,
    eventTime: PropTypes.number.isRequired,
    postId: PropTypes.string,
  };

  static defaultProps = {
    eventTime: 0,
  };

  handleClick = () => {};

  render() {
    const localTime = <LocalTime eventTime={this.props.eventTime} />;
    if (!this.props.isLink) {
      return localTime;
    }

    return (
      <Link
        to={`/${this.props.postId}`}
        className="post-time-link"
        onClick={this.handleClick}
      >
        {localTime}
      </Link>
    );
  }
}
