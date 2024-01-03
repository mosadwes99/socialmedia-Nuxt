import { userModel } from "~/server/models/user.model.js";
import { postModel } from "../../models/post.model.js";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
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
    let user = await userModel.findById(decoded.userId);
    let posts = await postModel
      .find({ createdBy: { $in: user.friends } })
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", select: "name , userImage" })
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "name userImage",
        },
      });

    return { msg: "posts get successfully", data: posts };
  } catch (err) {
    return { msg: "there are error" };
  }
});
