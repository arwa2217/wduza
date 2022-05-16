import React from "react";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import "./language-selector.css";

const options = [
  { label: "English", value: "en" },
  { label: "Korean", value: "ko" },
];

class LanguageSelector extends React.Component {
  state = {
    selectedOption: options[0],
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.i18n.changeLanguage(selectedOption.value);
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        className="selector"
      />
    );
  }
}

export default withTranslation()(LanguageSelector);
