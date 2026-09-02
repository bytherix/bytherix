import { Permission } from "../../modules/permission/permission.model.js";

const permissions = [
  // USER
  { name: "user.create", group: "user" },
  { name: "user.read", group: "user" },
  { name: "user.update", group: "user" },
  { name: "user.delete", group: "user" },

  // ROLE
  { name: "role.create", group: "role" },
  { name: "role.read", group: "role" },
  { name: "role.update", group: "role" },
  { name: "role.delete", group: "role" },
  { name: "role.manage", group: "role" },

  // PERMISSION
  { name: "permission.create", group: "permission" },
  { name: "permission.read", group: "permission" },
  { name: "permission.update", group: "permission" },
  { name: "permission.delete", group: "permission" },

  // SERVICE
  { name: "service.create", group: "service" },
  { name: "service.read", group: "service" },
  { name: "service.update", group: "service" },
  { name: "service.delete", group: "service" },

  // CATEGORY
  { name: "category.create", group: "category" },
  { name: "category.update", group: "category" },
  { name: "category.delete", group: "category" },

  // COURSE
  { name: "course.create", group: "course" },
  { name: "course.read", group: "course" },
  { name: "course.update", group: "course" },
  { name: "course.delete", group: "course" },

  // ENROLLMENT
  { name: "enrollment.create", group: "enrollment" },
  { name: "enrollment.read", group: "enrollment" },
  { name: "enrollment.update", group: "enrollment" },
  { name: "enrollment.delete", group: "enrollment" },

  // PAYMENT
  { name: "payment.initiate", group: "payment" },
  { name: "payment.read", group: "payment" },
  { name: "payment.verify", group: "payment" },

  // CONTACT
  { name: "contact.read", group: "contact" },
  { name: "contact.update", group: "contact" },
  { name: "contact.delete", group: "contact" },

  // INSTRUCTOR
  { name: "admin", group: "instructor" },
  { name: "moderators", group: "instructor" },

  // ADMIN
  { name: "system.manage", group: "system" },
  // BLOG
  { name: "blog.create", group: "blog" },
  { name: "blog.read", group: "blog" },
  { name: "blog.update", group: "blog" },
  { name: "blog.delete", group: "blog" },
  { name: "blog.publish", group: "blog" },
];

export const seedPermissions = async () => {
  await Permission.deleteMany();

  const createdPermissions = await Permission.insertMany(permissions);

  console.log(`${createdPermissions.length} permissions seeded`);

  return createdPermissions;
};
