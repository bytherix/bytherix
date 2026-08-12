import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

export const uploadImage = async (imagePath: string) => {
    const result = await cloudinary.uploader.upload(imagePath, { folder: "bytherix" });
    await fs.unlink(imagePath); // Cleans up local file
    return result;
};

export const deleteImage = async (publicId: string) => {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
        throw new Error(`Cloudinary image delete failed: ${result.result}`);
    }
    return result;
};

export const uploadVideo = async (videoPath: string) => {
    const result = await cloudinary.uploader.upload(videoPath, {
        folder: "bytherix-course-video",
        resource_type: "video"
    });
    await fs.unlink(videoPath);
    return result;
}

export const deleteVideo = async (videoPublicId: string) => {
    const result = await cloudinary.uploader.destroy(videoPublicId, {
        resource_type: "video"
    });

    if (result.result !== 'ok') {
        throw new Error(`Cloudinary video delete failed: ${result.result}`);
    }
    return result;
};