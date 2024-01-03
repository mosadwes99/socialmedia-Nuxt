import { postModel } from "../../models/post.model.js";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    let { id, react } = await readBody(event);
    let { token } = event.req.headers;
    let runtimeConfig = useRuntimeConfig();
    console.log(react)

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

    let post = await postModel.findById(id);
    let reacts = [];
    if (react == "none") {
      reacts = post.reacts;
      reacts = reacts.filter((react) => react.reactBy != decoded.userId);
      await postModel.findByIdAndUpdate(id, { reacts: reacts });
      return { msg: "react removed successfully", reacts };
    } else {
      reacts = post.reacts;
      reacts = [
        ...reacts,
        {
          reactBy: decoded.userId,
          react: react,
        },
      ];
      await postModel.findByIdAndUpdate(id, { reacts: reacts });
      return { msg: "react added successfully", reacts };
    }
  } catch (err) {
    return { msg: "there are error" };
  }
});
