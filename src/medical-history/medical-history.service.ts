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

  // Find all medical histories for business
  async findAll(businessId: string): Promise<ApiResponse<MedicalHistory[]>> {
    // TODO: check businessId???
    // TODO: user & event relation if needed
    const histories = await this.medicalHistoryRepository.find({ where: { businessId } });
    if (!histories) throw new HttpException("Error al obtener los historiales", HttpStatus.NOT_FOUND);

    return ApiResponse.success<MedicalHistory[]>("Historiales encontrados", histories);
  }

  // Find all medical histories for business and patient
  async findAllByPatient(businessId: string, userId: string): Promise<ApiResponse<MedicalHistory[]>> {
    // TODO: check businessId & userId???
    // TODO: user & event relation if needed
    const histories = await this.medicalHistoryRepository.find({ where: { businessId, userId } });
    if (!histories) throw new HttpException("Error al obtener los historiales", HttpStatus.NOT_FOUND);

    return ApiResponse.success<MedicalHistory[]>("Historiales encontrados", histories);
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
