import bcrypt from "bcrypt";
import { User } from "../../modules/user/user.model.js";

export const seedUsers = async (roles: any[]) => {
    const roleMap = Object.fromEntries(
        roles.map(role => [role.name, role._id])
    );

    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = [
        {
            fullName: "Super Admin User",
            email: "test@superadmin.com",
            password: hashedPassword,
            phone: "+1234567890",
            roleId: roleMap["super_admin"],
            isVerified: true,
            provider: "local",
        },
        {
            fullName: "Admin User",
            email: "test@admin.com",
            password: hashedPassword,
            phone: "+1234567891",
            roleId: roleMap["admin"],
            isVerified: true,
            provider: "local",
        },
        {
            fullName: "Moderator User",
            email: "test@moderator.com",
            password: hashedPassword,
            phone: "+1234567892",
            roleId: roleMap["staff"],
            isVerified: true,
            provider: "local",
        },
        {
            fullName: "Moderator User Alt",
            email: "tes@moderator.com",
            password: hashedPassword,
            phone: "+1234567893",
            roleId: roleMap["staff"],
            isVerified: true,
            provider: "local",
        },
        {
            fullName: "Normal Test User",
            email: "test@user.com",
            password: hashedPassword,
            phone: "+1234567894",
            roleId: roleMap["user"],
            isVerified: true,
            provider: "local",
        },
    ];

    await User.deleteMany();
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} test users seeded`);
    return createdUsers;
};
