import React, { PureComponent } from "react";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import ModalActions from "../../store/actions/modal-actions";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ModalTypes from "../../constants/modal/modal-type";
import {
  setActivePanelAction,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import ChannelType from "../../props/channel-type";
import { CLEAN_MESSAGES } from "../../store/actionTypes/channelMessagesTypes";
import UserType from "../../constants/user/user-type";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import Panel from "../actionpanel/panel";
import lock_icon from "../../assets/icons/lock_active.svg";
import delete_white from "../../assets/icons/delete_white.svg";
import { RESET_NEW_CHANNEL } from "../../store/actionTypes/channelActionTypes";

class Channels extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedChannelRef = {};
  }
  state = {
    activeIndex: 0,
    subActiveIndex: 0,
    channelData: [
      {
        channelType: `Project ${this.props.currentUser?.companyName}`,
        channelList: this.props.channelList,
      },
    ],
    newChannel: this.props.newChannel,
    selectedChannelActive: 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("UNSAFE_componentWillReceiveProps");
    const newChannel = nextProps.newChannel;
    const activeChannel = nextProps.activeChannel;
    const updatedChannel = nextProps.updatedChannel;
    console.log("newChannel=" + newChannel);
    console.log("activeChannel=" + activeChannel);
    const activePanel = nextProps.activePanel;
    if (newChannel && newChannel !== this.state.newChannel) {
      console.log("Making as selected discussion newChannel=" + newChannel);
      //Adding delay of 1 sec to making sure that newly created channel got added into channel list.
      setTimeout(() => {
        this.setState({ newChannel: newChannel });
        this.props.dispatch(
          setSelectedChannelAction(Panel.CHANNEL, newChannel)
        );
        this.props.dispatch({ type: RESET_NEW_CHANNEL });
      }, 1000);
    } else if (
      activeChannel &&
      this.state.selectedChannelActive !== activeChannel.id
    ) {
      console.log("updating state as per activeChannel" + activeChannel);
      this.setState({
        selectedChannelActive: activeChannel.id,
      });
      //if (this.props.activePanel !== Panel.CHANNEL) {
      this.props.dispatch({
        type: CLEAN_MESSAGES,
        payload: { channelId: activeChannel.id },
      });
      //}

      //TODO scroll to selected channel
      this.executeScroll(activeChannel.id);
    } else if (
      activeChannel &&
      updatedChannel &&
      activeChannel.id === updatedChannel.id &&
      (activeChannel.type !== updatedChannel.type ||
        activeChannel.lastReadPostId !== updatedChannel.lastReadPostId)
    ) {
      this.props.dispatch(
        setSelectedChannelAction(Panel.CHANNEL, updatedChannel)
      );
    } else if (
      nextProps.channelList.length > 0 &&
      nextProps.currentUser.userType === UserType.GUEST
    ) {
      if (
        !activeChannel ||
        (activeChannel && activeChannel.id !== nextProps.channelList[0].id)
      ) {
        this.props.dispatch(
          setSelectedChannelAction(Panel.CHANNEL, nextProps.channelList[0])
        );
      }
    } else if (activePanel === Panel.NEW_DISCUSSION) {
      this.setState({
        selectedChannelActive: 0,
      });
    } else {
      //Check if user refresh the page , he should landed to last selected channel
      let lastSelectedChannelId = getLastSelectedChannelId();
      if (
        lastSelectedChannelId &&
        !activeChannel &&
        nextProps.channelList &&
        nextProps.channelList.length > 0
      ) {
        let channelList = nextProps.channelList;
        var lastSelectedChannel = channelList.filter((channel) => {
          return channel.id === lastSelectedChannelId;
        });
        if (lastSelectedChannel && lastSelectedChannel.length > 0) {
          //Added delay to make sure , dispatch action after rendering the channel list
          setTimeout(() => {
            this.props.dispatch(
              setSelectedChannelAction(Panel.CHANNEL, lastSelectedChannel[0])
            );
          }, 500);
        }
      }
    }

    if (
      activeChannel &&
      activeChannel.IsInvitePending &&
      activeChannel.id !==
        (this.props.activeChannel && this.props.activeChannel.id)
    ) {
      this.props.dispatch(
        setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, activeChannel)
      );
      return;
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

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
    if (channel.IsInvitePending) {
      this.props.dispatch(
        setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, channel)
      );
      return;
    }
    this.props.dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
  };

  handleCreateChannel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (true) {
      this.props.dispatch(setActivePanelAction(Panel.NEW_DISCUSSION));
      return;
    }
    const channelType = "INVALID"; //e.currentTarget.value;
    console.log("handleCreateChannel , channelType=" + channelType.toString());
    if (channelType === ChannelType.DIRECT_CHANNEL) {
      const channel = {
        type: channelType,
        description: null,
        name: null,
        otherUserEmail: null,
      };
      this.showDirectChannelModal(channel);
    } else {
      const modalType = ModalTypes.CREATE_CHANNEL;
      const modalProps = {
        show: true,
        closeButton: true,
        channelType: channelType,
      };
      this.props.dispatch(ModalActions.showModal(modalType, modalProps));
    }
  };

  handleCreateProject = (e) => {
    e.preventDefault();
    e.stopPropagation();
    /* To do */
  };

  showAddPeopleModal(channelInfo) {
    const { t } = this.props;
    const modalType = ModalTypes.ADD_PEOPLE;
    console.log("showAddPeopleModal , channelType=" + channelInfo.type);

    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: true,
      title: t("addPeople.modal:add.people"),
      modalType: modalType,
      channel: channelInfo,
    };
    this.props.dispatch(ModalActions.showModal(modalType, modalProps));
  }

  showDirectChannelModal(channelInfo) {
    const { t } = this.props;
    const modalType = ModalTypes.ADD_PEOPLE;
    console.log("showDirectChannelModal , channelType=" + channelInfo.type);

    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: t("addPeople.modal:add.person"),
      modalType: modalType,
      channel: channelInfo,
    };
    this.props.dispatch(ModalActions.showModal(modalType, modalProps));
  }

  executeScroll = (channelId) => {
    if (!this.isScrolledIntoView(this.selectedChannelRef[channelId])) {
      this.selectedChannelRef[channelId].scrollIntoView({ block: "center" });
    }
  };

  isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }

  getChannelDetails(subActiveIndex, channelData) {
    const { t } = this.props;

    return (
      <div className="accordion-project">
        <h6 className="project-title">{t("project.project")}</h6>
        {channelData.map((channel, typeIndex) => (
          <Accordion className="channelType" key={typeIndex}>
            <Accordion.Title
              active={subActiveIndex === typeIndex}
              index={typeIndex}
              onClick={this.handleSubClick}
              className="customAccordionTitle"
            >
              {`Project ${this.props.currentUser?.companyName}`}
            </Accordion.Title>

            <Accordion.Content active={subActiveIndex === typeIndex}>
              {/* <Scrollbars autoHide style={{ height: "250px" }}> */}
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
                        className={`channelListMargin channelListItem ${
                          this.state.selectedChannelActive === listItem.id &&
                          "active"
                        }`}
                        channel={listItem}
                        onClick={this.handleChannelItemClick}
                      >
                        <HeaderContent className="customColor " key={listIndex}>
                          <p
                            data-new-messages={listItem.newMessageCount}
                            className={
                              listItem.newMessageCount
                                ? "wrapContent channel-list-item-view channelHighlight"
                                : "wrapContent channel-list-item-view"
                            }
                            ref={(el) =>
                              (this.selectedChannelRef[listItem.id] = el)
                            }
                          >
                            {listItem.status === "LOCKED" ? (
                              <img
                                src={lock_icon}
                                alt="locked"
                                className="channel-list-status-icon"
                              />
                            ) : listItem.status === "DELETED" ? (
                              <img
                                src={delete_white}
                                alt="deleted"
                                className="channel-list-status-icon"
                              />
                            ) : (
                              <p
                                style={{
                                  minWidth: "20px",
                                  display: "inline-block",
                                }}
                              >
                                &nbsp;
                              </p>
                            )}
                            {listItem.name}
                          </p>
                        </HeaderContent>
                      </List.Item>
                    ))}
              </List>
              {/* </Scrollbars> */}
              {this.props.currentUser.userType !== UserType.GUEST && (
                <div className="col-12 p-0">
                  <div
                    className="btn new-discussion w-100"
                    onClick={this.handleCreateChannel}
                  >
                    {t("discussion:new.discussion")}
                  </div>
                </div>
              )}
            </Accordion.Content>
            {this.props.currentUser.userType !== UserType.GUEST && (
              <div
                className="btn w-100 new-project"
                // onClick={this.handleCreateProject}
              >
                {t("newProject")}
              </div>
            )}
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
    newChannel: state.ChannelReducer.newChannel,
    channelList: state.ChannelReducer.channelList,
    activeChannel: state.config.activeSelectedChannel,
    activePanel: state.config.activeActionPanel,
    fetchedChannelList: state.ChannelReducer.fetchedChannelList,
    updatedChannel: state.ChannelReducer.updatedChannel,
  };
}
export default connect(mapStateToProps)(withTranslation()(Channels));
