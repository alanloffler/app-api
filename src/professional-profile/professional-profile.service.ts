import { EntityManager } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { ProfessionalProfile } from "@professional-profile/entities/professional-profile.entity";
import { UpdateProfessionalProfileDto } from "@professional-profile/dto/update-professional-profile.dto";

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

  async update(userId: string, profileDto: UpdateProfessionalProfileDto, manager: EntityManager) {
    const profile = await manager.findOne(ProfessionalProfile, { where: { userId } });
    if (!profile) throw new HttpException("Perfil profesional no encontrado", HttpStatus.NOT_FOUND);

    if (profileDto.licenseId !== undefined) profile.licenseId = profileDto.licenseId;
    if (profileDto.professionalPrefix !== undefined) profile.professionalPrefix = profileDto.professionalPrefix;
    if (profileDto.specialty !== undefined) profile.specialty = profileDto.specialty;
    if (profileDto.workingDays !== undefined) profile.workingDays = profileDto.workingDays;

    return manager.save(profile);
  }
}
