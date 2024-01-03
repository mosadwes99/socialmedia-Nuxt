import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let { email, password } = await readBody(event);
  let user = await userModel.findOne({ email }).populate("friends");
  const runtimeConfig = useRuntimeConfig();

  if (user) {
    let match = await bcrypt.compare(password, user.password);
    if (match) {
      let token = jwt.sign(
        { name: user.name, userId: user.id },
        runtimeConfig.SECRET_KEY
      );

      return {
        token: token,
        msg: "login",
        data: {
          name: user.name,
          img: user.userImage,
          email: user.email,
          friends: user.friends,
          id: user._id,
          userName: user.userName,
        },
      };
    } else {
      return {
        msg: "Password is wrong",
      };
    }
  } else {
    return {
      msg: "The email not exist",
    };
  }
});
