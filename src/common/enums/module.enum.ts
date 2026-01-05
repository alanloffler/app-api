export const EModule = {
  APP: "app",
  DASHBOARD: "dashboard",
  NOTIFICATION: "notification",
} as const;

export type EModule = (typeof EModule)[keyof typeof EModule];
