import indexDb, { postType, UserInfo, linkInfo } from "./db-provider";
import { CurrentChannelCachedLimit } from "../../constants";

const previousPostCount = 20;
const totalPostToRetrieve = 20;

/**
 * Insert Post message in database
 * @param channelId { string } Unique Id of channel/Discussion
 * @param posts { array } post- Actual post which needs to be insert in table
 */
export const addPost = async (channelId, posts) => {
  const lastPost = await getLastPost(channelId);
  if (!lastPost || posts.id - lastPost.post.id === 1) {
    await updatePost(channelId, [posts], 1);
    return false;
  } else {
    //reject the update and let calling entity to sync the messages first
    return true;
  }
};

/**
 * return the list of post based on the params
 * @param {bool} isFresh Will be true When user visit  channel first time else false
 * @param {string} channelId Unique channelId of channel/discussion
 * @param {number} scrollDirection Direction of user scrolling , 1 for scrollingUP and 0 for scrolling bottom
 * @param {string} postId Unique Id of a post message
 */
export const getPost = async (isFresh, channelId, scrollDirection, postId) => {
  const posts = await retrievePosts(
    isFresh,
    channelId,
    scrollDirection,
    postId
  );
  if (posts) {
    return posts.map((item) => item.post);
  } else {
    return [];
  }
};

/**
 * return the list of post based on the params
 * @param {bool} isFresh Will be true When user visit  channel first time else false
 * @param {string} channelId Unique channelId of channel/discussion
 * @param {number} scrollDirection Direction of user scrolling , 1 for scrollingUP and 0 for scrolling bottom
 * @param {string} postId Unique Id of a post message
 */
const retrievePosts = async (isFresh, channelId, scrollDirection, postId) => {
  const selectedPost = await indexDb.posts
    .where(postType.postId)
    .equals(postId)
    .limit(1)
    .toArray();
  if (selectedPost.length === 0) {
    return [];
  }
  const selectedPostId = selectedPost[0].id;
  if (scrollDirection === -1) {
    const records = await indexDb.posts
      .filter((p) => p.channelId === channelId && p.id < selectedPostId, {
        channelId,
        selectedPostId,
      })
      .limit(totalPostToRetrieve)
      .toArray();
    return records;
  } else if (isFresh) {
    const idToGreaterThan = selectedPost[0].id - previousPostCount;
    return await indexDb.posts
      .filter((p) => p.channelId === channelId && p.id > idToGreaterThan, {
        channelId,
        idToGreaterThan,
      })
      .toArray();
  } else {
    return await indexDb.posts
      .filter((p) => p.channelId === channelId && p.id > selectedPostId, {
        channelId,
        postId,
      })
      .limit(totalPostToRetrieve)
      .toArray();
  }
};

const getLastPost = async (channelId) => {
  return await indexDb.posts.where(postType.channelId).equals(channelId).last();
};

/**
 *
 * @param {String} channelId - Unique Id of channel/Discussion
 * @param {Array} posts - Post list of the channel/discussion
 * @param {Number} scrollDirection - Direction of user scroll 0 for down and 1 for UP
 * @param {Boolean} clearPrevious - true/false to clear the previous post or not
 */
export const updatePost = async (
  channelId,
  posts,
  scrollDirection,
  clearPrevious
) => {
  if (clearPrevious) {
    await indexDb.posts.where(postType.channelId).equals(channelId).delete();
  }
  const existingPosts = await indexDb.posts
    .where(postType.channelId)
    .equals(channelId)
    .toArray();

  let postsToInsert = preparePost(channelId, posts);
  if (scrollDirection === -1) {
    if (existingPosts.length < CurrentChannelCachedLimit) {
      //this is to insert add bottom
      existingPosts.forEach((post) => {
        delete post.id;
      });
      const totalPosts = postsToInsert.concat(existingPosts);
      await indexDb.posts.where(postType.channelId).equals(channelId).delete();
      await indexDb.posts.bulkAdd(totalPosts);
      return;
    }
  } else {
    const recordsToInsert = [];
    if (existingPosts.length) {
      const lastPost = existingPosts[existingPosts.length - 1];
      for (let i = 0; i < postsToInsert.length; i++) {
        //make sure it does not insert duplicate records
        if (postsToInsert[i].post.id > lastPost.post.id) {
          recordsToInsert.push(postsToInsert[i]);
        }
      }
      indexDb.posts.bulkAdd(recordsToInsert);
    } else {
      indexDb.posts.bulkAdd(postsToInsert);
    }

    //remove history records from cache
    if (
      existingPosts.length + recordsToInsert.length >
      CurrentChannelCachedLimit
    ) {
      const first20thRecordPostId = existingPosts[20].id;
      indexDb.posts
        .filter(
          (p) => p.channelId === channelId && p.id < first20thRecordPostId,
          {
            channelId,
            first20thRecordPostId,
          }
        )
        .delete();
    }
  }
};

