export interface IProfileDTO {
    bio?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    location?: {
        country?: string;
        city?: string;
    };
}