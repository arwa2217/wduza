import React from "react";
import testUtility from "@utilities/testUtility";
import TimelineDropdown from "./index";
import { act } from "react-dom/test-utils";

let timelineData = {
  currentOption: "Thursday, May 7th",
  options: [
    { text: "Yesterday" },
    { text: "Last Week" },
    { text: "Last month" },
    { text: "Last Year" },
    { text: "The very beginning" },
    { text: "Most Recent" },
    {
      text: "Time zone, switch",
      subNav: true,
      options: [{ text: "Option1" }, { text: "Option2" }],
    },
  ],
  navigateTo: jest.fn(),
};

describe("Timeline dropdown", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = testUtility.mount(TimelineDropdown, timelineData);
    wrapper.props();
  });
  it("should match the snap shot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("'s button should match text'", () => {
    expect(wrapper.find("button").text()).toEqual("Thursday, May 7th");
  });

  it("should have 8 child", () => {
    expect(wrapper.find("li").length).toEqual(8);
  });

  it("should call navigateTo on li click", () => {
    wrapper.find("li").at(1).simulate("click");
    expect(timelineData.navigateTo).toHaveBeenCalled();
  });
});
