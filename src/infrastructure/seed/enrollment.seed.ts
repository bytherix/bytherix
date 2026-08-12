import { Enrollment } from "../../modules/enrollment/enrollment.model.js";

export const seedEnrollments = async (users: any[], courses: any[]) => {
    const normalUser = users.find(user => user.email === "test@user.com");
    const moderatorUser = users.find(user => user.email === "test@moderator.com");

    if (!normalUser || courses.length === 0) {
        console.log("No test users or courses found, skipping enrollment seeding.");
        return;
    }

    const enrollments = [
        {
            user: normalUser._id,
            course: courses[0]._id,
            status: "active",
            progress: 25,
            completedVideoIds: [],
            enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            user: normalUser._id,
            course: courses[1]._id,
            status: "completed",
            progress: 100,
            completedVideoIds: [],
            enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
    ];

    if (moderatorUser) {
        enrollments.push({
            user: moderatorUser._id,
            course: courses[2]._id,
            status: "active",
            progress: 10,
            completedVideoIds: [],
            enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            lastAccessedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        });
    }

    await Enrollment.deleteMany();
    const createdEnrollments = await Enrollment.insertMany(enrollments);
    console.log(`${createdEnrollments.length} enrollments seeded`);
    return createdEnrollments;
};
