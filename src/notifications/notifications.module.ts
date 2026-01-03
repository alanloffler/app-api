import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { NotificationsController } from "@notifications/notifications.controller";
import { NotificationsService } from "@notifications/notifications.service";

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
