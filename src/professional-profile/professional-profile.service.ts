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

  async update(
    userId: string,
    businessId: string,
    profileDto: UpdateProfessionalProfileDto,
    manager: EntityManager,
  ): Promise<void> {
    const profile = await manager.findOne(ProfessionalProfile, { where: { businessId, userId } });
    if (!profile) throw new HttpException("El profesional no tiene un perfil", HttpStatus.NOT_FOUND);

    if (profileDto.licenseId !== undefined) profile.licenseId = profileDto.licenseId;
    if (profileDto.professionalPrefix !== undefined) profile.professionalPrefix = profileDto.professionalPrefix;
    if (profileDto.specialty !== undefined) profile.specialty = profileDto.specialty;
    if (profileDto.workingDays !== undefined) profile.workingDays = profileDto.workingDays;

    try {
      await manager.save(profile);
    } catch {
      throw new HttpException("Error al actualizar el perfil profesional", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softRemove(userId: string, businessId: string, manager: EntityManager): Promise<void> {
    const profile = await manager.findOne(ProfessionalProfile, { where: { userId, businessId } });
    if (!profile) throw new HttpException("Perfil profesional no encontrado", HttpStatus.NOT_FOUND);

    try {
      await manager.softRemove(profile);
    } catch {
      throw new HttpException("Error al eliminar el perfil profesional", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(userId: string, businessId: string, manager: EntityManager): Promise<void> {
    const profile = await manager.findOne(ProfessionalProfile, { where: { userId, businessId } });
    if (!profile) throw new HttpException("Perfil profesional no encontrado", HttpStatus.NOT_FOUND);

    try {
      await manager.remove(profile);
    } catch {
      throw new HttpException("Error al eliminar el perfil profesional", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
