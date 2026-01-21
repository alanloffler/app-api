import { PartialType } from "@nestjs/mapped-types";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";

export class UpdateProfessionalProfileDto extends PartialType(CreateProfessionalProfileDto) {}
