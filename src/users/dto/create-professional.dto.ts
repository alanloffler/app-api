import { IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateProfessionalProfileDto } from "@professional-profile/dto/create-professional-profile.dto";
import { CreateUserDto } from "@users/dto/create-user.dto";

export class CreateProfessionalDto {
  @ValidateNested()
  @IsNotEmptyObject({}, { message: "Los datos del usuario son obligatorios" })
  @IsObject({ message: "Los datos del usuario deben ser un objeto" })
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @IsNotEmptyObject({}, { message: "Los datos del perfil profesional son obligatorios" })
  @IsObject({ message: "Los datos del perfil profesional deben ser un objeto" })
  @Type(() => CreateProfessionalProfileDto)
  profile: CreateProfessionalProfileDto;
}
