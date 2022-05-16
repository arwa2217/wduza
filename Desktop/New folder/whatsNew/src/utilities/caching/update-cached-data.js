import indexDb, { postType } from "./db-provider";
import { CurrentChannelCachedLimit } from "../../constants";
import { getLastPost } from "./retrieve-cached-data";

const updateCachedData = async (
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

  let postsToInsert = prepareInsertData(channelId, posts);
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

const prepareInsertData = (channelId, posts) => {
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

export const addToCache = async (channelId, post) => {
  const lastPost = await getLastPost(channelId);
  if (!lastPost || post.id - lastPost.post.id === 1) {
    await updateCachedData(channelId, [post], 1);
    return false;
  } else {
    //reject the update and let calling entity to sync the messages first
    return true;
  }
};

export default updateCachedData;
