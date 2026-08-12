import "dotenv/config";
import express from "express";
import cors from "cors";

import { ENV } from "./infrastructure/env.js";
import { connectDb } from "./infrastructure/connectDb.js";
import globalError from "./shared/error/globalError.js";
import appRouter from "./infrastructure/appRouter.js";
import { apiLimiter } from "./infrastructure/apiLimiter.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./infrastructure/cloudinaryConfig.js";
import { connectRedis } from "./infrastructure/redisConfig.js";

const app = express();

//RATE LIMITER
app.use(apiLimiter);

app.use(express.json());
app.use(cookieParser());

//SECURITY HEADERS
app.use(helmet());

//CORS
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
    methods: ["POST", "PUT", "PATCH", "GET", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// ROUTES
app.use("/api/v1", appRouter);


// GLOBAL ERROR HANDLER
app.use(globalError);


//START SERVER
const startServer = async (): Promise<void> => {
    try {
        await connectDb();
        await connectRedis();
        cloudinaryConfig();

        app.listen(Number(ENV.PORT), "0.0.0.0", () => {
            console.log(`Server is running successfully on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server due to initialization error:", error);
        process.exit(1);
    }
};

startServer();