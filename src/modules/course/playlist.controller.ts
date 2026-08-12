import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { PlaylistService } from "./playlist.service.js";
import { AppError } from "../../shared/error/appError.js";

export class PlaylistController {

    // ADD PLAYLIST
    static addPlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId } = req.params;
        if (!courseId) {
            throw new AppError("Course ID is required", 400);
        }
        const data = await PlaylistService.addPlaylist(courseId.toString(), req.body, req.file);
        return res.status(201).json(data);
    });

    // UPDATE PLAYLIST
    static updatePlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId, playlistId } = req.params;
        if (!courseId || !playlistId) {
            throw new AppError("Course ID and Playlist ID are required", 400);
        }
        const data = await PlaylistService.updatePlaylist(courseId.toString(), playlistId.toString(), req.body, req.file);
        return res.status(200).json(data);
    });

    // DELETE PLAYLIST
    static deletePlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId, playlistId } = req.params;
        if (!courseId || !playlistId) {
            throw new AppError("Course ID and Playlist ID are required", 400);
        }
        const data = await PlaylistService.deletePlaylist(courseId.toString(), playlistId.toString());
        return res.status(200).json(data);
    });

    // ADD VIDEO TO PLAYLIST
    static addVideoToPlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId, playlistId } = req.params;
        if (!courseId || !playlistId) {
            throw new AppError("Course ID and Playlist ID are required", 400);
        }
        const data = await PlaylistService.addVideoToPlaylist(courseId.toString(), playlistId.toString(), req.body);
        return res.status(201).json(data);
    });

    // UPDATE VIDEO IN PLAYLIST
    static updateVideoInPlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId, playlistId, videoId } = req.params;
        if (!courseId || !playlistId || !videoId) {
            throw new AppError("Course ID, Playlist ID and Video ID are required", 400);
        }
        const data = await PlaylistService.updateVideoInPlaylist(courseId.toString(), playlistId.toString(), videoId.toString(), req.body);
        return res.status(200).json(data);
    });

    // DELETE VIDEO FROM PLAYLIST
    static deleteVideoFromPlaylist = catchAsync(async (req: Request, res: Response) => {
        const { courseId, playlistId, videoId } = req.params;
        if (!courseId || !playlistId || !videoId) {
            throw new AppError("Course ID, Playlist ID and Video ID are required", 400);
        }
        const data = await PlaylistService.deleteVideoFromPlaylist(courseId.toString(), playlistId.toString(), videoId.toString());
        return res.status(200).json(data);
    });
}
