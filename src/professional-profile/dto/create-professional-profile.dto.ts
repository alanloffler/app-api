import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateProfessionalProfileDto {
  @MaxLength(20, { message: "La matrícula debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "La matrícula debe tener al menos 3 caracteres" })
  @IsString({ message: "La matrícula debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La matrícula es obligatoria" })
  licenseId: string;

  @MaxLength(20, { message: "El prefijo profesional debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "El prefijo profesional debe tener al menos 3 caracteres" })
  @IsString({ message: "El prefijo profesional debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El prefijo profesional es obligatorio" })
  professionalPrefix: string;

  @MaxLength(20, { message: "La especialidad debe tener como máximo 20 caracteres" })
  @MinLength(3, { message: "La especialidad debe tener al menos 3 caracteres" })
  @IsString({ message: "La especialidad debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La especialidad es obligatoria" })
  specialty: string;

  @IsInt({ each: true, message: "Cada día laboral debe ser un número entero" })
  @Min(0, { each: true, message: "El día laboral mínimo es 0 (Domingo)" })
  @Max(6, { each: true, message: "El día máximo es 6 (Sábado)" })
  @ArrayNotEmpty({ message: "Debes agregar al menos un día laboral" })
  @IsArray({ message: "Los días laborales deben ser un array" })
  workingDays: number[];

  @Length(5, 5, { message: "El horario de inicio debe tener formato HH:MM" })
  @IsString({ message: "El horario de inicio debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El horario de inicio es obligatorio" })
  startHour: string;

  @Length(5, 5, { message: "El horario de fin debe tener formato HH:MM" })
  @IsString({ message: "El horario de fin debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El horario de fin es obligatorio" })
  endHour: string;

  @Matches(/^\d{1,3}$/, { message: "La duración del turno es un número de entre 1 y 3 dígitos" })
  @IsString({ message: "La duración del turno debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La duración del turno es obligatoria" })
  slotDuration: string;

  @Length(5, 5, { message: "El horario de inicio de excepción debe tener formato HH:MM" })
  @IsString({ message: "El horario de inicio de excepción debe ser una cadena de texto" })
  @IsOptional()
  dailyExceptionStart?: string;

  @Length(5, 5, { message: "El horario de fin de excepción debe tener formato HH:MM" })
  @IsString({ message: "El horario de fin de excepción debe ser una cadena de texto" })
  @IsOptional()
  dailyExceptionEnd?: string;
}
