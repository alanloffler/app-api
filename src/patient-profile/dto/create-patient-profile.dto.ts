import { IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreatePatientProfileDto {
  @MaxLength(20, { message: "El género debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "El género debe tener al menos 3 caracteres" })
  @IsString({ message: "El género debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El género es obligatorio" })
  gender: string;

  @Length(10, 10, { message: "La fecha de nacimiento debe tener 10 caracteres" })
  @IsString({ message: "La fecha de nacimiento debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria" })
  birthDay: Date;

  @MaxLength(20, { message: "El tipo de sangre debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "El tipo de sangre debe tener al menos 3 caracteres" })
  @IsString({ message: "El tipo de sangre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El tipo de sangre es obligatorio" })
  bloodType: string;

  @Type(() => Number)
  @Transform(({ value }) => (typeof value === "string" ? Number(value.replace(",", ".")) : value))
  @IsNumber({ maxDecimalPlaces: 3 }, { message: "El peso debe ser un número válido" })
  @Min(0.001, { message: "El peso debe ser mayor o igual a 0,001 kg" })
  @Max(999.99, { message: "El peso debe ser menor o igual a 999,99 kg" })
  @IsNotEmpty({ message: "El peso es obligatorio" })
  weight: number;

  @Type(() => Number)
  @IsInt({ message: "La altura debe ser un número entero" })
  @Min(30, { message: "La altura mínima es 30 cm" })
  @Max(300, { message: "La altura máxima es 300 cm" })
  @IsNotEmpty({ message: "La altura es obligatoria" })
  height: number;

  @MaxLength(50, { message: "El contacto de emergencia debe tener como máximo 50 caracteres" })
  @MinLength(3, { message: "El contacto de emergencia debe tener al menos 3 caracteres" })
  @IsString({ message: "El contacto de emergencia debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El contacto de emergencia es obligatorio" })
  emergencyContactName: string;

  @Length(10, 10, { message: "El teléfono de emergencia debe tener 10 caracteres" })
  @IsString({ message: "El teléfono de emergencia debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El teléfono de emergencia es obligatorio" })
  emergencyContactPhone: string;
}
