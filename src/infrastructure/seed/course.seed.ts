import { Course } from "../../modules/course/course.model.js";
import { generateUniqueSlug } from "../../modules/course/course.slug.js";

export const seedCourses = async (categories: any[]) => {
    const catMap = Object.fromEntries(
        categories.map((cat) => [cat.name, cat._id])
    );

    const dummyCourses = [
        {
            title: "Full-Stack Web Development Bootcamp",
            desc: "Comprehensive guide to HTML, CSS, JavaScript, TypeScript, React, Express, and MongoDB.",
            thumbnail: {
                imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop",
                publicId: "seed_course_web_dev",
            },
            price: 199,
            discountPrice: 149,
            finalPrice: 149,
            category: catMap["web development"],
            instructor: "Jane Doe",
            level: "beginner",
            totalDuration: 40,
            status: "published",
            isRemoved: false,
        },
        {
            title: "Advanced React & Next.js Masterclass",
            desc: "Deep dive into React 19, Server Components, App Router, SSR, performance optimization, and state management.",
            thumbnail: {
                imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
                publicId: "seed_course_nextjs",
            },
            price: 149,
            discountPrice: 99,
            finalPrice: 99,
            category: catMap["web development"],
            instructor: "John Smith",
            level: "intermediate",
            totalDuration: 25,
            status: "published",
            isRemoved: false,
        },
        {
            title: "Flutter Mobile App Development",
            desc: "Build cross-platform iOS and Android apps using Dart and Flutter with state management using Bloc & Provider.",
            thumbnail: {
                imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
                publicId: "seed_course_flutter",
            },
            price: 179,
            discountPrice: 129,
            finalPrice: 129,
            category: catMap["mobile development"],
            instructor: "Alice Johnson",
            level: "beginner",
            totalDuration: 35,
            status: "published",
            isRemoved: false,
        },
        {
            title: "Python for Data Science and Machine Learning",
            desc: "Master NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow to build real-world AI predictive models.",
            thumbnail: {
                imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop",
                publicId: "seed_course_datascience",
            },
            price: 249,
            discountPrice: 199,
            finalPrice: 199,
            category: catMap["data science & ai"],
            instructor: "Bob Lee",
            level: "intermediate",
            totalDuration: 50,
            status: "published",
            isRemoved: false,
        },
        {
            title: "Ethical Hacking & Network Security Essentials",
            desc: "Hands-on penetration testing, vulnerability assessment, Wireshark packet analysis, and security auditing.",
            thumbnail: {
                imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop",
                publicId: "seed_course_cybersecurity",
            },
            price: 299,
            discountPrice: 249,
            finalPrice: 249,
            category: catMap["cybersecurity"],
            instructor: "Charlie Brown",
            level: "expert",
            totalDuration: 45,
            status: "published",
            isRemoved: false,
        },
    ];

    await Course.deleteMany();

    const coursesToInsert = await Promise.all(
        dummyCourses.map(async (courseData) => ({
            ...courseData,
            slug: await generateUniqueSlug(courseData.title),
        }))
    );

    const createdCourses = await Course.insertMany(coursesToInsert);
    console.log(`${createdCourses.length} courses seeded`);
    return createdCourses;
};
