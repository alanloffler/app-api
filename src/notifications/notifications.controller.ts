import { Controller, Post, Body } from "@nestjs/common";

import { NotificationsService } from "@notifications/notifications.service";
import { SendEmailDto } from "@notifications/dto/send-email.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("email")
  async sendEmail(@Body() dto: SendEmailDto) {
    return await this.notificationsService.sendEmail(dto);
  }
}
