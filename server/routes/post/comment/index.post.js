import { commentModel } from "../../../models/comment.model.js";
import { postModel } from "../../../models/post.model";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    let { id, content } = await readBody(event);
    let { token } = event.req.headers;
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

    let comment = await commentModel.insertMany({
      content: content,
      postId: id,
      createdBy: decoded.userId,
    });
    let post = await postModel.findById(id);
    let comments = [];
    comments = [...post.comments, comment[0]._id];
    await postModel.findByIdAndUpdate(id, { comments: comments });
    return { msg: "Comment Created Successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
