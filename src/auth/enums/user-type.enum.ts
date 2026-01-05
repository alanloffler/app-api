export const EUserType = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type EUserType = (typeof EUserType)[keyof typeof EUserType];
