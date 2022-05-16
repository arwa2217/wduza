import React, { PureComponent } from "react";
import "./newui-channel.css";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { bindActionCreators } from "redux";
import {
  setActiveMenuItem,
  setActivePanelAction,
} from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import Panel from "../actionpanel/panel";
import { MsalContext } from "@azure/msal-react";
import { NavLink } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Email from "../../assets/icons/side-menu/email.svg";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import collectionIcon from "../../assets/icons/v2/discussions.svg";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

class NewUiOutLook extends PureComponent {
  static contextType = MsalContext;
  constructor(props) {
    super(props);
    this.state = {
      subActiveIndex: 0,
      channelData: [
        {
          channelType: "Email",
          channelList: [{ name: "Outlook mail", id: 0 }],
        },
      ],
      selectedChannelActive: 0,
    };
  }

  handleSubClick = (channelType, channelIndex, e, titleProps) => {
    e.preventDefault();
    e.stopPropagation();

    const { index } = titleProps;
    const { subActiveIndex } = this.state;

    const newIndex = subActiveIndex === index ? -1 : index;
    this.setState({ subActiveIndex: newIndex });
  };

  handleChannelItemClick = (currentChannel, listItem, e, channelProps) => {
    e.preventDefault();
    e.stopPropagation();
    const { channel } = channelProps;
    this.setState({ selectedChannelActive: channel.id });
    this.props.actions.setActiveMenuItem(MENU_ITEMS.EMAIL);
    if (this.context.accounts.length === 0) {
      this.props.actions.setActivePanelAction(Panel.WELCOME_EMAIL, null);
    } else {
      //this.props.actions.setActivePanelAction(Panel.WELCOME);
    }
  };

  handleCreateProject = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  componentDidMount() {
    const {
      location: { pathname = "" },
    } = this.props;
    if (pathname === MENU_ITEMS.EMAIL) {
      this.props.actions.setActivePanelAction(Panel.WELCOME_EMAIL, null);
    }
  }

  getChannelDetails(subActiveIndex, channelData) {
    const { t, unreadNumber, isExtendMenu, handleToggleMenu, classes } = this.props;
    return (
      <>
        {isExtendMenu ? (
          <div className="accordion-project">
            {channelData.map((channel, typeIndex) => (
              <Accordion className="channelType" key={typeIndex}>
                <Box className={"menu-parent-icon d-flex flex-row align-items-center"}>
                  <Accordion.Title
                      active={subActiveIndex === typeIndex}
                      index={typeIndex}
                      onClick={this.handleSubClick.bind(
                          this,
                          channel.channelType,
                          typeIndex
                      )}
                  >
                    <NavLink
                        className={classNames("app-menu-link", classes.menuLink)}
                        activeClassName={classNames("app-active-menu", classes.activeMenu)}
                        to={MENU_ITEMS.EMAIL}
                    >
                      <SVG src={collectionIcon} fill="none" className={classNames("menu-icon", classes.menuIcon)}/>
                      <Typography color="textPrimary" className="menu-text">
                        {t(channel.channelType)}
                      </Typography>
                    </NavLink>
                  </Accordion.Title>
                </Box>
                <Accordion.Content active={subActiveIndex === typeIndex}>
                  <List>
                    {channel &&
                      channel.channelList &&
                      channel.channelList.length > 0 &&
                      channel.channelList.map((listItem, listIndex) => {
                        const channelName =
                          listIndex === 0 && unreadNumber > 0
                            ? `${listItem.name} [${unreadNumber}]`
                            : listItem.name;
                        return (
                          <List.Item
                            key={listIndex}
                            className={`channelListItem ${
                              this.state.selectedChannelActive ===
                                listItem.id &&
                              this.props.location.pathname ===
                                MENU_ITEMS.EMAIL &&
                              "active"
                            } ${classes.menuItem}`}
                            channel={listItem}
                            onClick={this.handleChannelItemClick.bind(
                              this,
                              channel,
                              listItem
                            )}
                            style={{paddingLeft: 5}}
                          >
                            <NavLink to={MENU_ITEMS.EMAIL}>
                              <HeaderContent key={listIndex}>
                                <Typography color="textPrimary" className="menu-text">
                                  {channelName}
                                </Typography>
                              </HeaderContent>
                            </NavLink>
                          </List.Item>
                        );
                      })}
                  </List>
                </Accordion.Content>
              </Accordion>
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
            onClick={() => handleToggleMenu()}
          >
            <OverlayTrigger
              placement="right"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={<Tooltip id={"Email"}>{"Email"}</Tooltip>}
            >
              <img src={Email} alt="Email" />
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
        setActivePanelAction,
      },
      dispatch
    ),
    dispatch,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NewUiOutLook));
