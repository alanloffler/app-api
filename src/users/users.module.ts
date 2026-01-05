import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Role } from "@roles/entities/role.entity";
import { User } from "@users/entities/user.entity";
import { UsersController } from "@users/users.controller";
import { UsersService } from "@users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
