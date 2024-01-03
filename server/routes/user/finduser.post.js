import { userModel } from "../../models/user.model";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    let { query, token } = await readBody(event);
    let regexPattern = new RegExp(query, "i");
    let runtimeConfig = useRuntimeConfig();
    console.log(query, regexPattern);
    const verifyToken = () => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, runtimeConfig.SECRET_KEY, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
    };

    let decoded = await verifyToken();

    let user = await userModel.find(
      { name: regexPattern },
      { name: 1, userImage: 1 }
    );

    user = user.filter((item) => item._id != decoded.userId);
    if (user.length) {
      console.log("success");
      return { data: user, msg: "successful" };
    } else {
      return { msg: "there are no similar data" };
    }
  } catch (err) {
    console.error(err);
    return { msg: err };
  }
});
