import { EAuthType } from "@auth/enums/auth-type.enum";

export type EAuthType = (typeof EAuthType)[keyof typeof EAuthType];
