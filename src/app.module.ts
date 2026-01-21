import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@auth/auth.module";
import { BusinessModule } from "@business/business.module";
import { CacheConfigModule } from "@config/cache-config.module";
import { EventsModule } from "@events/events.module";
import { NotificationsModule } from "@notifications/notifications.module";
import { PermissionsModule } from "@permissions/permissions.module";
import { ProfessionalProfileModule } from "@professional-profile/professional-profile.module";
import { RolesModule } from "@roles/roles.module";
import { SettingsModule } from "@settings/settings.module";
import { UsersModule } from "@users/users.module";
import { typeOrmConfig } from "@config/typeorm.config";

@Module({
  imports: [
    CacheConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
    }),
    AuthModule,
    BusinessModule,
    EventsModule,
    NotificationsModule,
    PermissionsModule,
    ProfessionalProfileModule,
    RolesModule,
    SettingsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
