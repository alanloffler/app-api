import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Business } from "@business/entities/business.entity";
import { BusinessController } from "@business/business.controller";
import { BusinessService } from "@business/business.service";
import { Permission } from "@permissions/entities/permission.entity";
import { Role } from "@roles/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Business, Permission, Role])],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
