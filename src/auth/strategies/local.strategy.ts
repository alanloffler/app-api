import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-local";

import type { IPayload } from "@auth/interfaces/payload.interface";
import { BusinessService } from "@business/business.service";
import { EAuthType } from "@auth/enums/auth-type.enum";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";
import { extractSlugFromOrigin } from "@auth/helpers/extractSlugFromOrigin";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userService: UsersService,
  ) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<IPayload> {
    const type = req.body.type;

    const slug = extractSlugFromOrigin(req.headers.origin);
    if (!slug) throw new HttpException("Tenant no identificado", HttpStatus.BAD_REQUEST);

    const business = await this.businessService.findBySlug(slug);
    if (!business) throw new HttpException("Tenant no encontrado", HttpStatus.BAD_REQUEST);

    let user: User | null = null;

    if (type === EAuthType.USER) {
      user = await this.userService.findOneByEmail(email, business.id);
    } else {
      throw new HttpException("Credenciales inválidas (type)", HttpStatus.UNAUTHORIZED);
    }

    if (!user) throw new HttpException("Credenciales inválidas", HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new HttpException("Credenciales inválidas", HttpStatus.UNAUTHORIZED);

    if (!user.role) throw new HttpException("El usuario posee un rol inactivo", HttpStatus.FORBIDDEN);

    return {
      businessId: user.businessId,
      id: user.id,
      email: user.email,
      role: user.role.value,
      roleId: user.role.id,
    };
  }
}
