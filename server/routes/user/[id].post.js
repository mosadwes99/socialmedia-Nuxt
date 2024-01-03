import { postModel } from "~/server/models/post.model";
import { userModel } from "../../models/user.model";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    let { token } = event.req.headers;
    let id = getRouterParam(event, "id");
    let runtimeConfig = useRuntimeConfig();
    let friend = false;
    let statue = "";

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

    if (id === "none" || id === decoded.userId) {
      let user = await userModel
        .findById(decoded.userId)
        .populate({ path: "requestReceive" });
      let postsUser = await postModel
        .find({ createdBy: decoded.userId })
        .sort({ createdAt: -1 })
        .populate({ path: "createdBy", select: "name , userImage" })
        .populate({
          path: "comments",
          populate: {
            path: "createdBy",
            select: "name userImage",
          },
        });
      // console.log(postsUser);

      return {
        statue: "me",
        data: {
          name: user.name,
          userName: user.userName,
          id: user._id,
          email: user.email,
          name: user.name,
          friends: user.friends,
          userImage: user.userImage,
          statue: user.statue,
          abstract: user.abstract,
          posts: postsUser,
          requestSent: user.requestSent,
          requestReceive: user.requestReceive,
        },
      };
    } else {
      let user = await userModel.findById(decoded.userId, { friends: 1 });
      user.friends.map((item) => {
        if (item == id) {
          friend = true;
        }
      });

      if (friend) {
        statue = "friend";
      } else {
        statue = "strange";
      }
      // console.log(statue);
      let visitiongUser = await userModel.findById(id);
      if (visitiongUser.statue === "public") {
        let postsVisitiongUser = await postModel
          .find({ createdBy: id })
          .sort({ createdAt: -1 })
          .populate("createdBy", "name , userImage")
          .populate({
            path: "comments",
            populate: {
              path: "createdBy",
              select: "name userImage",
            },
          });
        return {
          statue: statue,
          data: {
            name: visitiongUser.name,
            userName: visitiongUser.userName,
            id: visitiongUser._id,
            email: visitiongUser.email,
            name: visitiongUser.name,
            friends: visitiongUser.friends,
            userImage: visitiongUser.userImage,
            statue: visitiongUser.statue,
            abstract: visitiongUser.abstract,
            posts: postsVisitiongUser,
            requestSent: visitiongUser.requestSent,
            requestReceive: visitiongUser.requestReceive,
          },
        };
      } else {
        if (friend) {
          let postsVisitiongUser = await postModel
            .find({ createdBy: id })
            .sort({ createdAt: -1 })
            .populate("createdBy", "name , userImage")
            .populate({
              path: "comments",
              populate: {
                path: "createdBy",
                select: "name userImage",
              },
            });
          return {
            statue: statue,
            data: {
              name: visitiongUser.name,
              userName: visitiongUser.userName,
              id: visitiongUser._id,
              email: visitiongUser.email,
              name: visitiongUser.name,
              friends: visitiongUser.friends,
              userImage: visitiongUser.userImage,
              statue: visitiongUser.statue,
              abstract: visitiongUser.abstract,
              posts: postsVisitiongUser,
              requestSent: visitiongUser.requestSent,
              requestReceive: visitiongUser.requestReceive,
            },
          };
        } else {
          return {
            statue: statue,
            data: {
              name: visitiongUser.name,
              userImage: visitiongUser.userImage,
              id: visitiongUser._id,
              statue: visitiongUser.statue,
              abstract: visitiongUser.abstract,
              posts: [],
              requestSent: visitiongUser.requestSent,
              requestReceive: visitiongUser.requestReceive,
              friends: visitiongUser.friends,
            },
          };
        }
      }
    }
  } catch (err) {
    console.error(err);
    return { msg: "error" };
  }
});
