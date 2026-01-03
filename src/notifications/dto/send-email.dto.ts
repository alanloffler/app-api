import { IsEmail, IsString, MinLength } from "class-validator";

export class SendEmailDto {
  @IsEmail(undefined, { message: "Email de formato inválido" })
  to: string;

  @MinLength(3, { message: "El sujeto debe poseer al menos 3 caracteres" })
  @IsString({ message: "El sujeto debe ser una cadena de texto" })
  subject: string;

  @MinLength(3, { message: "El contenido debe poseer al menos 3 caracteres" })
  @IsString({ message: "El contenido debe ser una cadena de texto" })
  text: string;
}
