import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { ProfessionalProfileController } from "@professional-profile/professional-profile.controller";
import { ProfessionalProfileService } from "@professional-profile/professional-profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile])],
  controllers: [ProfessionalProfileController],
  providers: [ProfessionalProfileService],
})
export class ProfessionalProfileModule {}
