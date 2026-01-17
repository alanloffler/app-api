import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-local";

import type { IPayload } from "@auth/interfaces/payload.interface";
// import { Admin } from "@admin/entities/admin.entity";
// import { AdminService } from "@admin/admin.service";
import { EAuthType } from "@auth/enums/auth-type.enum";
import { User } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly adminService: AdminService,
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

    // TODO: remove logic when remove Admin entity!
    // IMPORTANT
    // let user: Admin | User | null = null;
    let user: User | null = null;

    if (type === EAuthType.USER) {
      user = await this.userService.findOneByEmail(email);
    }
    // else if (type === EAuthType.ADMIN) {
    // user = await this.adminService.findOneByEmail(email);
    // }
    else {
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
