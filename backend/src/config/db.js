import mongoose from "mongoose";
import config from "./config.js";
import seedInitialAlbums from "../utils/seed.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("MongoDB connected successfully !!!");
    await seedInitialAlbums();
  } catch (error) {
    console.error("MongoDB connection failed !!!", error);
    process.exit(1);
  }
};

export default connectDB;