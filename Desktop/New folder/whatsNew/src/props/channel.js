import PropTypes from "prop-types";

const Channel = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  createdOn: PropTypes.number.isRequired,
  last_post_at: PropTypes.number.isRequired,
  total_msg_count: PropTypes.number.isRequired,
  creator: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
};
export default Channel;
