function canEditPost(post) {
  return Boolean(true);
}
function canDeletePost(post) {
  return Boolean(true);
}

function isSystemMessage(post) {
  return Boolean(post?.type && post?.type.lastIndexOf("SYSTEM") === 0); //(post.post ? (post.post.content.indexOf("<hidden/>") != -1) : (post.content ? post.content.indexOf("<hidden/>") != -1: false));
}

function isUserPost(post) {
  return !isSystemMessage(post);
}

function isTaskPost(post) {
  return Boolean(post.type && post.type.lastIndexOf("TASK") === 0);
}
export function isConsecutivePostByUser(post, previousPost) {
  let consecutivePostByUser = false;
  if (previousPost) {
    if (isSystemMessage(previousPost)) {
      return false;
    }
    consecutivePostByUser =
      post.user.id === previousPost.user.id && // The post is by the same user
      //post.post.createdAt - previousPost.post.createdAt <= 24 && // If the post is same day then only it should be treated at consecutive message
      !isSystemMessage(post) &&
      !isSystemMessage(previousPost); // And neither is a system message
  }
  return consecutivePostByUser;
}

const updatePostTags = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  if (currentMessages === undefined) {
    return stateMessages;
  }
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      message.tagInfo = payload.tagInfo;
    }
  });
  return currentMessages;
};

const updatePostReactions = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  if (currentMessages === undefined) {
    return stateMessages;
  }
  var index;
  for (index = 0; index < currentMessages.length; index++) {
    if (currentMessages[index].post.id === payload.postId) {
      if (!currentMessages[index].reactions) {
        currentMessages[index].reactions = {
          myReactions: [],
          reactionStats: {},
        };
      }

      if (currentMessages[index].reactions.myReactions === null) {
        currentMessages[index].reactions.myReactions = [];
      }

      let reactions = Object.assign({}, currentMessages[index].reactions);
      reactions.reactionStats = payload.reaction;
      currentMessages[index].reactions = reactions;
      break;
    }
  }
  return currentMessages;
};

const removeUserReaction = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  if (currentMessages === undefined) {
    return stateMessages;
  }
  var i;
  for (i = 0; i < currentMessages.length; i++) {
    if (currentMessages[i].post.id === payload.postId) {
      if (!currentMessages[i].reactions) {
        currentMessages[i].reactions = {
          myReactions: [],
          reactionStats: {},
        };
      }

      if (currentMessages[i].reactions.myReactions === null) {
        currentMessages[i].reactions.myReactions = [];
      }
      var myReactions = currentMessages[i].reactions.myReactions;
      var j;
      var matchReaction = false;
      for (j = 0; j < myReactions.length; j++) {
        if (myReactions[j].Reaction === payload.reaction) {
          matchReaction = true;
          break;
        }
      }
      if (matchReaction) {
        myReactions.splice(j, 1);
      }
      let reactions = Object.assign({}, currentMessages[i].reactions);
      currentMessages[i].reactions = reactions;
      break;
    }
  }
  return currentMessages;
};

const addUserReaction = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  if (currentMessages === undefined) {
    return stateMessages;
  }
  var index;
  for (index = 0; index < currentMessages.length; index++) {
    if (currentMessages[index].post.id === payload.postId) {
      if (!currentMessages[index].reactions) {
        currentMessages[index].reactions = {
          myReactions: [],
          reactionStats: {},
        };
      }
      if (currentMessages[index].reactions.myReactions === null) {
        currentMessages[index].reactions.myReactions = [];
      }

      currentMessages[index].reactions.myReactions.push({
        Reaction: payload.reaction,
      });

      let reactions = Object.assign({}, currentMessages[index].reactions);
      currentMessages[index].reactions = reactions;
      break;
    }
  }
  return currentMessages;
};

