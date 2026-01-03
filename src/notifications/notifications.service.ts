import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Resend } from "resend";

import { ApiResponse } from "@common/helpers/api-response.helper";
import { SendEmailDto } from "@notifications/dto/send-email.dto";

@Injectable()
export class NotificationsService {
  private readonly from: string;
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");

    this.from = this.configService.get<string>("EMAIL_FROM")!;
    this.resend = new Resend(apiKey);
  }

  async sendEmail(dto: SendEmailDto) {
    const { subject, text, to } = dto;

    const response = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html: text,
    });

    if (response.error) {
      throw new HttpException(`Error al enviar el email: ${response.error.message}`, HttpStatus.BAD_REQUEST);
    }

    return ApiResponse.success(`Email enviado con éxito a ${to}`, response);
  }
}
