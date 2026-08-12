import slugify from "slugify";
import { Course } from "./course.model.js";

export async function generateUniqueSlug(title: string) {
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await Course.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}