import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateProfessionalProfileDto {
  @IsUUID()
  @IsNotEmpty({ message: "El ID es obligatorio" })
  userId: string;

  @MaxLength(20, { message: "La matrícula debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "La matrícula debe tener al menos 3 caracteres" })
  @IsNotEmpty({ message: "La matrícula es obligatoria" })
  licenseId: string;

  @MaxLength(20, { message: "La especialidad debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "La especialidad debe tener al menos 3 caracteres" })
  @IsNotEmpty({ message: "La especialidad es obligatoria" })
  specialty: string;

  @IsInt({ each: true, message: "Cada día laboral debe ser un número entero" })
  @Min(0, { message: "El día laboral mínimo es 0 (Domingo)" })
  @Max(6, { message: "El día máximo es 6 (Sábado)" })
  @ArrayNotEmpty({ message: "Debes agregar al menos un día laboral" })
  @IsArray({ message: "Los días laborales deben ser un array" })
  workingDays: number[];
}
