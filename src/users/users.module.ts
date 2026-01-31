import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateProfessionalUseCase } from "@users/create-professional.use-case";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { Role } from "@roles/entities/role.entity";
import { User } from "@users/entities/user.entity";
import { UsersController } from "@users/users.controller";
import { UsersService } from "@users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [UsersController],
  providers: [CreateProfessionalUseCase, ProfessionalProfileService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
