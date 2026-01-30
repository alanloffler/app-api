import { Injectable } from "@nestjs/common";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";
import { UpdatePatientProfileDto } from "@patient-profile/dto/update-patient-profile.dto";

@Injectable()
export class PatientProfileService {
  create(createPatientProfileDto: CreatePatientProfileDto) {
    return "This action adds a new patientProfile";
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
