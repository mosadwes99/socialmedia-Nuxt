import { writeFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { userModel } from "~/server/models/user.model.js";
import fs from "fs";

export default defineEventHandler(async (event) => {
  let data = await readMultipartFormData(event);
  let { token } = event.req.headers;
  let img = "";
  console.log(data[0]);

  try {
    console.log(img);

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

    async function getImgsLink() {
      try {
        let originalname = data[0].filename;
        let path = Date.now() + "." + originalname.split(".").pop();
        console.log(path);

        await writeFile(`public/users/${path}`, data[0].data);

        img = path;
      } catch (error) {
        return { msg: `Error processing image: ${error.message}` };
      }
    }
    await getImgsLink();

    let user = await userModel.findByIdAndUpdate(decoded.userId, {
      userImage: img,
    });

    console.log(user);
    if (user.userImage !== "10d766191578843ad4cb2350047c0b4c.jpg") {
      fs.unlinkSync(`public/users/${user.userImage}`);
    }
    console.log(user);
    return { msg: "Image Changed successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
