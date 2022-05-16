import DefaultUser from "@icons/default-user.svg";
let currentChannel;
let filterMembers = [];
function getItem(item, currentUserId, renderType) {
  const currentUserYouName = item.id === currentUserId ? "(you)" : "";
  return `<div style="width:100%" class="mention-details">
            <img class="mention-user-list-item-img" src=${
              item.userImg && item.userImg !== "" ? item.userImg : DefaultUser
            } /> 
            <span class="mention-user-list-item-name">${
              item.screenName
            } ${currentUserYouName}</span> 
            <span class="mention-user-list-item-details">${
              item.jobTitle ? item.jobTitle : ``
            } ${item.jobTitle ? "@" : ""} ${
    item.companyName ? item.companyName : ``
  }</span><span class="mention-user-list-item-details"> |  ${
    item.timestamp
  }</span></div>
            ${
              renderType === "LOCATION"
                ? `<div class="mention-type"><span class="mention-user-list-item-user-type ${
                    item.location
                  }"> ${
                    item.location === "OUTSIDE_OFFICE"
                      ? "Out of the office"
                      : "In the office"
                  }</span>`
                : `<span></span>`
            }
          </div>`;
}

function buildList(members, currentUserId, renderType) {
  var list = "<ul class='ReplyView__mentions p-0'>";
  for (let i = 0; i < members.length; i++) {
    list += `<li index=${i} data-index=${i} >${getItem(
      members[i],
      currentUserId,
      renderType
    )}</li>`;
  }
  list += "</ul>";
  return list;
}

function addFocus(e) {
  e.target.focus();
}

function getSelectionItem(item) {
  return `<span class="mention" contenteditable="false" data-index="0" data-command-char="@" data-id="${item.id}" data-value="${item.screenName}" data-channel-id="${currentChannel.id}">&#65279;<span><span class="ql-mention-command-char">@</span>${item.screenName}</span>&#65279;</span> `;
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
  renderMemberList: (parent, members, channel, currentUserId, renderType) => {
    currentChannel = channel;
    const list = buildList(members, currentUserId, renderType);
    parent.innerHTML = list;
    parent.style.display = "block";
  },
  removeMemberList: (parent, members, channel, value) => {
    renderUtil.removeList(null, members, channel, value, 0, null, parent);
  },
};
