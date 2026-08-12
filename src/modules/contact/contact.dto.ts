import type { IContact } from "./contact.model.js";

export interface CreateContactDTO {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    preferredContact?: IContact["preferredContact"];
    inquiryType?: IContact["inquiryType"];
    company?: string;
    interest?: IContact["interest"];
}