import type { PaginationQuery } from "../../shared/helper/pagination.js";
import { CourseRepository } from "./course.repository.js";
import type { CreateCourseInput, UpdateCourseInput } from "./dto.js";


export class CourseService {

    //CREATE
    static async createCourse(data: CreateCourseInput, file: any) {
        return CourseRepository.create(data, file);
    }

    //UPDATE
    static async updateCourse(id: string, data: UpdateCourseInput, file: any) {
        return CourseRepository.update(id, data, file);
    }

    // TOGGLE COURSE REMOVE (SOFT DELETE)
    static async softDelete(id: string) {
        return CourseRepository.softDelete(id);
    }

    //HARD DELETE
    static async deleteCourse(id: string) {
        return CourseRepository.delete(id);
    }

    //FETCH BY SLUG (PUBLIC)
    static async fetchCourseFromPublicBySlug(slug: string) {
        return CourseRepository.fetchBySlugPublic(slug);
    }

    //FETCH BY ID OR SLUG (PUBLIC)
    static async fetchCourseFromPublicById(identifier: string) {
        return CourseRepository.fetchByIdOrSlugPublic(identifier);
    }

    //FETCH ALL (PUBLIC)
    static async fetchAllFromPublic(query: PaginationQuery) {
        return CourseRepository.fetchAllPublic(query);
    }

    //FETCH BY ID OR SLUG (MOD & ADMINS)
    static async fetchUnfilteredId(identifier: string) {
        return CourseRepository.fetchUnfilteredId(identifier);
    }

    //FETCH ALL UNFILTERED
    static async fetchAllUnfiltered(query: PaginationQuery) {
        return CourseRepository.fetchAllUnfiltered(query);
    }

}