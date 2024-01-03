import { userModel } from "../../../models/user.model";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    let { token } = event.req.headers;
    let id = getRouterParam(event, "id");
    let runtimeConfig = useRuntimeConfig();

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
    console.log(id);
    let requestSent = [];
    let requestReceive = [];

    let user = await userModel.findById(decoded.userId);
    requestSent = user.requestSent.filter((item) => item != id);
    await userModel.findByIdAndUpdate(decoded.userId, {
      requestSent: requestSent,
    });

    let userVisit = await userModel.findById(id);
    requestReceive = userVisit.requestReceive.filter(
      (item) => item != decoded.userId
    );
    await userModel.findByIdAndUpdate(id, { requestReceive: requestReceive });
    return {
      msg: "request deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return { msg: "error" };
  }
});
