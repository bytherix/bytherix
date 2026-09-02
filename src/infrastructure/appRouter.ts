import { Router } from "express";

import permissionRoute from "../modules/permission/permission.route.js";
import roleRoute from "../modules/role/role.route.js";
import authRoute from "../modules/auth/auth.route.js";
import swaggerRouter from "./swagger.js";
import categoryRoute from "../modules/category/category.route.js";
import courseRoute from "../modules/course/course.route.js";
import contactRoute from "../modules/contact/contact.route.js";
import userRoute from "../modules/user/user.route.js";
import instructorRoute from "../modules/instructor/instructor.route.js";
import userProfileRoute from "../modules/user-profile/userProfile.route.js";
import enrollmentRoute from "../modules/enrollment/enrollment.route.js";
import paymentRoute from "../modules/payment/payment.route.js";
import blogRoute from "../modules/blog/blog.routes.js";


const appRouter = Router();

appRouter.use("/api-docs", swaggerRouter);
appRouter.use("/permissions", permissionRoute);
appRouter.use("/roles", roleRoute);
appRouter.use("/auth", authRoute);
appRouter.use("/categories", categoryRoute);
appRouter.use("/courses", courseRoute);
appRouter.use("/contacts", contactRoute);
appRouter.use("/users", userRoute);
appRouter.use("/instructors", instructorRoute);
appRouter.use("/user-profiles", userProfileRoute);
appRouter.use("/enrollments", enrollmentRoute);
appRouter.use("/payments", paymentRoute);
appRouter.use("/blogs", blogRoute);

export default appRouter;