import 'dotenv/config';

function getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
}

export const ENV = {
    PORT: Number(getEnv('PORT', '5000')),

    MONGO_URI: getEnv('MONGO_URI'),

    JWT_SECRET: getEnv('JWT_SECRET_KEY'),
    JWT_REFRESH: getEnv('JWT_REFRESH_KEY'),

    JWT_SECRET_TIMEOUT: getEnv('JWT_SECRET_TIMEOUT'),
    JWT_REFRESH_TIMEOUT: getEnv('JWT_REFRESH_TIMEOUT'),

    FRONTEND_URL: getEnv('FRONTEND_URL'),
    BACKEND_URL: getEnv('BACKEND_URL'),

    NODE_ENV: getEnv('NODE_ENV'),

    RESEND_API_KEY: getEnv('RESEND_API_KEY'),
    EMAIL_FROM: getEnv('EMAIL_FROM'),

    GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
    GOOGLE_SECRET_KEY: getEnv('GOOGLE_SECRET_KEY'),
    GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),

    CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),

    REDIS_USERNAME: getEnv('REDIS_USERNAME'),
    REDIS_PASSWORD: getEnv('REDIS_PASSWORD'),
    REDIS_HOST: getEnv('REDIS_HOST'),
    REDIS_PORT: getEnv('REDIS_PORT'),

    ESEWA_SECRET_KEY: getEnv('ESEWA_SECRET_KEY'),
    ESEWA_MERCHANT_ID: getEnv('ESEWA_MERCHANT_ID'),
    ESEWA_URL: getEnv('ESEWA__URL')
};