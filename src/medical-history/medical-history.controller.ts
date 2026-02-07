import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from "@nestjs/common";

import { BusinessId } from "@common/decorators/business-id.decorator";
import { CreateMedicalHistoryDto } from "@medical-history/dto/create-medical-history.dto";
import { MedicalHistoryService } from "@medical-history/medical-history.service";
import { UpdateMedicalHistoryDto } from "@medical-history/dto/update-medical-history.dto";

// TODO: auth & permissions
@Controller("medical-history")
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Post()
  create(@BusinessId(ParseUUIDPipe) businessId: string, @Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoryService.create(businessId, createMedicalHistoryDto);
  }

  @Get()
  findAll(@BusinessId(ParseUUIDPipe) businessId: string) {
    return this.medicalHistoryService.findAll(businessId);
  }

  @Get(":id/patient")
  findAllByPatient(@BusinessId(ParseUUIDPipe) businessId: string, @Param("id") id: string) {
    return this.medicalHistoryService.findAllByPatient(businessId, id);
  }

  @Get(":id")
  findOne(@BusinessId(ParseUUIDPipe) businessId: string, @Param("id") id: string) {
    return this.medicalHistoryService.findOne(businessId, id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return this.medicalHistoryService.update(id, updateMedicalHistoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.medicalHistoryService.remove(id);
  }
}
