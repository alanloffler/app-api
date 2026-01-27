import { Injectable } from "@nestjs/common";

import { CreateMedicalHistoryDto } from "@medical-history/dto/create-medical-history.dto";
import { UpdateMedicalHistoryDto } from "@medical-history/dto/update-medical-history.dto";

@Injectable()
export class MedicalHistoryService {
  create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return "This action adds a new medicalHistory";
  }

  findAll() {
    return `This action returns all medicalHistory`;
  }

  findOne(id: string) {
    return `This action returns a #${id} medicalHistory`;
  }

  update(id: string, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return `This action updates a #${id} medicalHistory`;
  }

  remove(id: string) {
    return `This action removes a #${id} medicalHistory`;
  }
}
