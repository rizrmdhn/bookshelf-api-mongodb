import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bookshelf");
    console.log("Database connected");
  } catch (error) {
    console.error(error);
  }
}

export default connect;
