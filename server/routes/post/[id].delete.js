import { postModel } from "../../models/post.model.js";
import fs from "fs";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, "id");
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

    let post = await postModel.findByIdAndDelete(id);

    post.imgs.forEach((item) => fs.unlinkSync(`public/posts/${item}`));
    return { msg: "post deleted successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
