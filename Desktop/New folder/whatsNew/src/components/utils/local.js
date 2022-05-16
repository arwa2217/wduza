import { useTranslation } from "react-i18next";

/*
text: Hello all,
expected Key in localized files: hello.all
*/
export const Local = ({ text, children, formatArguments }) => {
  const { t } = useTranslation();
  let key;
  if (text) {
    key = text.toLowerCase().replace(/ /g, ".");
  } else if (children) {
    key = children.toLowerCase().replace(/ /g, ".");
  }
  let localText = t(key);
  if (formatArguments && formatArguments.length > 0) {
    localText = format(localText, formatArguments);
  }
  return localText;
};

/*
  text {0} hello {1}
  args: ["there", "all"]
*/
export const format = function (text, args) {
  return text.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};
