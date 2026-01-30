import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PatientProfile } from "@patient-profile/entities/patient-profile.entity";
import { PatientProfileController } from "@patient-profile/patient-profile.controller";
import { PatientProfileService } from "@patient-profile/patient-profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile])],
  controllers: [PatientProfileController],
  providers: [PatientProfileService],
})
export class PatientProfileModule {}
