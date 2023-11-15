import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongo = process.env.mongo_url
const connection = mongoose.connect(`${mongo}`);

export default connection;