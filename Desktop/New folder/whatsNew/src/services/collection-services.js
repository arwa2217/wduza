import axios from "axios";
import server from "server";
import { AuthHeader } from "../utilities/app-preference";
const instance = axios.create({
  baseURL: `${server.apiUrl}`,
});
instance.defaults.headers.common["Authorization"] = "";
instance.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    return error?.response?.data;
  }
);
instance.interceptors.request.use((config) => {
  config.headers = AuthHeader();
  return config;
});
const CollectionServices = {
  getCollections: () => instance.get("/ent/v1/collection"),
  createCollection: (collection) =>
    instance.post("/ent/v1/collection", collection),
  deleteCollection: (collectionId) =>
    instance.delete(`/ent/v1/collection/${collectionId}`),
  updateCollection: (collectionUpdateData, collectionId) =>
    instance.patch(`/ent/v1/collection/${collectionId}`, collectionUpdateData),

  moveOrDuplicateDiscussionToCollection: (discussionId, data) =>
    instance.put(`/ent/v1/channel/ids/${discussionId}/collections`, data),
  deleteChannelFromCollection: (discussionId, collectionId) =>
    instance.delete(
      `/ent/v1/channel/ids/${discussionId}/collections/${collectionId}`
    ),
};
export default CollectionServices;
