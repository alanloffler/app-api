import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { CreateUserDto } from "@users/dto/create-user.dto";

class UpdateUserDataDto extends PartialType(CreateUserDto) {}
class UpdateProfileDataDto extends PartialType(CreateProfessionalProfileDto) {}

export class UpdateProfessionalDto {
  @ValidateNested()
  @IsObject({ message: "Los datos del usuario deben ser un objeto" })
  @IsOptional()
  @Type(() => UpdateUserDataDto)
  user?: UpdateUserDataDto;

  @ValidateNested()
  @IsObject({ message: "Los datos del perfil profesional deben ser un objeto" })
  @IsOptional()
  @Type(() => UpdateProfileDataDto)
  profile?: UpdateProfileDataDto;
}
