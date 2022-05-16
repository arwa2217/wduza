import React from "react";
import ActionRequired from "./index";
import testUtility from "@utilities/testUtility";

describe("user actions", () => {
  describe("action required", () => {
    it("should match match the snapshot", () => {
      const wrapper = testUtility.mount(ActionRequired, {});
      expect(wrapper).toMatchSnapshot();
    });
  });
});
