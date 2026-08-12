import "dotenv/config";

import { connectDb } from "../infrastructure/connectDb.js";
import { seedPermissions } from "../infrastructure/seed/permission.seed.js";
import { seedRoles } from "../infrastructure/seed/role.seed.js";
import { seedCategories } from "../infrastructure/seed/category.seed.js";
import { seedUsers } from "../infrastructure/seed/user.seed.js";
import { seedUserProfiles } from "../infrastructure/seed/userProfile.seed.js";
import { seedInstructors } from "../infrastructure/seed/instructor.seed.js";
import { seedCourses } from "../infrastructure/seed/course.seed.js";
import { seedEnrollments } from "../infrastructure/seed/enrollment.seed.js";
import { seedContacts } from "../infrastructure/seed/contact.seed.js";


const seedData = async () => {
    try {
        await connectDb();

        console.log("Starting database seeding...");

        const permissions = await seedPermissions();

        const roles = await seedRoles(permissions);

        const categories = await seedCategories();

        const users = await seedUsers(roles);

        await seedUserProfiles(users);

        await seedInstructors(users);

        const courses = await seedCourses(categories);

        await seedEnrollments(users, courses);

        await seedContacts();

        console.log("Database seeded successfully");

        process.exit(0);

    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exit(1);
    }
};

seedData();