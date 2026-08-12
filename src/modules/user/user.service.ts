import bcrypt from "bcrypt";
import type { PipelineStage } from "mongoose";
import { AppError } from "../../shared/error/appError.js";
import { getPagination, getPaginationMeta } from "../../shared/helper/pagination.js";
import { RoleService } from "../role/role.service.js";
import { User, type IUser } from "./user.model.js";

export class UserService {

    //CREATE
    static async createUser(data: Partial<IUser>) {
        if (!data.email || !data.password || !data.phone) {
            throw new AppError("Please fill all the required fields", 400);
        }

        const email = data.email.toLowerCase().trim();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new AppError("Email already registered", 409);
        }

        if (data.password.length < 6) {
            throw new AppError("Password must be at least six characters long", 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const defaultRole = await RoleService.getRoleName("user");

        return User.create({
            fullName: data.fullName?.trim(), email, password: hashedPassword, phone: data.phone, roleId: defaultRole._id,
        });
    }


    //FIND EMAIL
    static async findByEmail(email: string) {
        const user = await User.findOne({ email: email.toLowerCase().trim() }).populate("roleId").select("+password");
        if (!user) {
            return null;
        };

        return {
            id: user._id, fullName: user.fullName, email: user.email, password: user.password, isVerified: user.isVerified, role: user.roleId, verificationSentAt: user.verificationSentAt
        }
    }


    //GET-BY-ID
    static async getUserId(id: string) {
        const user = await User.findById(id);

        if (!user)
            throw new AppError("User not found", 404);

        return user;
    }


    //UPDATE VERIFICATION SENT
    static async updateVerificationSentAt(userId: string) {
        return User.findByIdAndUpdate(userId, { verificationSentAt: new Date() }, { new: true });
    }


    // FIND OR CREATE GOOGLE USER
    static async findOrCreateGoogleUser(data: { email: string; fullName: string }) {
        const email = data.email.toLowerCase().trim();

        let user = await User.findOne({ email });

        if (user) {
            if (user.provider !== "google") {
                user.provider = "google";
                await user.save();
            }

            await user.populate("roleId");

            return user;
        }

        const defaultRole = await RoleService.getRoleName("user");

        user = await User.create({
            fullName: data.fullName,
            email,
            roleId: defaultRole._id,
            isVerified: true,
            provider: "google",
        });

        await user.populate("roleId");

        return user;
    }



    //FETCH USERS PROFILE (ADMINS)
    static async fetchAllUsers(query: { page?: number | string; limit?: number | string }) {
        const { page, limit, skip } = getPagination(query);

        const [users, total] = await Promise.all([
            User.find({ isVerified: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(),
        ]);

        return {
            data: users,
            pagination: getPaginationMeta({
                total, page, limit
            })
        }
    };


    //FETCH MODS AND ADMINS (ONLY ADMINS)
    static async fetchFilteredUsers(query: { page?: number | string; limit?: number | string }) {
        const { page, skip, limit } = getPagination(query);

        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "role",
                },
            },
            {
                $unwind: "$role",
            },
            {
                $addFields: {
                    rolePriority: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ["$role.name", "admin"] },
                                    then: 0,
                                },
                                {
                                    case: { $eq: ["$role.name", "moderator"] },
                                    then: 1,
                                },
                            ],
                            default: 2,
                        },
                    },
                },
            },
            {
                $sort: {
                    rolePriority: 1,
                    fullName: 1,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                rolePriority: 0,
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "count" },
                    ],
                },
            },
        ];

        const result = await User.aggregate(pipeline);

        const users = result[0]?.data ?? [];
        const total = result[0]?.totalCount[0]?.count ?? 0;

        return {
            data: users,
            pagination: getPaginationMeta({
                total,
                page,
                limit,
            }),
        };
    }


    //UPDATE USERS ROLE(ADMINS)
    static async updateUserRole(id: string, roleName: string) {
        const user = await User.findById(id).populate("roleId", "name");

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const findRole = await RoleService.getRoleName(roleName);

        const updateUser = await User.findByIdAndUpdate(id, { $set: { roleId: findRole._id } }, { new: true, runValidators: true }).populate("roleId", "name");

        return updateUser;
    }


    //FETCH USER BY ID
    static async fetchUserById(id: string) {
        const user = await User.findById(id).populate("roleId", "name");

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }

}
