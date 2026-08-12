export interface RegisterDTO {
    fullName?: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}