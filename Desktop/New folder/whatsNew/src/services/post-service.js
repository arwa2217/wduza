import server from "server";
import axios from "axios";
import { AuthHeader } from "../utilities/app-preference";

function postShare(data) {
  return axios
    .create({
      baseURL: server.apiUrl,
      headers: AuthHeader(),
    })
    .post("/ent/v1/post/share", data);
}
const PostService = {
  postShare,
};
export default PostService;
