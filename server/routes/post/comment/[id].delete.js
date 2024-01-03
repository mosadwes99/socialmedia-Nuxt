import { commentModel } from "../../../models/comment.model.js";
import { postModel } from "../../../models/post.model.js";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, "id");
  let { postId } = await readBody(event);
  let { token } = event.req.headers;

  try {
    let runtimeConfig = useRuntimeConfig();

    function verifyToken() {
      return new Promise((resolve, reject) => {
        jwt.verify(token, runtimeConfig.SECRET_KEY, (err, decoded) => {
          if (err) {
            reject(err);
            console.log(err);
          } else {
            resolve(decoded);
          }
        });
      });
    }

    let decoded = await verifyToken();

    await commentModel.findByIdAndDelete(id);
    let post = await postModel.findById(postId);
    let comments = [];
    comments = post.comments.filter((comment) => comment != id);
    await postModel.findByIdAndUpdate(postId, { comments: comments });

    return { msg: "Comment deleted successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
