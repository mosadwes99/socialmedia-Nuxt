import { postModel } from "../../models/post.model.js";
import { writeFile } from "fs/promises";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  let data = await readMultipartFormData(event);
  let { token, title } = event.req.headers;
  let imgs = [];

  try {
    console.log(title);

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
      for (let item of data) {
        try {
          let originalname = item.filename;
          let path = Date.now() + "." + originalname.split(".").pop();

          await writeFile(`public/posts/${path}`, item.data);

          imgs = [...imgs, path];
        } catch (error) {
          return { msg: `Error processing image: ${error.message}` };
        }
      }
    }
    await getImgsLink();

    await postModel.insertMany({ title, imgs, createdBy: decoded.userId });
    return { msg: "post added successfully" };
  } catch (err) {
    return { msg: "there are error" };
  }
});
