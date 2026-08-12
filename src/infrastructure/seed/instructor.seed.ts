import { Instructor, type IExpertise } from "../../modules/instructor/instructor.model.js";

export const seedInstructors = async (users: any[]) => {
    // Find a normal user to make them an instructor
    const normalUser = users.find(user => user.email === "test@user.com");

    if (!normalUser) {
        console.log("Normal test user not found, skipping instructor seeding.");
        return;
    }

    const dummyInstructor = {
        userId: normalUser._id,
        profileImage: {
            imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
            publicId: "seed_instructor_profile",
        },
        headline: "Lead Software Architect & Educator",
        bio: "Over 8 years of industry experience working with startup and enterprise web technologies.",
        expertise: ["Web Development", "App Development", "Programming"] as IExpertise[],
        languages: ["English", "Spanish"],
        yearsOfExperience: 8,
        education: [
            {
                degree: "Master of Science in Software Engineering",
                institute: "MIT",
                year: 2018,
            }
        ],
        website: "https://instructor-test.example.com",
        github: "https://github.com/test-instructor",
        linkedin: "https://linkedin.com/in/test-instructor",
        isVerified: true,
    };

    await Instructor.deleteMany();
    const createdInstructor = await Instructor.create(dummyInstructor);
    console.log("Instructor profile seeded successfully");
    return createdInstructor;
};
