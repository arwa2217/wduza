import DefaultUser from "@icons/default-user.svg";
import { getCaretCharacterOffsetWithin } from "./editorUtils";

let currentChannel;

function getSelectionItem(item) {
  return `<span class="mention" contenteditable="false" data-index="0" data-command-char="@" data-id="${item.id}" data-value="${item.screenName}" data-channel-id="${currentChannel.id}">&#65279;<span><span class="ql-mention-command-char">@</span>${item.screenName}</span>&#65279;</span> `;
}

function getItem(item, currentUserId) {
  const currentUserYouName = item.id === currentUserId ? "(you)" : "";
  if (item?.fwdFlag) {
    return `
        <div>
          <img class="mention-user-list-item-img" src=${
            item.userImg === "" ? DefaultUser : item.userImg
          } /> 
          <span class="mention-user-list-item-name">${
            item.screenName
          } ${currentUserYouName}</span> 
      <span class="mention-user-list-item-details"> to ${
        item.fwdChannelName
      }</span> 
          <span class="mention-user-list-item-details"> ${" "}
    ${item.fwdFlag ? `| ${item.timestamp}` : ""}</span>  
        </div>
        `;
  } else {
    return `
        <div>

          <img class="mention-user-list-item-img" src=${
            item.userImg === "" ? DefaultUser : item.userImg
          } /> 
          <span class="mention-user-list-item-name">${
            item.screenName
          } ${currentUserYouName}</span> 
          <span class="mention-user-list-item-details">${
            item.jobTitle ? item.jobTitle : ``
          } ${item.jobTitle ? "@" : ""} ${
      item.affiliation ? item.affiliation : ``
    } ${item.fwdFlag ? `| ${item.timestamp}` : ""}
              ${
                item.affiliation
                  ? `<span> (${item.companyName})</span>`
                  : `<span></span>`
              }
              ${
                !item.affiliation
                  ? `<span>${item.companyName}</span>`
                  : `<span></span>`
              }</span>  
          ${
            item.userType.toString().toUpperCase() !== "INTERNAL"
              ? `<span class="mention-user-list-item-user-type"> ${item.userType}</span>`
              : `<span></span>`
          }
        </div>
        `;
  }
}

function buildList(members, currentUserId) {
  var list = "<ul class='ReplyView__mentions'>";
  for (let i = 0; i < members.length; i++) {
    list += `<li index=${i} data-index=${i} >${getItem(
      members[i],
      currentUserId
    )}</li>`;
  }
  list += "</ul>";
  return list;
}
function addFocus(e) {
  e.target.focus();
}
function insertNodeAtCaret(node) {
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var range = sel.getRangeAt(0);
      range.collapse(false);
      range.insertNode(node);
      range = range.cloneRange();
      range.selectNodeContents(node);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type !== "Control"
  ) {
    var html = node.nodeType === 1 ? node.outerHTML : node.data;
    var id = "marker_" + ("" + Math.random()).slice(2);
    html += '<span id="' + id + '"></span>';
    var textRange = document.selection.createRange();
    textRange.collapse(false);
    textRange.pasteHTML(html);
    var markerSpan = document.getElementById(id);
    textRange.moveToElementText(markerSpan);
    textRange.select();
    markerSpan.parentNode.removeChild(markerSpan);
  }
}


const deleteChar = () => document.execCommand("delete", false, null);


function getListItems(target) {
  const list = target?.parentElement
    .querySelector(".ReplyView__tooltip")
    .querySelectorAll("li");
  return [...list];
}

function getCurrentSelection(target) {
  const list = target?.parentElement
    .querySelector(".ReplyView__tooltip")
    .querySelectorAll("li.focused");
  return list[0].dataset.index;
}

function changeSelection(key, target) {
  const items = getListItems(target);
  const selectedItem = items?.filter((ele) => {
    if (ele.classList.contains("focused")) {
      ele.classList.remove("focused");
      return true;
    } else {
      return false;
    }
  })[0];
  let selectedIndex = items?.indexOf(selectedItem);
  if (key === 38) {
    selectedIndex = selectedIndex - 1;
  } else {
    selectedIndex = selectedIndex + 1;
  }

  if (selectedIndex >= items?.length) {
    selectedIndex = 0;
  } else if (selectedIndex < 0) {
    selectedIndex = items?.length - 1;
  }
  items[selectedIndex].classList.add("focused");
}

export function hasSelection() {
  if (document.querySelector(".ReplyView__tooltip").style.display === "block") {
    // eslint-disable-next-line no-unused-expressions
    getListItems()?.filter((ele) => {
      if (ele.classList.contains("focused")) {
        ele.click();
        return true;
      } else {
        return false;
      }
    });
    return true;
  }
  return false;
}

