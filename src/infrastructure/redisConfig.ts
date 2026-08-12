import { createClient } from "redis";
import { ENV } from "./env.js";

const client = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD,
    socket: {
        host: ENV.REDIS_HOST,
        port: Number(ENV.REDIS_PORT),
    },
});

client.on("error", (err: Error) => {
    console.error("Redis connection error encountered:", err.message);
});

export const connectRedis = async (): Promise<void> => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log("Redis client successfully connected.");
        }
    } catch (err) {
        console.error("Failed to establish Redis connection:", err);
        process.exit(1);
    }
};

export default client;