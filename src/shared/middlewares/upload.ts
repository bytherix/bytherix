import path from "path";
import fs from "fs/promises";
import multer from "multer";
import type { Request } from "express";

const uploadDir = path.join(process.cwd(), "uploads");

async function ensureUploadDir() {
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error("Error creating uploads directory:", error);
    }
}

await ensureUploadDir();

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, uploadDir);
    },

    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);

        cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed."));
        }

        cb(null, true);
    },
});

export const courseUpload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        if (file.fieldname === "thumbnail") {
            if (!file.mimetype.startsWith("image/")) {
                return cb(new Error("Only image files are allowed for thumbnail."));
            }
        } else if (file.fieldname === "video") {
            if (!file.mimetype.startsWith("video/")) {
                return cb(new Error("Only video files are allowed for course video."));
            }
        }
        cb(null, true);
    },
});