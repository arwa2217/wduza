import React, { PureComponent } from "react";
import "./channel.css";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { setActivePanelAction } from "../../store/actions/config-actions";
import AdminService from "../../services/admin-service";

class Admins extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedChannelRef = {};
  }

  state = {
    activeIndex: 0,
    subActiveIndex: 0,
    channelData: [
      {
        channelType: `Organization: ${this.props.currentUser.companyName}`,
        channelList: [
          { name: "Account Management", active: true, id: 0 },
          { name: "System Monitoring", active: false, id: 1 },
        ],
      },
    ],
    selectedChannelActive: 0,
    isAdmin: false,
    isFetchAdminEmail: false,
  };

  fetchAdminEmail() {
    if (!this.state.isFetchAdminEmail) {
      AdminService.getAdminEmail()
        .then((data) => {
          if (
            this.props.currentUser?.email.toLowerCase() ===
            (!!data && data["admin-email"].toLowerCase())
          ) {
            this.setState({ ...this.state, isAdmin: false });
          }
        })
        .catch((reason) => {});
      if (this.props.currentUser.email !== undefined) {
        this.setState({ ...this.state, isFetchAdminEmail: true });
      }
    }
  }

  componentDidMount() {
    this.fetchAdminEmail();
  }

  handleSubClick = (e, titleProps) => {
    const { index } = titleProps;
    const { subActiveIndex } = this.state;
    const newIndex = subActiveIndex === index ? -1 : index;
    this.setState({ subActiveIndex: newIndex });
  };

  handleChannelItemClick = (e, channelProps) => {
    e.preventDefault();
    const { channel } = channelProps;
    if (!channel.lastReadPostId) {
      channel.lastReadPostId = 0;
    }
    if (this.state.isAdmin) {
      if (channel.id === 0) {
        this.props.dispatch(setActivePanelAction("AdminAccountPage"));
      }
      // if (channel.id == 2) {
      //   this.props.dispatch(setActivePanelAction("AdminAccountPage"));
      // }
    }
  };

  getChannelDetails(subActiveIndex, channelData) {
    this.fetchAdminEmail();

    return (
      <div className="accordion-project">
        <h6 className="project-title">Administrator</h6>
        {channelData.map((channel, typeIndex) => (
          <Accordion className="channelType" key={typeIndex}>
            <Accordion.Title
              active={subActiveIndex === typeIndex}
              index={typeIndex}
              onClick={this.handleSubClick}
              className="customAccordionTitle"
            >
              {`Organization: ${this.props.currentUser.companyName}`}
            </Accordion.Title>

            <Accordion.Content active={subActiveIndex === typeIndex}>
              <List>
                {channel &&
                  channel.channelList.map((listItem, listIndex) => (
                    <List.Item
                      key={listIndex}
                      className="channelListItem"
                      channel={listItem}
                      onClick={this.handleChannelItemClick}
                    >
                      <HeaderContent key={listIndex}>
                        {this.state.isAdmin && listItem.active ? (
                          <p
                            className="wrapContent"
                            ref={(el) =>
                              (this.selectedChannelRef[listItem.id] = el)
                            }
                          >
                            {listItem.name}
                          </p>
                        ) : (
                          <p
                            className="channelDisabled wrapContent"
                            ref={(el) =>
                              (this.selectedChannelRef[listItem.id] = el)
                            }
                          >
                            {listItem.name}
                          </p>
                        )}
                      </HeaderContent>
                    </List.Item>
                  ))}
              </List>
            </Accordion.Content>
          </Accordion>
        ))}
      </div>
    );
  }

  render() {
    const { subActiveIndex, channelData } = this.state;
    return <> {this.getChannelDetails(subActiveIndex, channelData)} </>;
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.AuthReducer.user,
  };
}
export default connect(mapStateToProps)(withTranslation()(Admins));
