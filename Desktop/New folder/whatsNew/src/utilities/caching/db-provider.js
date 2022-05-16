import { DATABASE_NAME, DB_VERSION, DB_VERSION_NEW } from "../../constants";
import Dexie from "dexie";
import { uniqueID } from "../utils";

const indexDb = new Dexie(DATABASE_NAME);

export const postType = {
  id: "id",
  channelId: "channelId",
  postId: "postId",
  post: "post",
};

export const UserInfo = {
  autoId: "autoId",
  id: "id",
  channelId: "channelId",
  screenName: "screenName",
};

export const linkInfo = {
  linkUrl: "linkUrl",
};

// Declare tables, IDs and indexes
indexDb.version(DB_VERSION).stores({
  posts: `++${postType.id}, ${postType.postId}, ${postType.channelId}, ${postType.post}`,
  users: `${UserInfo.id}, ${UserInfo.screenName}`,
  linkInfo: `${linkInfo.linkUrl}`,
});

// Declare tables, IDs and indexes
indexDb
  .version(DB_VERSION_NEW)
  .stores({
    posts: `++${postType.id}, ${postType.postId}, ${postType.channelId}, ${postType.post}`,
    users: `${UserInfo.id}, ${UserInfo.screenName}`,
    linkInfo: `${linkInfo.linkUrl}`,
  })
  .upgrade((trans) => {
    return trans.linkInfo.toCollection().modify((info) => {
      info.imageId = uniqueID();
    });
  });

export default indexDb;
