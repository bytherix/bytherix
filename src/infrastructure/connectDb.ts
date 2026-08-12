
import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = () => {
    try {
        const connect = mongoose.connect(ENV.MONGO_URI);
        console.log("Database connected successfully");
        return connect;

    } catch (error: any) {
        throw new Error("Database connection failed", error);
    }
}