import React from "react";
import { Router } from "react-router-dom";
import { App } from "./app";
import testUtility from "../utilities/testUtility";

test("App should have child router", () => {
  const wrapper = testUtility.mount(App);
  expect(wrapper.find(Router)).toHaveLength(1);
});

test("should match the snapshot", () => {
  const wrapper = testUtility.mount(App);
  expect(wrapper).toMatchSnapshot();
});
