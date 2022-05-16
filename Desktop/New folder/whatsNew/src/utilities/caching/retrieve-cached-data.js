import indexDb, { postType } from "./db-provider";

const previousPostCount = 20;
const totalPostToRetrieve = 20;
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

const getCachedPost = async (isFresh, channelId, scrollDirection, postId) => {
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
export const getLastPost = async (channelId) => {
  return await indexDb.posts.where(postType.channelId).equals(channelId).last();
};

export default getCachedPost;
