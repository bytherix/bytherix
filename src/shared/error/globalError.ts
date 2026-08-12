import type { ErrorRequestHandler } from "express";
import { AppError } from "./appError.js";

const globalError: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (!(err instanceof AppError) && statusCode === 500) {
        message = "Something went terribly wrong on our servers.";
    }

    return res.status(statusCode).json({
        success: false,
        message: message,
        error: err.message
    });
};

export default globalError;