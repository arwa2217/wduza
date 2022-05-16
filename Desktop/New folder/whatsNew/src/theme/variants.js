import { blue, green, indigo, teal } from "@material-ui/core/colors";

const blueVariant = {
  name: "Blue",
  palette: {
    primary: {
      main: blue[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: blue[600],
      contrastText: "#FFF",
    },
  },
};

const greenVariant = {
  name: "Green",
  palette: {
    primary: {
      main: green[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: green[500],
      contrastText: "#FFF",
    },
  },
};

const indigoVariant = {
  name: "Indigo",
  palette: {
    primary: {
      main: indigo[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: indigo[400],
      contrastText: "#FFF",
    },
  },
};

const tealVariant = {
  name: "Teal",
  palette: {
    primary: {
      main: teal[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: teal[600],
      contrastText: "#FFF",
    },
  },
};

const lightVariant = {
  name: "Light",
  palette: {
    primary: {
      main: "#03BD5D",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#FFC700",
      contrastText: "#FFF",
    },
    background: {
      default: "#FFFFFF",
      sub1: "#F2F2F2",
      sub2: "#E6E6E6",
    },
    color: {
      accent: "#03BD5D",
      flag: "#FFC700",
      external: "#F16354",
      guest: "#0796FF",
      notificationNew: "#F0FBF5",
      columnArea: "#CCCCCC",
      list: "#E6E6E6",
      icon1: "#4D4D4D",
      divider: "rgba(0,0,0,0.08)",
      icon2: "#999999",
    },
    text: {
      primary: "rgba(0,0,0,0.9)",
      secondary: "rgba(0,0,0,0.5)",
      black70: "rgba(0, 0, 0, 0.7)",
      black50: "rgba(0,0,0,0.5)",
      black90: "rgba(0,0,0,0.9)",
      importantBlack: "#000000B2!important",
      black40: "#00000066!important",
      focused: "#03BD5D",
      mentioned: "#008B23",
      focused1: "#00A95B"
    },
  },
};

const darkVariant = {
  name: "Dark",
  palette: {
    primary: {
      main: "#03BD5D",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#FFC700",
      contrastText: "#FFF",
    },
    background: {
      default: "#151515",
    },
    text: {
      primary: "#8A8A8A",
      secondary: "#737373",
    },
  },
};

const variants = [
  blueVariant,
  darkVariant,
  lightVariant,
  greenVariant,
  indigoVariant,
  tealVariant,
];

export default variants;
