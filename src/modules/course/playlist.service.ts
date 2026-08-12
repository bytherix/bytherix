import { AppError } from "../../shared/error/appError.js";
import { deleteImage, uploadImage } from "../../shared/helper/fileHandler.js";
import { Course, type IPlaylist, type IVideo } from "./course.model.js";

export class PlaylistService {

    // RECALCULATE DURATION
    static async recalculateDuration(courseId: string) {
        const course = await Course.findById(courseId);
        if (!course) return;
        let total = 0;
        for (const playlist of course.playlists || []) {
            for (const video of playlist.videos || []) {
                total += video.duration || 0;
            }
        }
        course.totalDuration = total;
        await course.save();
    }

    // PLAYLIST CRUD
    static async addPlaylist(courseId: string, data: Partial<IPlaylist>, file: any) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        if (!data.title || data.order === undefined || !file) {
            throw new AppError("Please fill all required playlist fields", 400);
        }
        const upload = await uploadImage(file.path);
        const thumbnail = { imageUrl: upload.secure_url, publicId: upload.public_id };

        course.playlists.push({
            title: data.title,
            desc: data.desc,
            thumbnail,
            order: Number(data.order),
            videos: []
        } as any);

        await course.save();
        return {
            success: true,
            message: "Playlist added successfully",
            data: course.playlists
        };
    }

    static async updatePlaylist(courseId: string, playlistId: string, data: Partial<IPlaylist>, file: any) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const playlist = course.playlists.find(p => (p as any)._id.toString() === playlistId);
        if (!playlist) {
            throw new AppError("Playlist not found", 404);
        }
        if (data.title !== undefined) playlist.title = data.title;
        if (data.desc !== undefined) playlist.desc = data.desc;
        if (data.order !== undefined) playlist.order = Number(data.order);

        let oldPublicId: string | undefined;
        if (file) {
            const upload = await uploadImage(file.path);
            oldPublicId = playlist.thumbnail?.publicId;
            playlist.thumbnail = { imageUrl: upload.secure_url, publicId: upload.public_id };
        }
        await course.save();
        if (oldPublicId) {
            await deleteImage(oldPublicId).catch(err => console.error("Cloudinary delete failed:", err));
        }
        return {
            success: true,
            message: "Playlist updated successfully",
            data: course.playlists
        };
    }

    static async deletePlaylist(courseId: string, playlistId: string) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const playlistIndex = course.playlists.findIndex(p => (p as any)._id.toString() === playlistId);
        if (playlistIndex === -1) {
            throw new AppError("Playlist not found", 404);
        }
        const playlist = course.playlists[playlistIndex];
        if (!playlist) {
            throw new AppError("Playlist not found", 404);
        }
        const publicId = playlist.thumbnail?.publicId;

        course.playlists.splice(playlistIndex, 1);
        await course.save();

        if (publicId) {
            await deleteImage(publicId).catch(err => console.error("Cloudinary delete failed:", err));
        }
        await this.recalculateDuration(courseId);
        return {
            success: true,
            message: "Playlist deleted successfully",
            data: course.playlists
        };
    }

    // VIDEO CRUD
    static async addVideoToPlaylist(courseId: string, playlistId: string, data: Partial<IVideo>) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const playlist = course.playlists.find(p => (p as any)._id.toString() === playlistId);
        if (!playlist) {
            throw new AppError("Playlist not found", 404);
        }
        if (!data.title || !data.videoUrl || !data.publicId || data.duration === undefined || data.order === undefined) {
            throw new AppError("Please fill all required video fields", 400);
        }
        playlist.videos.push({
            title: data.title,
            desc: data.desc,
            videoUrl: data.videoUrl,
            publicId: data.publicId,
            duration: Number(data.duration),
            order: Number(data.order)
        } as any);

        await course.save();
        await this.recalculateDuration(courseId);
        return {
            success: true,
            message: "Video added to playlist successfully",
            data: playlist
        };
    }

    static async updateVideoInPlaylist(courseId: string, playlistId: string, videoId: string, data: Partial<IVideo>) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const playlist = course.playlists.find(p => (p as any)._id.toString() === playlistId);
        if (!playlist) {
            throw new AppError("Playlist not found", 404);
        }
        const video = playlist.videos.find(v => (v as any)._id.toString() === videoId);
        if (!video) {
            throw new AppError("Video not found", 404);
        }
        if (data.title !== undefined) video.title = data.title;
        if (data.desc !== undefined) video.desc = data.desc;
        if (data.videoUrl !== undefined) video.videoUrl = data.videoUrl;
        if (data.publicId !== undefined) video.publicId = data.publicId;
        if (data.duration !== undefined) video.duration = Number(data.duration);
        if (data.order !== undefined) video.order = Number(data.order);

        await course.save();
        await this.recalculateDuration(courseId);
        return {
            success: true,
            message: "Video updated successfully",
            data: playlist
        };
    }

    static async deleteVideoFromPlaylist(courseId: string, playlistId: string, videoId: string) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const playlist = course.playlists.find(p => (p as any)._id.toString() === playlistId);
        if (!playlist) {
            throw new AppError("Playlist not found", 404);
        }
        const videoIndex = playlist.videos.findIndex(v => (v as any)._id.toString() === videoId);
        if (videoIndex === -1) {
            throw new AppError("Video not found", 404);
        }
        playlist.videos.splice(videoIndex, 1);
        await course.save();
        await this.recalculateDuration(courseId);
        return {
            success: true,
            message: "Video deleted successfully",
            data: playlist
        };
    }
}
