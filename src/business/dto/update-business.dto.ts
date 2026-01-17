import { PartialType } from "@nestjs/mapped-types";

import { CreateBusinessDto } from "@business/dto/create-business.dto";

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
