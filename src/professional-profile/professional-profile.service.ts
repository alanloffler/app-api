import { EntityManager } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";

@Injectable()
export class ProfessionalProfileService {
  async create(
    profileDto: CreateProfessionalProfileDto,
    userId: string,
    businessId: string,
    manager: EntityManager,
  ): Promise<ProfessionalProfile> {
    const existingLicense = await manager.findOne(ProfessionalProfile, {
      where: { licenseId: profileDto.licenseId },
    });
    if (existingLicense) throw new HttpException("Matrícula ya registrada", HttpStatus.BAD_REQUEST);

    const profile = manager.create(ProfessionalProfile, {
      ...profileDto,
      userId,
      businessId,
    });

    return manager.save(profile);
  }
}
