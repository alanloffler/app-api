export const ERole = {
  PATIENT: "patient",
  SUPERADMIN: "superadmin",
} as const;

export type ERole = (typeof ERole)[keyof typeof ERole];