const preparePost = (channelId, posts) => {
  const cachedData = [];
  for (let i = 0; i < posts.length; i++) {
    cachedData.push({
      channelId: channelId,
      postId: posts[i].post.id,
      post: posts[i],
    });
  }
  return cachedData;
};

export const syncChannelRecords = async (channelId, post) => {
  //if last record and latest read post id mismatch then clear channel messages
  const lastRecord = await indexDb.posts
    .where(postType.channelId)
    .equals(channelId)
    .last();
  if (lastRecord && lastRecord[0]) {
    if (post.id - lastRecord[0].post.id !== 0) {
      await indexDb.posts.where(postType.channelId).equals(channelId).delete();
    }
  }
};

/**
 * Add the users into database , here All user (exist in list) must have list of channel_id from which they belong to
 * @param {Array} users - Array of user Object where object should contains all the informaiton about user
 */
export const addUsers = async (userList) => {
  let userToBeAdd = [];
  for (let i = 0; i < userList.length; i++) {
    let existingUser = await getUser(userList[i].id);
    let user = {
      id: userList[i].id,
      channelId: userList[i].channel_id,
      screenName: userList[i].screenName,
      user: userList[i],
    };

    if (existingUser && existingUser.id) {
      await updateUser(user.id, user);
    } else {
      userToBeAdd.push(user);
    }
  }
  if (userToBeAdd.length > 0) {
    await indexDb.users.bulkAdd(userToBeAdd);
  }
  return;
};

export const updateUsersImage = async (userList) => {
  for (let i = 0; i < userList.length; i++) {
    let existingUser = await getUser(userList[i].userID);
    if (existingUser && existingUser.id) {
      existingUser.user.userImg = userList[i].image;
      let user = {
        id: existingUser.id,
        channelId: existingUser.channelId ? [...existingUser.channelId] : [],
        screenName: existingUser.screenName,
        user: existingUser.user,
      };
      await updateUser(user.id, user);
    }
  }
  return;
};

/**
 * Add the users into database , here All user (exist in list) must belong to same channelId
 * @param {String} channelId Unique Id of channel from user list belong
 * @param {Object} user - Array of user Object where object should contains all the informaiton about user
 */

export const addUsersByChannel = async (userList, channelId) => {
  let userToBeAdd = [];
  for (let i = 0; i < userList.length; i++) {
    let existingUser = await getUser(userList[i].id);
    let user = {
      id: userList[i].id,
      channelId: [channelId],
      screenName: userList[i].screenName,
      user: userList[i],
    };

    if (existingUser && existingUser.id) {
      user.channelId = existingUser.channelId
        ? [...existingUser.channelId]
        : [];
      if (!user.channelId.includes(channelId)) {
        user.channelId.push(channelId);
      }
      user.user.channel_id = user.channelId;
      await updateUser(user.id, user);
    } else {
      user.user.channel_id = user.channelId;
      userToBeAdd.push(user);
    }
  }
  if (userToBeAdd.length > 0) {
    await indexDb.users.bulkAdd(userToBeAdd);
  }
  return;
};

/**
 * Add the users into database , here All user (exist in list) must belong to same channelId
 * @param {String} channelId Unique Id of channel from user list belong
 * @param {Object} user - Array of user Object where object should contains all the informaiton about user
 */
export const addUser = async (user, channelId) => {
  let userToBeAdd = [];
  let existingUser = await getUser(user.id);
  let userInfo = {
    id: user.id,
    channelId: [channelId],
    screenName: user.screenName,
    user: user,
  };

  if (existingUser && existingUser.id) {
    userInfo.channelId = existingUser.channelId
      ? [...existingUser.channelId]
      : [];
    if (!userInfo.channelId.includes(channelId)) {
      userInfo.channelId.push(channelId);
    }
    userInfo.user.channel_id = userInfo.channelId;
    await updateUser(userInfo.id, userInfo);
  } else {
    userInfo.user.channel_id = userInfo.channelId;
    userToBeAdd.push(userInfo);
  }

  if (userToBeAdd.length > 0) {
    await indexDb.users.bulkAdd(userToBeAdd);
  }
  return;
};

/**
 * Get the User by userId
 * @param userId {string} Get the UserInfo by userId
 */
