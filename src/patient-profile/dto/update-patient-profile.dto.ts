import { PartialType } from "@nestjs/mapped-types";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";

export class UpdatePatientProfileDto extends PartialType(CreatePatientProfileDto) {}
