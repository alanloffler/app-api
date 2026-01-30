import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";
import { PatientProfileService } from "@patient-profile/patient-profile.service";
import { UpdatePatientProfileDto } from "@patient-profile/dto/update-patient-profile.dto";

// TODO: auth decorators
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
