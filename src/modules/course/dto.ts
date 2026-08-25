export type CourseLevel = "beginner" | "intermediate" | "expert";
export type CourseStatus = "draft" | "pending" | "published" | "rejected";

export interface CreateCourseInput {
  title: string;
  desc: string;
  price: number;
  discountPrice: number;
  instructor: string;
  level: CourseLevel;
  totalDuration?: number;
  category: string;
  status?: CourseStatus;
  playlists?: any;
  isFree?: boolean;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> { }

export interface CourseOutput {
  id: string;
  title: string;
  desc: string;
  price: number;
  discountPrice: number;
  finalPrice: number;
  category: string;
  instructor: string;
  level: CourseLevel;
  totalDuration: number;
  playlists: any[];
  thumbnail: { imageUrl: string; publicId: string } | null;
  slug: string;
  status: CourseStatus;
  isRemoved: boolean;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}