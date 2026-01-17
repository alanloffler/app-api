import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Business } from "@business/entities/business.entity";
import { BusinessController } from "@business/business.controller";
import { BusinessService } from "@business/business.service";

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
