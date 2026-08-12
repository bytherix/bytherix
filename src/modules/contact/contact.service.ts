import { AppError } from "../../shared/error/appError.js";
import { getPagination, type PaginationQuery } from "../../shared/helper/pagination.js";
import type { CreateContactDTO } from "./contact.dto.js";
import { Contact, CONTACT_STATUSES, type ContactStatus, type IContact } from "./contact.model.js";

export class ContactService {

    //CREATES AND SAVE NEW REQUEST
    static async sendRequest(data: CreateContactDTO): Promise<IContact> {
        const {
            name,
            email,
            phone,
            company,
            inquiryType,
            interest,
            subject,
            message,
            preferredContact,
        } = data;

        if (!name || !email || !phone || !subject || !message) {
            throw new AppError("Please fill in all mandatory fields.", 400);
        }

        const newRequest = await Contact.create({
            name,
            email,
            phone,
            company,
            inquiryType,
            interest,
            subject,
            message,
            preferredContact,
        });

        return newRequest;
    };


    static async fetchAllRequests(query: PaginationQuery) {
        const { page = 1, limit = 10, skip } = getPagination(query);

        const [contacts, total] = await Promise.all([
            Contact.find()
                .sort({ isRead: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Contact.countDocuments(),
        ]);

        const totalPages = Math.ceil(total / limit);

        const formattedContacts = contacts.map((item) => ({
            id: item._id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            company: item.company,
            inquiryType: item.inquiryType,
            interest: item.interest,
            subject: item.subject,
            message: item.message,
            preferredContact: item.preferredContact,
            status: item.status,
            isRead: item.isRead,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return {
            data: formattedContacts,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages,
                hasNextPage: Number(page) < totalPages,
            },
        };
    }


    //FETCH BY ID (ADMINS & MODS)
    static async fetchById(id: string) {

        const contact = await Contact.findById(id);

        if (!contact) {
            throw new AppError("Not found", 404);
        }

        return contact;
    }


    //UPDATE STATUS
    static async updateStatus(id: string, newStatus: ContactStatus) {
        if (!CONTACT_STATUSES.includes(newStatus)) {
            throw new AppError("Invalid status value provided", 400);
        }

        const contact = await Contact.findByIdAndUpdate(id, { status: newStatus, isRead: true }, { new: true, runValidators: true });

        if (!contact) {
            throw new AppError("Contact request not found", 404);
        }

        return contact;
    };


    //DELETE
    static async removeMessage(id: string) {

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            throw new AppError("Contact not found", 404);
        }

        return contact;
    }
}