export const ERole = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  TEACHER: "teacher",
} as const;

export type ERole = (typeof ERole)[keyof typeof ERole];
