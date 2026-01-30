import { IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreatePatientProfileDto } from "@patient-profile/dto/create-patient-profile.dto";
import { CreateUserDto } from "@users/dto/create-user.dto";

export class CreatePatientDto {
  @ValidateNested()
  @IsNotEmptyObject({}, { message: "Los datos del usuario son obligatorios" })
  @IsObject({ message: "Los datos del usuario deben ser un objeto" })
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @IsNotEmptyObject({}, { message: "Los datos del perfil de paciente son obligatorios" })
  @IsObject({ message: "Los datos del perfil de paciente deben ser un objeto" })
  @Type(() => CreatePatientProfileDto)
  profile: CreatePatientProfileDto;
}
