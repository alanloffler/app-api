import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateMedicalHistoryDto } from "@medical-history/dto/create-medical-history.dto";
import { MedicalHistory } from "@medical-history/entities/medical-history.entity";
import { UpdateMedicalHistoryDto } from "@medical-history/dto/update-medical-history.dto";

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory) private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}

  async create(createMedicalHistoryDto: CreateMedicalHistoryDto): Promise<ApiResponse<MedicalHistory>> {
    // TODO:
    // 1. Check userId existence
    // 2. Check eventId existence
    const history = this.medicalHistoryRepository.create(createMedicalHistoryDto);
    const saveHistory = await this.medicalHistoryRepository.save(history);
    if (!saveHistory) throw new HttpException("Error al crear el historial", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<MedicalHistory>("Historial creado", history);
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
