import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PatientProfile } from "@patient-profile/entities/patient-profile.entity";
import { PatientProfileService } from "@patient-profile/patient-profile.service";
import { Role } from "@roles/entities/role.entity";
import { User } from "@users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile, Role, User])],
  providers: [PatientProfileService],
})
export class PatientProfileModule {}
