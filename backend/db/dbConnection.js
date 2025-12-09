import mongoose from "mongoose";
import dontenv from "dotenv";

dontenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("please define mongo url");
}

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connection successful");
  } catch (error) {
    console.log("Problem in connecting database");
  }
};
