import { Role } from "../../modules/role/role.model.js";

export const seedRoles = async (permissions: any[]) => {

    const permissionMap = Object.fromEntries(
        permissions.map(permission => [
            permission.name,
            permission._id
        ])
    );


    const roles = [
        {
            name: "super_admin",
            permissions: permissions.map(
                permission => permission._id
            ),
        },

        {
            name: "admin",
            permissions: [
                permissionMap["user.read"],
                permissionMap["user.update"],

                permissionMap["role.read"],
                permissionMap["role.update"],

                permissionMap["permission.read"],

                permissionMap["service.create"],
                permissionMap["service.read"],
                permissionMap["service.update"],
                permissionMap["service.delete"],

                permissionMap["category.create"],
                permissionMap["category.update"],
                permissionMap["category.delete"],

                permissionMap["course.create"],
                permissionMap["course.read"],
                permissionMap["course.update"],
                permissionMap["course.delete"],
                permissionMap["enrollment.create"],
                permissionMap["enrollment.read"],
                permissionMap["enrollment.update"],
                permissionMap["enrollment.delete"],
                permissionMap["payment.initiate"],
                permissionMap["payment.read"],
                permissionMap["payment.verify"],

                permissionMap["contact.read"],
                permissionMap["contact.update"],
                permissionMap["contact.delete"],

                permissionMap["admin"],
                permissionMap["moderators"],

                permissionMap["system.manage"],
            ],
        },

        {
            name: "staff",
            permissions: [
                permissionMap["user.read"],
                permissionMap["service.read"],
                permissionMap["service.update"],

                permissionMap["course.read"],
                permissionMap["course.update"],

                permissionMap["contact.read"],
                permissionMap["contact.update"],

                permissionMap["admin"],
                permissionMap["moderators"],
            ],
        },

        {
            name: "user",
            permissions: [
                permissionMap["user.read"],
            ],
        },
    ];


    await Role.deleteMany();


    const createdRoles = await Role.insertMany(roles);


    console.log(`${createdRoles.length} roles seeded`);

    return createdRoles;
};