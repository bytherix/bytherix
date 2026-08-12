import { UserProfile } from "../../modules/user-profile/userProfile.model.js";

export const seedUserProfiles = async (users: any[]) => {
    const profiles = users.map(user => {
        const isSuperAdmin = user.email === "test@superadmin.com";
        const isAdmin = user.email === "test@admin.com";
        const isInstructor = user.email === "test@user.com"; // In instructor.seed.ts, this user is the instructor

        return {
            userId: user._id,
            bio: isSuperAdmin 
                ? "I am the Super Administrator of this platform. Managing all settings and configurations."
                : isAdmin
                ? "Administrator overseeing courses, categories, and user management."
                : isInstructor
                ? "Passionate educator and lead software architect teaching development courses."
                : "A student registered on the platform eager to learn new skills.",
            website: "https://example.com",
            linkedin: "https://linkedin.com/in/testuser",
            github: "https://github.com/testuser",
            location: {
                country: "United States",
                city: "New York",
            },
            avatar: {
                imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
                publicId: `avatar_${user._id}`,
            }
        };
    });

    await UserProfile.deleteMany();
    const createdProfiles = await UserProfile.insertMany(profiles);
    console.log(`${createdProfiles.length} user profiles seeded`);
    return createdProfiles;
};
