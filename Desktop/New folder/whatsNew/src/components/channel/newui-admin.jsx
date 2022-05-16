import React, { PureComponent, Fragment } from "react";
import "./newui-channel.css";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import AdminService from "../../services/admin-service";
import { ADMIN_SUB_MENU, MENU_ITEMS } from "../../constants/menu-items";
import { bindActionCreators } from "redux";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { NavLink } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Admin from "../../assets/icons/side-menu/user.svg";

class NewUIAdmins extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      subActiveIndex: 0,
      channelData: [
        {
          channelType: "Administrator",
          channelList: [
            {
              name: "Account management",
              active: true,
              id: 0,
              path: `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.ACCOUNT_MANAGEMENT}`,
            },
            {
              name: "Discussion Management",
              active: true,
              id: 1,
              path: `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.DISCUSSION_MANAGEMENT}`,
            },
            {
              name: "File Management",
              active: true,
              id: 2,
              path: `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.FILE_MANAGEMENT}`,
            },
            // {
            //   name: "Settings",
            //   active: true,
            //   id: 3,
            //   path: `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.SETTINGS}`,
            // },
          ],
        },
      ],
      selectedChannelActive: 0,
      isAdmin: true,
      isFetchAdminEmail: false,
    };
  }
  componentDidUpdate() {
    this.fetchAdminEmail();
  }
  fetchAdminEmail() {
    if (!this.state.isFetchAdminEmail) {
      AdminService.getAdminEmail()
        .then((data) => {
          if (
            this.props.currentUser.email.toLowerCase() ===
            data["admin-email"].toLowerCase()
          ) {
            this.setState({ ...this.state, isAdmin: true });
          }
        })
        .catch((reason) => {});
      if (this.props.currentUser.email !== undefined) {
        this.setState({ ...this.state, isFetchAdminEmail: true });
      }
    }
  }

  handleSubClick = (e, titleProps) => {
    const { index } = titleProps;
    const { subActiveIndex } = this.state;
    const newIndex = subActiveIndex === index ? -1 : index;
    this.setState({ subActiveIndex: newIndex });
  };

  getChannelDetails(subActiveIndex, channelData) {
    return (
      <>
        {this.props.isExtendMenu ? (
          <div className="accordion-project">
            {channelData.map((channel, typeIndex) => (
              <Fragment key={`admin-list-${channel?.id}`}>
                {this.state.isAdmin && (
                  <Accordion className="channelType" key={typeIndex}>
                    <Accordion.Title
                      active={subActiveIndex === typeIndex}
                      index={typeIndex}
                      onClick={this.handleSubClick}
                      className="customAccordionTitle"
                    >
                      {channel.channelType}
                    </Accordion.Title>

                    <Accordion.Content active={subActiveIndex === typeIndex}>
                      <List>
                        {channel &&
                          channel.channelList.map((listItem, listIndex) => (
                            <List.Item
                              key={listIndex}
                              className={`channelListItem
                              ${
                                this.props.activeMenuItem === listItem.path &&
                                this.state.isAdmin &&
                                listItem.active &&
                                "active"
                              }
                              `}
                              channel={listItem}
                            >
                              <NavLink
                                // to={`${MENU_ITEMS.ADMINISTRATOR}/${listItem.name
                                //   .toLowerCase()
                                //   .split(" ")
                                //   .join("-")}`}
                                to={listItem.path}
                                onClick={() => {
                                  this.props.dispatch(
                                    setActiveMenuItem(listItem.path, false)
                                  );
                                }}
                                activeClassName="active"
                              >
                                <HeaderContent key={listIndex}>
                                  {this.state.isAdmin && listItem.active ? (
                                    <p className={`wrapContent`}>
                                      {listItem.name}
                                    </p>
                                  ) : (
                                    <p
                                      className={`channelDisabled wrapContent`}
                                    >
                                      {listItem.name}
                                    </p>
                                  )}
                                </HeaderContent>
                              </NavLink>
                            </List.Item>
                            //    <List.Item
                            //   key={listIndex}
                            //   className={`channelListItem ${
                            //     this.state.selectedChannelActive === listItem.id &&
                            //     this.props.activeMenuItem === MENU_ITEMS.PROJECTS &&
                            //     "active"
                            //   }`}
                            //   channel={listItem}
                            //   onClick={this.handleChannelItemClick}
                            // >
                            //   <NavLink to={MENU_ITEMS.PROJECTS} activeClassName="active">
                            //     <HeaderContent key={listIndex}>
                            //       <p className="wrapContent">{listItem.name}</p>
                            //     </HeaderContent>
                            //   </NavLink>
                            // </List.Item>
                          ))}
                      </List>
                    </Accordion.Content>
                  </Accordion>
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 8,
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => this.props.handleToggleMenu()}
          >
            <OverlayTrigger
              placement="right"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={<Tooltip id={"admin"}>{"Admin"}</Tooltip>}
            >
              <img src={Admin} alt="Admin" />
            </OverlayTrigger>
          </div>
        )}
      </>
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
    activeMenuItem: state.config.activeMenuItem,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        setActiveMenuItem,
      },
      dispatch
    ),
    dispatch,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NewUIAdmins));
