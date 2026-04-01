export const Roles = {
  STUDENT: "student",
  ADMIN: "admin"
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];