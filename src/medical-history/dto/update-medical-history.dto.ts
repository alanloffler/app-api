import { PartialType } from "@nestjs/mapped-types";

import { CreateMedicalHistoryDto } from "@medical-history/dto/create-medical-history.dto";

export class UpdateMedicalHistoryDto extends PartialType(CreateMedicalHistoryDto) {}
