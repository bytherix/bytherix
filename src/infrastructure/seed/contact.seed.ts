import { Contact } from "../../modules/contact/contact.model.js";

const dummyContacts = [
    {
        name: "John Contact",
        email: "john.contact@example.com",
        phone: "+1987654321",
        company: "Acme Innovations",
        inquiryType: "service",
        interest: ["web-development", "ui-ux"],
        subject: "Need custom web application development",
        message: "Hello, our company is looking for a team to build a scalable e-commerce SaaS web app.",
        preferredContact: "email",
        status: "new",
        isRead: false,
    },
    {
        name: "Sarah Jenkins",
        email: "sarah@techpartners.com",
        phone: "+1122334455",
        company: "Tech Partners Inc.",
        inquiryType: "partnership",
        interest: ["app-development"],
        subject: "Strategic Partnership Inquiry",
        message: "We would like to explore a partnership regarding mobile course distribution across Asia.",
        preferredContact: "email",
        status: "contacted",
        isRead: true,
    },
    {
        name: "Michael Scott",
        email: "m.scott@dundermifflin.com",
        phone: "+1555666777",
        company: "Dunder Mifflin Paper Co.",
        inquiryType: "course",
        interest: ["digital-marketing"],
        subject: "Corporate Group Training Inquiry",
        message: "Interested in purchasing corporate bulk course licenses for our regional sales team.",
        preferredContact: "phone",
        status: "closed",
        isRead: true,
    },
];

export const seedContacts = async () => {
    await Contact.deleteMany();
    const createdContacts = await Contact.insertMany(dummyContacts);
    console.log(`${createdContacts.length} contact form requests seeded`);
    return createdContacts;
};
