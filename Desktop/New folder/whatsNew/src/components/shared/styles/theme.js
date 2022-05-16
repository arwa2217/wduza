import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  // light: {
  //   colors: {
  //     primary: "#7CD0A5",
  //     primary__light: "#DCF0E8",
  //     primary__lighter : "#F3F3F3",
  //     primary__dark: "#308F65",
  //     secondary: "#58c171",
  //     secondary__light: "#e3f6f2",
  //     default: "#95979d",
  //     grey__light: "#65656c",
  //     grey__dark: "#252534",
  //     white: "#fff",
  //     black: "#000",
  //     orange__dark: "#dd4409",
  //     orange__lightsalmon: "#fff3e8",
  //     light: "#f1f2fc",
  //     top__bar: "#F3F3F3",
  //     left__sidebar: "#DCF0E8",

  //     tags__background : '#AFCABC',
  //     tags__color : '#ffffff',
  //     tags__border : '#AFCABC'
  //   },
  // },
  dark: {
    colors: {
      primary: "#54D994",
      primary__light: "#DCF0E8",
      primary__lighter: "#F3F3F3",
      primary__dark: "#308F65",
      secondary: "#58c171",
      secondary__light: "#e3f6f2",
      default: "#999999",
      default__darker: "#bebebe",
      grey__light: "#65656c",
      grey__dark: "#19191A",
      white: "#fff",
      black: "#000",
      orange__dark: "#dd4409",
      orange__lightsalmon: "#fff3e8",
      light: "#f1f2fc",
      transparent: "Transparent",
      reaction_background: "#f2f2f2",
      reaction_background_other: "#f2f2f2",
      top__bar: "#2C2C2C",
      left__sidebar: "#2C2C2C",

      tags__background: "#CA4C70",
      tags__color: "#FFFFFF",
      tags__border: "#CA4C70",
      tags__background_green: "#03BD5D",
      tags__color__white: "#FFFFFF",
      tags__color__grey: "#666666",
      tags__color_green: "#6A9884",
      tags__border__green: "#03BD5D",

      post__tags__background_hover: "#F2D9E0",
      post__tags__color: "#CA4C70",
      post__tags__color__hover: "#CA4C70",
      post__tags__border: "#F2D9E0",
      post__tags__border__hover: "#F2D9E0",
      post__tags__border__grey: "#DBDFE5",

      post__reaction__color: "#03BD5D",
      post__reaction__color_other: "#666666",
      post__reaction__border: "#03BD5D",
      post__reaction__border__other: "#f2f2f2",

      monoly__green: "#39AA70",
      none: "none",
    },
  },
};

const Theme = ({ children }) => {
  return <ThemeProvider theme={theme.dark}>{children}</ThemeProvider>;
};

export default Theme;
