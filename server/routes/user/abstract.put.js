import jwt from "jsonwebtoken";
import { userModel } from "~/server/models/user.model.js";

export default defineEventHandler(async (event) => {
  let { token } = event.req.headers;
  let { abstract, statue } = await readBody(event);

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
    let user = await userModel.findByIdAndUpdate(decoded.userId, {
      abstract,
      statue,
    });
    return { msg: "abstract Changed successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
