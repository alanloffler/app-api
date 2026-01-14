import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY: string = "permissions";

export const RequiredPermissions = (permissions: string | string[], mode: "some" | "every" = "every") => {
  const perms = Array.isArray(permissions) ? permissions : [permissions];
  return SetMetadata(PERMISSIONS_KEY, { permissions: perms, mode });
};
