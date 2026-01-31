import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";
import { Role } from "@roles/entities/role.entity";
import { User } from "@users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile, Role, User])],
  providers: [ProfessionalProfileService],
  exports: [ProfessionalProfileService],
})
export class ProfessionalProfileModule {}
