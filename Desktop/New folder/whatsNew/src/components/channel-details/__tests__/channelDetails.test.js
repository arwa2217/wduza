import testUtility from "@utilities/testUtility";
import ChannelDetails from "../channel-details";

describe("<ChannelDetails/>", () => {
  let state = {
    channelDetails: { name: "internal channel" },
  };
  it("should render correctly", () => {
    const wrapper = testUtility.mount(
      ChannelDetails,
      {
        channelId: "channel1232",
      },
      state
    );
    expect(wrapper).toMatchSnapshot();
  });
});
