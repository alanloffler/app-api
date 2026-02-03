import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateProfessionalUseCase } from "@users/create-professional.use-case";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { RestoreProfessionalUseCase } from "@users/restore-professional.use-case";
import { Role } from "@roles/entities/role.entity";
import { SoftRemoveProfessionalUserCase } from "@users/soft-remove-professional.use-case";
import { UpdateProfessionalUseCase } from "@users/update-professional.use-case";
import { User } from "@users/entities/user.entity";
import { UsersController } from "@users/users.controller";
import { UsersService } from "@users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [UsersController],
  providers: [
    CreateProfessionalUseCase,
    ProfessionalProfileService,
    RestoreProfessionalUseCase,
    SoftRemoveProfessionalUserCase,
    UpdateProfessionalUseCase,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
