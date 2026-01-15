export const ERole = {
  SUPERADMIN: "superadmin",
} as const;

export type ERole = (typeof ERole)[keyof typeof ERole];
