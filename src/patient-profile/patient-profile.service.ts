import { EntityManager } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";
import { PatientProfile } from "@patient-profile/entities/patient-profile.entity";
import { UpdatePatientProfileDto } from "@patient-profile/dto/update-patient-profile.dto";

@Injectable()
export class PatientProfileService {
  async create(
    profileDto: CreatePatientProfileDto,
    userId: string,
    businessId: string,
    manager: EntityManager,
  ): Promise<PatientProfile> {
    const existingProfile = await manager.findOne(PatientProfile, { where: { businessId, userId } });
    if (existingProfile) throw new HttpException("El paciente ya tiene un perfil", HttpStatus.BAD_REQUEST);

    const profile = manager.create(PatientProfile, {
      ...profileDto,
      userId,
      businessId,
    });

    return manager.save(profile);
  }

  update(id: string, updatePatientProfileDto: UpdatePatientProfileDto) {
    return `This action updates a #${id} patientProfile`;
  }
}
