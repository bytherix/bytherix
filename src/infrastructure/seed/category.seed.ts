import { Category } from "../../modules/category/category.model.js";

const categories = [
    {
        name: "web development",
        desc: "Learn modern full-stack web development, frontend frameworks, backend Node.js, and database design.",
    },
    {
        name: "mobile development",
        desc: "Build cross-platform and native mobile applications using Flutter, React Native, and Swift.",
    },
    {
        name: "data science & ai",
        desc: "Master Python data analysis, machine learning algorithms, deep learning, and AI model deployment.",
    },
    {
        name: "cybersecurity",
        desc: "Understand ethical hacking, penetration testing, network security fundamentals, and security auditing.",
    },
    {
        name: "ui/ux design",
        desc: "Design beautiful user interfaces, create interactive wireframes, and conduct user research with Figma.",
    },
];

export const seedCategories = async () => {
    await Category.deleteMany();
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories seeded`);
    return createdCategories;
};
