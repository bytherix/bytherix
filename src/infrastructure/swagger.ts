import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { ENV } from "./env.js";

const router = Router();

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.3",

        info: {
            title: "Bytherix API",
            version: "1.0.0",
            description: "Official REST API documentation for the Bytherix platform.",
        },

        servers: [
            {
                url: ENV.BACKEND_URL,
                description: "API Server",
            },
        ],

        tags: [
            {
                name: "Authentication",
                description: "Authentication endpoints.",
            },
            {
                name: "Users",
                description: "User management.",
            },
            {
                name: "Roles",
                description: "Role management.",
            },
            {
                name: "Permissions",
                description: "Permission management.",
            },
            {
                name: "Courses",
                description: "Course management.",
            },
            {
                name: "Contact",
                description: "Contact form request management.",
            },
            {
                name: "Instructor",
                description: "Instructor profile management.",
            },
            {
                name: "Enrollments",
                description: "Course enrollment and progress tracking.",
            },
            {
                name: "Payment",
                description: "Payment processing and management.",
            }
        ],

        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT access token.",
                },

                ApiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",
                    description: "API key.",
                },
            },

            schemas: {},
        },

        security: [
            {
                BearerAuth: [],
            },
        ],
    },

    apis: [
        "./src/modules/**/openapi/*.yaml",
    ],
});

router.get("/json", (_, res) => {
    res.json(swaggerSpec);
});

router.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: "Bytherix API Documentation",
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: "list",
            filter: true,
        },
    }),
);

export default router;