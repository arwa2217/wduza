import React, { PureComponent } from "react";
import "./newui-channel.css";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import UserType from "../../constants/user/user-type";
import { bindActionCreators } from "redux";
import {
  setActiveMenuItem,
  setActivePanelAction,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import Panel from "../actionpanel/panel";
import { NavLink } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Collection from "../../assets/icons/side-menu/collection.svg";

class NewUIChannels extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subActiveIndex: 0,
      channelData: [
        {
          channelType: "Projects",
          channelList: [{ name: "Project", id: 0 }],
          // channelList: [
          //   {name: "Project Berry", id: 0},
          //   {name: "Project Lemon", id: 1},
          //   {name: "Project Apple & Microsoft", id: 2}
          // ]
        },
      ],
      selectedChannelActive: 0,
    };
  }

  handleSubClick = (e, titleProps) => {
    e.preventDefault();
    e.stopPropagation();

    const { index } = titleProps;
    const { subActiveIndex } = this.state;
    const newIndex = subActiveIndex === index ? -1 : index;
    this.setState({ subActiveIndex: newIndex });
  };

  handleChannelItemClick = (e, channelProps) => {
    e.preventDefault();
    e.stopPropagation();

    const { channel } = channelProps;
    let menu = "";
    if (channel.id === 0) {
      menu = MENU_ITEMS.COLLECTIONS;
    } else if (channel.id === 1) {
      menu = MENU_ITEMS.FILES;
    }
    this.props.actions.setActiveMenuItem(menu);
    this.setState({ selectedChannelActive: channel.id });
    /* localStorage.setItem(
      "historyTab",
      JSON.stringify({
        currentItemSelected: channel.name,
        currentChannel: "Projects",
      })
    );*/
    if (Object.keys(this.props.currentChannelClick).length) {
      this.props.actions.setSelectedChannelAction(
        Panel.CHANNEL,
        this.props.currentChannelClick
      );
    } else {
      this.props.actions.setActivePanelAction(Panel.WELCOME, null);
    }
  };

  handleCreateProject = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  componentDidMount() {
    /*   const historyTab = localStorage.getItem("historyTab");

    if (historyTab) {
      const item = JSON.parse(historyTab);
      this.props.actions.setActiveMenuItem(item.currentChannel.toUpperCase());
      if (
        item.currentItemSelected === "Projects" &&
        this.props.currentChannelClick
      ) {
        this.props.actions.setSelectedChannelAction(
          Panel.CHANNEL,
          this.props.currentChannelClick
        );
      } else {
        this.props.actions.setActivePanelAction(Panel.WELCOME, null);
      }
    } else {
      const initItem = {
        currentItemSelected: 0,
        currentChannel: "Projects",
      };
      localStorage.setItem("historyTab", JSON.stringify(initItem));
      this.props.actions.setActiveMenuItem(
        initItem.currentChannel.toUpperCase()
      );
    }*/
  }
  getChannelDetails(subActiveIndex, channelData) {
    const { t } = this.props;

    return (
      <div className="accordion-project">
        {channelData.map((channel, typeIndex) => (
          <Accordion className="channelType" key={typeIndex}>
            <Accordion.Title
              active={subActiveIndex === typeIndex}
              index={typeIndex}
              onClick={this.handleSubClick}
              className="customAccordionTitle"
            >
              {t(channel.channelType)}
            </Accordion.Title>

            <Accordion.Content active={subActiveIndex === typeIndex}>
              <List>
                {channel &&
                  channel.channelList &&
                  channel.channelList.length > 0 &&
                  channel.channelList
                    .sort((a, b) =>
                      a.name &&
                      b.name &&
                      a.name.toLowerCase() === b.name.toLowerCase()
                        ? 0
                        : a.name &&
                          b.name &&
                          a.name.toLowerCase() < b.name.toLowerCase()
                        ? -1
                        : 1
                    )
                    .map((listItem, listIndex) => (
                      <List.Item
                        key={listIndex}
                        className={`channelListItem`}
                        // ${
                        //   this.state.selectedChannelActive === listItem.id &&
                        //   this.props.activeMenuItem === MENU_ITEMS.PROJECTS &&
                        //   "active"
                        //   }
                        channel={listItem}
                        onClick={this.handleChannelItemClick}
                      >
                        <NavLink
                          to={MENU_ITEMS.COLLECTIONS}
                          activeClassName="active"
                        >
                          <HeaderContent key={listIndex}>
                            <p className="wrapContent">{listItem.name}</p>
                          </HeaderContent>
                        </NavLink>
                      </List.Item>
                    ))}
              </List>
              {this.props.currentUser.userType !== UserType.GUEST && (
                <div
                  className="btn w-100 new-project d-none"
                  onClick={this.handleCreateProject}
                >
                  {t("newProject")}
                </div>
              )}
            </Accordion.Content>
          </Accordion>
        ))}
      </div>
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let data = prevState.channelData;
    data[0].channelList.find(
      (i) => i.id === 0
    ).name = `${nextProps.currentUser?.companyName}`;
    return { channelData: data };
  }

  componentDidUpdate() {
    let data = this.state.channelData;
    data[0].channelList.find(
      (i) => i.id === 0
    ).name = `${this.props.currentUser?.companyName}`;
    this.setState({ channelData: data });
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
    currentChannelClick: state.channelDetails,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        setActiveMenuItem,
        setActivePanelAction,
        setSelectedChannelAction,
      },
      dispatch
    ),
    dispatch,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NewUIChannels));
