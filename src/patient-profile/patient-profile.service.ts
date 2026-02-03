import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

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
    const profile = manager.create(PatientProfile, {
      ...profileDto,
      userId,
      businessId,
    });

    return manager.save(profile);
  }

  findAll() {
    return `This action returns all patientProfile`;
  }

  findOne(id: string) {
    return `This action returns a #${id} patientProfile`;
  }

  update(id: string, updatePatientProfileDto: UpdatePatientProfileDto) {
    return `This action updates a #${id} patientProfile`;
  }

  remove(id: string) {
    return `This action removes a #${id} patientProfile`;
  }
}
