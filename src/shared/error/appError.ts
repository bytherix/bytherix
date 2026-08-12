export class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`;

        Error.captureStackTrace(this, this.constructor);
    }
}