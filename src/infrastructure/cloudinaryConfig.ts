import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

const CLOUDINARY_API_KEY = ENV.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = ENV.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = ENV.CLOUDINARY_CLOUD_NAME;

export async function cloudinaryConfig() {
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME)
        throw new Error("Error: Missing Cloudinary environment variables!");

    await cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary configured successfully");
}