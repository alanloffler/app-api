export const ESubmodule = {
  EMAIL: "email",
  MENU: "menu",
  THEME: "theme",
} as const;

export type ESubmodule = (typeof ESubmodule)[keyof typeof ESubmodule];
