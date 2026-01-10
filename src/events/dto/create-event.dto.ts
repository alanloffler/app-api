import { IsDate, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {
  @MinLength(3, { message: "El título debe tener al menos 3 caracteres" })
  @IsString({ message: "El título debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El título es obligatorio" })
  title: string;

  @Type(() => Date)
  @IsDate({ message: "Formato de fecha de inicio incorrecto" })
  @IsNotEmpty({ message: "La fecha y hora de inicio es obligatoria" })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: "Formato de fecha de finalización incorrecto" })
  @IsNotEmpty({ message: "La fecha y hora de finalización es obligatoria" })
  endDate: Date;

  @IsUUID(4, { message: "El id del profesional debe ser un UUID" })
  @IsNotEmpty({ message: "El profesional es obligatorio" })
  professionalId: string;

  @IsUUID(4, { message: "El id del usuario debe ser un UUID" })
  @IsNotEmpty({ message: "El usuario es obligatorio" })
  userId: string;
}
