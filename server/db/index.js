import mongoose from "mongoose";

export default async (_nitroApp) => {
  const runtimeConfig = useRuntimeConfig();
  await mongoose
    .connect(runtimeConfig.MONGO_URL)
    .then(() => {
      console.log("connected db");
    })
    .catch((e) => console.log(e));
};
