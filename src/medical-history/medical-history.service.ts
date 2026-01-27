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

  async create(
    businessId: string,
    createMedicalHistoryDto: CreateMedicalHistoryDto,
  ): Promise<ApiResponse<MedicalHistory>> {
    // TODO:
    // 1. Check userId existence
    // 2. Check eventId existence
    const createDto = { ...createMedicalHistoryDto, businessId };
    const history = this.medicalHistoryRepository.create(createDto);
    const saveHistory = await this.medicalHistoryRepository.save(history);
    if (!saveHistory) throw new HttpException("Error al crear el historial", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<MedicalHistory>("Historial creado", history);
  }

  findAll() {
    return `This action returns all medicalHistory`;
  }

  async findOne(businessId: string, id: string): Promise<ApiResponse<MedicalHistory>> {
    // TODO: check businessId???
    // TODO: user & event relation if needed
    const history = await this.medicalHistoryRepository.findOne({ where: { id, businessId } });
    if (!history) throw new HttpException("Historial no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<MedicalHistory>("Historial encontrado", history);
  }

  update(id: string, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return `This action updates a #${id} medicalHistory`;
  }

  remove(id: string) {
    return `This action removes a #${id} medicalHistory`;
  }
}
