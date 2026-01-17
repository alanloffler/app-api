export interface IPayload {
  businessId: string;
  email: string;
  exp?: number;
  iat?: number;
  id: string;
  role: string;
  roleId: string;
  type?: string;
}