export const getUser = async (userId) => {
  return await indexDb.users.where(UserInfo.id).equals(userId).first();
};

/**
 * Get list of all User by userId
 *
 */
export const getAllUser = async () => {
  return await indexDb.users.toArray();
};

/**
 *
 * @param {String} userId Unique uuid of the user
 * @param {Object} user Object of user
 */
export const updateUser = async (userId, user) => {
  return await indexDb.users.where(UserInfo.id).equals(userId).modify(user);
};

/**
 *
 * @param {String} channelId Channel Id from which user is removed
 * @param {Object} userId Unique uuid of the user
 */
export const deleteUserByChannelId = async (channelId, userId) => {
  let user = await indexDb.users.where(UserInfo.id).equals(userId).first();
  if (user && user.channelId && user.channelId.length > 1) {
    let index = user.channelId.findIndex((channel) => channel === channelId);
    if (index !== -1) {
      user.channelId.splice(index, 1);
      user.user.channel_id = user.channelId;
    }
    return await updateUser(userId, user);
  } else {
    return await indexDb.users.where(UserInfo.id).equals(userId).delete();
  }
};

/**
 *
 * @param {String} channelId Channel Id from which user is removed
 * @param {Object} userId Unique uuid of the user
 */
export const deleteUsersByChannelId = async (channelId) => {
  let users = await getUsersByChannelId(channelId);
  if (users && users.length > 0) {
    users.map(async (user) => {
      if (user && user.channelId && user.channelId.length > 1) {
        let index = user.channelId.findIndex(
          (channel) => channel === channelId
        );
        if (index !== -1) {
          user.channelId.splice(index, 1);
          user.user.channel_id = user.channelId;
        }
        return await updateUser(user.id, user);
      } else {
        return await indexDb.users.where(UserInfo.id).equals(user.id).delete();
      }
    });
  }
};
/**
 *
 * @param {String} channelId - Get the List of user by channelId
 */
export const getUsersByChannelId = async (channelId) => {
  return await indexDb.users
    .filter((user) => user.channelId.includes(channelId))
    .toArray();
};

/**
 * Return the user info based on user screen name
 * @param {String} screenName - Unique screen name of the user
 */
export const getUserByName = async (screenName) => {
  return await indexDb.users
    .filter((user) => user.screenName === screenName)
    .first();
};

/**
 * Return the user info based on user screen name
 * @param {String} screenName - Unique screen name of the user
 * @param {String} channelId -  channelId in which user is to be searched
 */
export const getUserByNameAndChannelId = async (screenName, channelId) => {
  return await indexDb.users
    .filter(
      (user) =>
        user.screenName === screenName && user.channelId.includes(channelId)
    )
    .first();
};

/**
 * Get the list of user by spefying Query based on name and channelId
 * @param {String} nameStartWith - starting character of user screen name
 * @param {String} channelId - filte the user based on channelId
 */
export const getUserByQuery = async (nameStartWith, channelId) => {
  if (channelId && !nameStartWith) {
    return await indexDb.users
      .filter((user) => user.channelId.includes(channelId))
      .toArray();
  } else if (channelId && nameStartWith) {
    return await indexDb.users
      .filter(
        (user) =>
          user.channelId.includes(channelId) &&
          user.screenName.startsWith(nameStartWith)
      )
      .toArray();
  } else if (nameStartWith && !channelId) {
    return await indexDb.users
      .filter((user) => user.screenName.startsWith(nameStartWith))
      .toArray();
  } else {
    return await indexDb.users.toArray();
  }
};

/**
 * Get linkData for a given linkUrl
 * @param {String} linkUrl - the link url to fetch data for
 */
export const linkUrlExists = async (linkUrl) => {
  let result = await indexDb.linkInfo
    .where(linkInfo.linkUrl)
    .equals(linkUrl)
    .first();
  return result ? true : false;
};

/**
 * Get linkData for a given linkUrl
 * @param {String} linkUrl - the link url to fetch data for
 */
export const getLinkDataByLinkUrl = async (linkUrl) => {
  return await indexDb.linkInfo.get(linkUrl);
};

/**
 * Insert linkData and linkUrl
 * @param {JSON} linkData - the link data to be inserted
 */
export const insertLinkData = async (value, linkUrl, imageId) => {
  getLinkDataByLinkUrl(linkUrl).then(async (linkInfo) => {
    if (linkInfo === undefined) {
      value = { ...value, imageId: imageId };
      await indexDb.linkInfo.add({ value, linkUrl });
    }
  });
};