let arrowKey = false;
let filterMembers = [];
export function handleKeyUp(event, members, channel, submitCallback) {
  const { target, keyCode } = event;
  let value = target.innerText;

  const { key } = event;

  const callback = (done) => {
    if (value === "@") {
      target.innerHTML = "";
    } else {
      let chars = target.innerText.split("");
      let i = currentIndex - 1;
      do {
        if (chars[i] === "@") {
          deleteChar();
          if (chars[i - 1] === " ") {
            deleteChar();
          }
          break;
        }
        if (chars[i] !== "@") {
          deleteChar();
        }
        i--;
      } while (i >= 0);
    }
    done();
  };

  if (key === "Escape") {
    renderUtil.removeList(target, [], channel, "");
    return;
  }
  if (
    key === "Enter" &&
    target.parentElement.querySelector(".ReplyView__tooltip").style.display ===
      "block"
  ) {
    //setHtml(getSelectionItem(members[index]));
    let index = getCurrentSelection(target);
    let element = document.createElement("span");
    let chars = target.innerText.split("");

    if (chars.length < 2) {
      deleteChar();
      element.innerHTML = getSelectionItem(filterMembers[index]);
      insertNodeAtCaret(element);
      value = "";
    } else {
      if (chars[chars.length - 1].charCodeAt() === 10) {
        deleteChar();
        if (chars[chars.length - 2] === "@") {
          deleteChar();
        }
      } else if (chars[chars.length - 1] === "@") {
        deleteChar();
      } else {
        for (var i = chars.length - 1; i >= 0; i--) {
          if (chars[i] === "@") {
            if (!arrowKey) {
              for (var j = i - 1; j < chars.length - 1; j++) {
                deleteChar();
              }
              break;
            } else {
              deleteChar();
              break;
            }
          }
        }
      }
      element.innerHTML = getSelectionItem(filterMembers[index]);
      insertNodeAtCaret(element);
    }
  }
  if (keyCode === 38 || keyCode === 40) {
    changeSelection(keyCode, target);
  } else if (keyCode === 37 || keyCode === 39) {
    let currentIndex = getCaretCharacterOffsetWithin(target);
    let currentChar = value[currentIndex - 1];
    let previousChar = value[currentIndex - 2];
    if (
      currentChar &&
      currentChar === "@" &&
      (!previousChar ||
        previousChar.charCodeAt() === 32 ||
        previousChar.charCodeAt() === 160)
    ) {
      arrowKey = true;
      renderUtil.renderList(target, members, channel, callback);
    } else if (
      target.parentElement.querySelector(".ReplyView__tooltip").style
        .display === "block"
    ) {
      renderUtil.removeList(
        target,
        members,
        channel,
        value,
        currentIndex,
        callback
      );
      arrowKey = false;
    } else {
      arrowKey = false;
    }
  } else {
    arrowKey = false;
    let currentIndex = getCaretCharacterOffsetWithin(target);
    let lastStr = value.substr(currentIndex - 3, 3);
    if (
      lastStr.trim() === "@" ||
      lastStr.endsWith(" @") ||
      value.trim() === "@"
    ) {
      arrowKey = true;
      renderUtil.renderList(target, members, channel, callback);
    } else {
      renderUtil.removeList(
        target,
        members,
        channel,
        value,
        currentIndex,
        callback
      );
    }
  }
}
export const renderUtil = {
  removeList: (
    target,
    members,
    channel,
    value,
    currentIndex,
    callback,
    parent
  ) => {
    var element = target
      ? target.parentElement.querySelector(".ReplyView__tooltip")
      : parent;
    if (element.style.display === "block") {
      let enableHideIt = false;
      if (value === "") {
        element.style.display = "none";
        filterMembers = [];
        return;
      }
      let chars = value.split("");
      let searchStr = "";
      for (let i = currentIndex - 1; i > 0; i--) {
        if (chars[i] === "@") {
          break;
        }
        if (chars[i] === " ") {
          enableHideIt = true;
          break;
        }
        searchStr = chars[i] + searchStr;
      }
      if (enableHideIt) {
        element.style.display = "none";
        return;
      }
      let membersTmp = [];
      for (let i = 0; i < members.length; i++) {
        if (
          members[i].screenName
            .toLowerCase()
            .startsWith(searchStr.toLowerCase())
        ) {
          membersTmp.push(members[i]);
        }
      }
      if (membersTmp.length === 0) {
        element.style.display = "none";
        return;
      } else {
        renderUtil.renderList(target, membersTmp, channel, callback);
      }
    } else {
      element.style.display = "none";
    }
  },
  renderList: (target, members, channel, callback) => {
    filterMembers = members;
    currentChannel = channel;
    const list = buildList(members);
    const parent = target.parentElement.querySelector(".ReplyView__tooltip");
    parent.innerHTML = list;
    parent.style.display = "block";
    parent.querySelector("li").classList.add("focused");
    parent.querySelectorAll("li").forEach((element) => {
      element.addEventListener("mousedown", () => {
        target.parentElement
          .querySelector(".script-textarea")
          .addEventListener("blur", addFocus);
      });
      element.addEventListener("click", (e) => {
        target.parentElement
          .querySelector(".script-textarea")
          .removeEventListener("blur", addFocus);
        const index = parseInt(e.currentTarget.dataset.index);
        callback(() => {
          //setHtml(getSelectionItem(members[index]));
          let element = document.createElement("span");
          element.innerHTML = getSelectionItem(members[index]);
          insertNodeAtCaret(element);
        });
        parent.style.display = "none";
      });
    });
  },
  renderMemberList: (parent, members, channel, currentUserId) => {
    currentChannel = channel;
    const list = buildList(members, currentUserId);
    parent.innerHTML = list;
    parent.style.display = "block";
  },
  removeMemberList: (parent, members, channel, value) => {
    renderUtil.removeList(null, members, channel, value, 0, null, parent);
  },
};
