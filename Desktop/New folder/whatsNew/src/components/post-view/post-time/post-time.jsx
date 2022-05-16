import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import LocalDateTime from "../../local-date-time/local-date-time";

export default class PostTime extends React.PureComponent {
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
    const localDateTime = <LocalDateTime eventTime={this.props.eventTime} />;
    if (!this.props.isLink) {
      return localDateTime;
    }

    return (
      <Link
        to={`/${this.props.postId}`}
        className="post-time-link"
        onClick={this.handleClick}
      >
        {localDateTime}
      </Link>
    );
  }
}
