import type { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import type { IPayload } from "@auth/interfaces/payload.interface";
import { Admin } from "@admin/entities/admin.entity";
import { AdminService } from "@admin/admin.service";
import { ApiResponse } from "@common/helpers/api-response.helper";
import { EAuthType } from "@auth/enums/auth-type.enum";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) throw new Error("JWT_SECRET no está definido");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: IPayload) {
    let user: ApiResponse<Admin | User> | null = null;

    if (payload.type === EAuthType.USER) {
      user = await this.usersService.findOne(payload.id, payload.businessId);
      if (!user) throw new HttpException("Usuario no encontrado", HttpStatus.UNAUTHORIZED);
    } else if (payload.type === EAuthType.ADMIN) {
      user = await this.adminService.findOne(payload.id);
      if (!user) throw new HttpException("Admin no encontrado", HttpStatus.UNAUTHORIZED);
    } else {
      throw new HttpException("Tipo de usuario inválido", HttpStatus.UNAUTHORIZED);
    }

    return {
      businessId: (user.data as User)?.businessId,
      id: user.data?.id,
      email: user.data?.email,
      role: user.data?.role.value,
      roleId: user.data?.role.id,
      type: payload.type,
    };
  }
}
