import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { PatientProfileService } from "@patient-profile/patient-profile.service";
import { PermissionsGuard } from "@auth/guards/permissions.guard";
import { UpdatePatientProfileDto } from "@patient-profile/dto/update-patient-profile.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("patient-profile")
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @Post()
  create(@Body() createPatientProfileDto: CreatePatientProfileDto) {
    return this.patientProfileService.create(createPatientProfileDto);
  }

  @Get()
  findAll() {
    return this.patientProfileService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.patientProfileService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePatientProfileDto: UpdatePatientProfileDto) {
    return this.patientProfileService.update(id, updatePatientProfileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.patientProfileService.remove(id);
  }
}
