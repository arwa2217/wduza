import { v4 as uuidv4 } from "uuid";
export const uniqueID = () => {
  return uuidv4();
};

export function putOrdinals(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

// export const pwdRegex = new RegExp(
//   "^((?=.*[\\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[a-z])(?=.*[^\\w\\d\\s])).{8,80}$",
//   "gm"
// );

// writing a regex to match all valid email addresses is really, really hard. (see http://stackoverflow.com/a/201378)
// this regex ensures:
// - at least one character that is not a space, comma, or @ symbol
// - followed by a single @ symbol
// - followed by at least one character that is not a space, comma, or @ symbol
// this prevents <Outlook Style> outlook.style@domain.com addresses and multiple comma-separated addresses from being accepted
export const emailRegex = /^[^ ,@]+@[^ ,@]+$/;

export const pwdRegex =
  /^((?=.*[\\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[a-z])(?=.*[^\\w\\d\\s])).{8,80}$/;

export const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
export const nameRegex =
  /^[\u0000-\u0019\u0021-\uffff]+((?: {0,1}[\u0000-\u0019\u0021-\uffff]+)+)*$/;

export const isEmptyObject = (object) => {
  return (
    object === undefined ||
    (Object.keys(object).length === 0 && object.constructor === Object)
  );
};
const _removeAllInlineStyle = (parent) => {
  if (parent.children.length){
    Array.from(parent.children).map((child)=> {
      child.removeAttribute('style')
      _removeAllInlineStyle(child)
    })
  }
}
export const removeAllInlineStyle = _removeAllInlineStyle
