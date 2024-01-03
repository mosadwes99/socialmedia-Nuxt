import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    let { email, password, name } = await readBody(event);
    let user = await userModel.findOne({ email });
    const runtimeConfig = useRuntimeConfig();
    let statue = "public";
    let userImage = "10d766191578843ad4cb2350047c0b4c.jpg";
    let abstract = {
      job: "unknown",
      education: "unknown",
      address: "unknown",
      relation: "unknown",
    };

    if (user) {
      return {
        msg: "Email is already exist",
      };
    } else {
      const hash = await bcrypt.hash(
        password,
        Number(runtimeConfig.HASH_ROUND)
      );

      await userModel.create({
        email,
        name,
        password: hash,
        statue,
        userImage,
        userName: email.split("@")[0],
        abstract,
      });

      return {
        msg: "Account created successfully",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      msg: "Error creating the account",
    };
  }
});
