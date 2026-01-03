import type { Request } from "express";

import type { IPayload } from "@auth/interfaces/payload.interface";

export interface IRequest extends Request {
  user: IPayload;
}