function hasValidMessageSequence(channelMessages, newMessage) {
  let sequenceIsValid = false;
  let lastValidMessage = channelMessages[channelMessages.length - 1];
  let secondLastValidMessage =
    channelMessages.length > 1
      ? channelMessages[channelMessages.length - 2]
      : lastValidMessage;
  if ("sending" === lastValidMessage.post.postStatus) {
    var index;
    for (index = channelMessages.length - 1; index >= 0; index--) {
      if ("sending" === channelMessages[index].post.postStatus) {
        continue;
      }
      lastValidMessage = channelMessages[index];
      break;
    }
    if (index !== 0) {
      secondLastValidMessage = channelMessages[--index];
    }
  }
  if (
    newMessage.sequence_id - 1 === lastValidMessage.sequence_id ||
    (newMessage.sequence_id - 1 === secondLastValidMessage &&
      secondLastValidMessage.sequence_id)
  ) {
    //At the latest message
    sequenceIsValid = true;
  }
  return sequenceIsValid;
}

function highlightContent(data) {
  return `<span style='color:#2D76CE;background:#D7E8FF;padding:2px'>${data}</span>`;
}

function getHighlightedHtml(quote, content) {
  quote = quote.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, "");
  quote = quote.trim();
  let regexArr = quote.split(" ");
  regexArr = regexArr.filter((item) => item !== "");
  let finalRegex = regexArr[0];
  for (let i = 1; i < regexArr.length; i++) {
    finalRegex = finalRegex + "|" + regexArr[i];
  }

  finalRegex = finalRegex?.replace(
    new RegExp(`(${/\{|\[|\}|\]|\(|\)|\\|\//})`, "gi"),
    "|\\$1|"
  );
  const regex = new RegExp(`(${finalRegex})`, `gi`);
  if (finalRegex === undefined) {
    return content;
  }
  if (finalRegex.length < 2) {
    var val = "";
    var result = "";
    let res = content.match(
      new RegExp(">([^<>](?!( *)<).*?)" + finalRegex + "(.*?)[^<>]<", "gi")
    );
    if (res === null) {
      if (content.indexOf("<") === -1 && content.indexOf(">") === -1) {
        val = content.replace(regex, highlightContent(`$1`));
        result = val;
      } else {
        result = content;
      }
    } else {
      for (let i = 0; i < res.length; i++) {
        val = res[i]?.replace(regex, highlightContent(`$1`));
        result = content.replace(res[i], val);
        content = result;
      }
    }
    return result;
  } else {
    var res = content?.split(regex);
    var resultRegex = finalRegex?.split("|");
    for (let k = 0; k < resultRegex?.length; k++) {
      var sel = "";
      for (let i = 0; i < res.length; i++) {
        if (res[i].toLowerCase() === resultRegex[k].toLowerCase()) {
          if (i + 1 < res.length && i - 1 >= 0) {
            var ltPosNext = res[i + 1].indexOf("<");
            var gtPosNext = res[i + 1].indexOf(">");
            var ltPosPrev = res[i - 1].lastIndexOf("<");
            var gtPosPrev = res[i - 1].lastIndexOf(">");
            if (
              gtPosNext >= ltPosNext &&
              ltPosNext !== -1 &&
              ltPosPrev >= gtPosPrev &&
              gtPosPrev !== 1
            ) {
              res[i] = highlightContent(res[i]);
            } else if (
              ltPosNext === -1 &&
              gtPosNext === -1 &&
              ltPosPrev === -1 &&
              gtPosPrev === -1
            ) {
              res[i] = highlightContent(res[i]);
            } else if (ltPosPrev === -1 && gtPosNext === -1) {
              res[i] = highlightContent(res[i]);
            } else if (
              gtPosPrev !== -1 &&
              ltPosPrev === -1 &&
              ((ltPosNext === -1 && gtPosNext === -1) ||
                (gtPosNext >= ltPosNext && ltPosNext !== -1))
            ) {
              res[i] = highlightContent(res[i]);
            } else if (ltPosPrev <= gtPosPrev && gtPosNext >= ltPosNext) {
              res[i] = highlightContent(res[i]);
            }
          } else {
            if (res[i].indexOf(">") !== -1 && res[i].indexOf("<") === -1) {
              res[i] = highlightContent(res[i]);
            }
          }
        }
        sel += res[i];
      }
    }

    return sel;
  }
}

const PostUtils = {
  canEditPost,
  canDeletePost,
  isSystemMessage,
  isUserPost,
  isTaskPost,
};

export {
  addUserReaction,
  removeUserReaction,
  updatePostReactions,
  updatePostTags,
  hasValidMessageSequence,
  getHighlightedHtml,
};
export default PostUtils;
